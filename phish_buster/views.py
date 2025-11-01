import json
import random
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.sessions.models import Session


# Quiz settings
QUESTIONS_PER_ROUND = 3


def home(request):
    return render(
        request=request,
        template_name='phish_buster/index.html',
    )


def quiz(request):
    """
    Displays a question related to model:``
    Handles AJAX POST for quiz answers.
    """
    # Temporary data for development
    # TODO: replace with logic to fetch model instances
    questions = [
        {
            "id": 1,
            "type": "email",
            "sender": "\"CEO Name\" <[ceo_name].urgent@ci-finance-bacs.com>",
            "subject": "URGENT: Approve Final Payment for Tonight's Halloween Venue/Security",
            "body": "Hi [Recipient Name], I sent a message on Teams this morning—did you miss it? I need you to handle a high-priority, confidential **BACS payment** immediately. We've had a last-minute issue securing the full deposit for the **Halloween party venue and security firm**. We must pay the attached invoice before **2 PM GMT today** or the event will be cancelled. Please process the **BACS form** attached and send a confirmation text message to my personal mobile when complete. Do not share this with anyone. Thank you, [CEO Name]",
            "content": "A high-pressure request for a fraudulent BACS payment, exploiting the time pressure of a company event and referencing a missed internal chat to bypass verification.",
            "tactic_context": "Tactic: **Authority & Urgency**. Targets Finance staff. Reference to a missed internal chat justifies the immediate, urgent email and the breach of normal procedure.",
            "link": "N/A (Attachment Focus)",
            "attachments": "Halloween-Venue-Security-Deposit.docx",
            "is_phishing": True,
        },
        {
            "id": 2,
            "type": "email",
            "sender": "Code Institute Security <security@ci-support-desk.com>",
            "subject": "**IMMEDIATE ATTENTION**: Phishing Alert - Secure Your Account Before Midnight Lockout",
            "body": "Dear User, **Immediate action required.** We detected a security breach on our network today, **October 31st**. Your account has been quarantined. To prevent **permanent lockout** and a full security reset, you must **verify your identity before midnight (00:00 GMT)**. Click the button below **NOW**. [Hyperlinked Button: 'VERIFY IDENTITY AND UNLOCK ACCOUNT']",
            "content": "A concise, high-pressure alert, optimized for mobile viewing, demanding immediate account verification to avoid service deletion by a hard deadline.",
            "tactic_context": "Tactic: **Fear & Hard Deadline**. Targets all employees/students. The midnight deadline is a psychological anchor tied to the holiday end, forcing a decision before the start of the next day.",
            "link": "http://secure-login-fix.net/verify",
            "attachments": "N/A",
            "is_phishing": False,
        },
        {
            "id": 3,
            "type": "email",
            "sender": "Royal Mail Tracking <service@royal-mail-delivery.site>",
            "subject": "Delivery Failure Notice: Your Costume Parcel is Held Until Fee Paid",
            "body": "We regret to inform you that your parcel delivery with tracking **RM991234567GB** has been suspended. The reason is an insufficient postage/customs fee of **£2.99** applied to the item. To ensure your **last-minute Halloween costume** is delivered **TODAY**, please click the secure link below to pay the fee and reschedule delivery. Failure to pay will result in the parcel being returned to sender.",
            "content": "A notification from a spoofed Royal Mail, preying on the urgent need for a time-sensitive item (a costume) and requesting a micro-fee for delivery.",
            "tactic_context": "Tactic: **Urgent Need & Micro-Fee**. Targets online shoppers. Exploits anxiety over not having a costume for the event tonight, using a low fee (£2.99) that users pay without thinking.",
            "link": "http://package-reschedule-fee.com",
            "attachments": "N/A",
            "is_phishing": False,
        },
    ]

    if request.method == "POST" and (
        request.headers.get("x-requested-with") == "XMLHttpRequest"
    ):
        data = json.loads(request.body)
        user_answer = data.get("answer", {})

        # Validate input and determine answer correctness
        question_id = int(user_answer.get("question"))
        choice = user_answer.get("choice")

        selected_q = next(
            (q for q in questions if q["id"] == question_id),
            None,
        )
        if selected_q is None or choice not in {"phish", "treat"}:
            return JsonResponse(
                {"success": False, "error": "Invalid answer payload"},
                status=400,
            )

        user_correct = (
            (selected_q["is_phishing"] and choice == "phish")
            or (not selected_q["is_phishing"] and choice == "treat")
        )
        return JsonResponse({
            "success": True,
            "received": user_answer,
            "explanation": selected_q["tactic_context"],
            "tips": "Maybe add some tips",
            "correct": user_correct,
        })

    # Filter out used questions and select a question to render
    used_question_ids = request.session.get("used_question_ids", [])
    unused_questions = [
        q for q in questions
        if q["id"] not in used_question_ids
    ]

    question = random.choice(unused_questions) if unused_questions else None
    if question:
        used_question_ids.append(question["id"])
        request.session["used_question_ids"] = used_question_ids

    # Check end of round
    game_over = len(used_question_ids) >= QUESTIONS_PER_ROUND

    # Clear session if game is over
    if game_over:
        request.session["used_question_ids"] = []

    return render(
        request=request,
        context={
            'question': question,
            'end_round': game_over,
        },
        template_name='phish_buster/quiz.html',
    )
