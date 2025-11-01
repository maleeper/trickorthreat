import json
import random
from django.shortcuts import render
from django.http import JsonResponse
from .models import Question, PlayerSession, PlayerAnswer


# Quiz settings
QUESTIONS_PER_ROUND = 10


def home(request):
    return render(
        request=request,
        template_name='phish_buster/index.html',
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

        question_id = int(user_answer.get("question"))
        choice = user_answer.get("choice")

        selected_q = Question.objects.filter(id=question_id).first()
        if selected_q is None or choice not in {"phish", "treat"}:
            return JsonResponse(
                {"success": False, "error": "Invalid answer payload"},
                status=400,
            )

        user_correct = (
            (selected_q.is_phishing and choice == "phish")
            or (not selected_q.is_phishing and choice == "treat")
        )

        if session:
            PlayerAnswer.objects.create(
                session=session,
                question=selected_q,
                selected_ans=(choice == "phish"),
                is_correct=user_correct,
            )

        return JsonResponse({
            "success": True,
            "received": user_answer,
            "explanation": selected_q.tactic_context,
            "tips": "Maybe add some tips",
            "correct": user_correct,
        })

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
            'question_number': len(used_question_ids),
            'total_questions': QUESTIONS_PER_ROUND,
            'end_round': game_over,
            'score': 0,
        },
        template_name='phish_buster/quiz.html',
    )
