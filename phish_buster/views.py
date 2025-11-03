import json
import random
import re
from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import Question, PlayerSession, PlayerAnswer, LeaderboardEntry
from .urlscan import UrlScanApiService


# Quiz settings
QUESTIONS_PER_ROUND = 10
TIMER_SECS_PER_QUESTION = 50


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
    Handles AJAX POST for quiz answers and starting a new quiz session.
    """
    session = None
    if session_id is not None:
        session = PlayerSession.objects.filter(id=session_id).first()

    # Handle POST: Start Quiz (AJAX or form)
    if session_id is None and request.method == "POST":
        # Support both AJAX and form POST
        if request.headers.get("x-requested-with") == "XMLHttpRequest":
            data = json.loads(request.body)
            username = data.get("username", "").strip()[:20] or "anonymous"
            session = PlayerSession.objects.create(username=username, score=0)
            return JsonResponse({"session_id": session.id})
        else:
            # Fallback for non-AJAX form POST
            username = request.POST.get("username", "anonymous").strip()[:20]
            session = PlayerSession.objects.create(username=username, score=0)
            return redirect("quiz_with_session_id", session_id=session.id)

    # Handle POST: Quiz answer
    if session_id is not None and request.method == "POST" and (
        request.headers.get("x-requested-with") == "XMLHttpRequest"
    ):
        data = json.loads(request.body)
        user_answer = data.get("answer", {})

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

    # Handle GET requests (or initial page load)
    if session is None:
        return render(
            request=request,
            context={
                'session_id': None,
                'question': None,
                'question_body_formatted': None,
                'question_number': 0,
                'total_questions': QUESTIONS_PER_ROUND,
                'end_round': False,
                'score': 0,
                'timer_value': TIMER_SECS_PER_QUESTION,
            },
            template_name='phish_buster/quiz.html',
        )

    questions = Question.objects.all()
    used_question_ids = [answer.question_id for answer in session.answers.all()]
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
            'session_id': session.id if session else None,
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


def leaderboard(request, session_id=None):
    """
    If session_id is provided, show session stats and leaderboard.
    If not, show only top 10 leaderboard entries.
    """
    session = None
    session_answers = []
    score = 0
    questions_attempted = 0
    correct_answers = 0
    accuracy_percent = 0

    if session_id is not None:
        session = PlayerSession.objects.filter(id=session_id).first()
        if session:
            score = session.score
            session_answers = session.answers.select_related('question').all()
            questions_attempted = session_answers.count()
            correct_answers = session_answers.filter(is_correct=True).count()
            accuracy_percent = (correct_answers / questions_attempted * 100) if questions_attempted else 0

            # Only create entry if not already present for this username and score
            exists = LeaderboardEntry.objects.filter(
                username=session.username, score=session.score
            ).exists()
            if not exists:
                LeaderboardEntry.objects.create(
                    username=session.username,
                    score=session.score,
                )

    leaderboard_entries = LeaderboardEntry.objects.order_by('-score', '-timestamp')[:10]
    context = {
        "leaderboard_entries": leaderboard_entries,
        "session_id": session_id,
    }
    if session_id is not None and session:
        context.update({
            "score": score,
            "questions_attempted": questions_attempted,
            "correct_answers": correct_answers,
            "accuracy_percent": accuracy_percent,
            "session_answers": session_answers,
        })
    return render(
        request=request,
        context=context,
        template_name='phish_buster/leaderboard.html',
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
        "explanation": question.content,
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
