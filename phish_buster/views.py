import json
import random
import re
from django.shortcuts import render
from django.http import JsonResponse
from .models import Question, PlayerSession, PlayerAnswer
from .urlscan import UrlScanApiService


# Quiz settings
QUESTIONS_PER_ROUND = 10
TIMER_SECS_PER_QUESTION = 300


def home(request):
    return render(
        request=request,
        template_name='phish_buster/index.html',
    )


def team(request):
    """
    Displays the team page with all Phantom Phishers members.
    """
    return render(
        request=request,
        template_name='phish_buster/team.html',
    )


def scanner(request):
    """
    Handles AJAX POST for URL scanning (urlscan.io API).
    Renders the scanner page for GET requests.
    """
    if (
        request.method == "POST"
        and request.headers.get("x-requested-with") == "XMLHttpRequest"
    ):
        try:
            data = json.loads(request.body)
            url = data.get("url")
            uuid = data.get("uuid")
            if url:
                # Step 1: Submit scan, return uuid
                submission_json = UrlScanApiService.submit_scan(url)
                uuid = submission_json.get("uuid")
                if not uuid:
                    return JsonResponse(
                        {
                            "success": False,
                            "error": "No uuid returned from urlscan.io."
                        },
                        status=502,
                    )
                return JsonResponse(
                    {
                        "success": True,
                        "uuid":
                            uuid,
                        "status": "pending",
                    }
                )
            elif uuid:
                # Step 2: Poll for result
                result_json = UrlScanApiService.get_scan_result(
                    uuid,
                    max_wait=1
                )
                if result_json:
                    resp = {
                        "success": True,
                        "result": result_json,
                        "status": "complete",
                    }
                    return JsonResponse(resp)
                else:
                    return JsonResponse({"success": True, "status": "pending"})
            else:
                return JsonResponse(
                    {
                        "success": False,
                        "error": "Missing 'url' or 'uuid' in request body"
                     },
                    status=400,
                )
        except Exception as e:
            return JsonResponse({
                "success": False,
                "error": str(e)},
                status=400
            )

    # GET: render scanner page
    return render(
        request=request,
        template_name='phish_buster/scanner.html',
    )


def quiz(request, session_id=None):
    """
    Displays a question related to model:`Question`
    Handles AJAX POST for quiz answers.
    """
    session = None
    if session_id is not None:
        session = PlayerSession.objects.filter(
            id=session_id
        ).first()

    if request.method == "POST" and (
        request.headers.get("x-requested-with") == "XMLHttpRequest"
    ):
        data = json.loads(request.body)
        user_answer = data.get("answer", {})

        print("POST body:", data)

        question_id = int(user_answer.get("question"))
        choice = user_answer.get("choice")
        try:
            secs_left = int(user_answer.get("time_left"))
        except (ValueError, TypeError):
            secs_left = 0

        selected_q = Question.objects.filter(id=question_id).first()
        if selected_q is None or choice not in {"phish", "treat"}:
            return JsonResponse(
                {"success": False, "error": "Invalid answer payload"},
                status=400,
            )

        result = check_result(
            question=selected_q,
            choice=choice,
            secs_left=secs_left,
        )

        if session:
            PlayerAnswer.objects.create(
                session=session,
                question=selected_q,
                selected_ans=(choice == "phish"),
                is_correct=result["correct"],
            )
            # Add to session score
            session.score += result["score"]
            session.save()
            # Update result["score"] to reflect total score
            result["score"] = session.score

        return JsonResponse(result)

    # Handle GET requests
    if session is None:
        session = PlayerSession.objects.create(username="anonymous", score=0)

    questions = Question.objects.all()

    # Filter out used questions
    # used_question_ids = request.session.get("used_question_ids", [])
    used_question_ids = [question.id for question in session.answers.all()]
    unused_questions = [
        q for q in questions
        if q.id not in used_question_ids
    ]

    # Select a question to render
    question = random.choice(unused_questions) if unused_questions else None
    formatted_body = format_question(question) if question else ""

    if question:
        used_question_ids.append(question.id)
        request.session["used_question_ids"] = used_question_ids

    # Check end of round
    game_over = len(used_question_ids) >= QUESTIONS_PER_ROUND

    # Clear session if game is over
    if game_over:
        request.session["used_question_ids"] = []

    return render(
        request=request,
        context={
            'session_id': session.id,
            'question': question,
            'question_body_formatted': formatted_body,
            'question_number': len(used_question_ids),
            'total_questions': QUESTIONS_PER_ROUND,
            'end_round': game_over,
            'score': session.score,
            'timer_value': TIMER_SECS_PER_QUESTION,
        },
        template_name='phish_buster/quiz.html',
    )


def check_result(question, choice, secs_left):
    """
    Checks result and Calculates user score out of 10 based on time left.
    Full score (10) if answered instantly, 0 if secs_left is 0.
    """
    user_correct = (
        (question.is_phishing and choice == "phish")
        or (not question.is_phishing and choice == "treat")
    )

    # Only award score if correct
    if user_correct and secs_left is not None:
        # Clamp secs_left between 0 and TIMER_SECS_PER_QUESTION
        secs_left = max(0, min(secs_left, TIMER_SECS_PER_QUESTION))
        score = round((secs_left / TIMER_SECS_PER_QUESTION) * 10)
    else:
        score = 0

    return {
        "success": True,
        "received": choice,
        "explanation": question.tactic_context,
        "tips": "Maybe add some tips",
        "correct": user_correct,
        "score": score,
    }


def format_question(question):
    """
    Replace [Link: '...'] or [Hyperlinked Button: '...'] in question.body
    with an anchor tag using question.link. If the pattern is not found and
    link exists, append the link as an anchor tag at the end. Also replaces
    \n with <br> for HTML line breaks. Returns a string with the formatted
    body.
    """
    if not question or not question.body:
        return ""
    body = question.body
    # Match [Link: '...'] or [Hyperlinked Button: '...']
    pattern = r"\[(?:Link|Hyperlinked Button): '(.*?)'\]"
    link_inserted = False
    if question.link:
        def replacer(m):
            nonlocal link_inserted
            link_inserted = True
            return (
                f'<a href="{question.link}" target="_blank">{m.group(1)}</a>'
            )
        body = re.sub(pattern, replacer, body)
    if not link_inserted:
        # Append the link as an anchor tag at the end
        body += (
            f' <a href="{question.link}" target="_blank">'
            f'{question.link}</a>'
        )
    # Replace \n with <br>
    body = body.replace('\n', '<br>')
    return body
