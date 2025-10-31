import json
from django.shortcuts import render
from django.http import JsonResponse


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
    if request.method == "POST" and (
        request.headers.get("x-requested-with") == "XMLHttpRequest"
    ):
        data = json.loads(request.body)
        user_answer = data.get("answer")
        # TODO: Here you can add logic to check the answer, update score, etc.
        return JsonResponse({
            "result": True,
            "received": user_answer,
            "explanation": "Need to add explanation",
            "tips": "Maybe add some tips",
        })

    # TODO: replace with logic to fetch model instances
    question = {
        "id": 1,
        "type": "email",
        "sender": "\"CEO Name\" <[ceo_name].urgent@ci-finance-bacs.com>",
        "subject": "URGENT: Approve Final Payment for Tonight's Halloween Venue/Security",
        "body": "Hi [Recipient Name], I sent a message on Teams this morning—did you miss it? I need you to handle a high-priority, confidential **BACS payment** immediately. We've had a last-minute issue securing the full deposit for the **Halloween party venue and security firm**. We must pay the attached invoice before **2 PM GMT today** or the event will be cancelled. Please process the **BACS form** attached and send a confirmation text message to my personal mobile when complete. Do not share this with anyone. Thank you, [CEO Name]",
        "content": "A high-pressure request for a fraudulent BACS payment, exploiting the time pressure of a company event and referencing a missed internal chat to bypass verification.",
        "tactic_context": "Tactic: **Authority & Urgency**. Targets Finance staff. Reference to a missed internal chat justifies the immediate, urgent email and the breach of normal procedure.",
        "link": "N/A (Attachment Focus)",
        "attachments": "Halloween-Venue-Security-Deposit.docx"
    }

    return render(
            request=request,
            context={
                'question': question,
                'end_round': False,
            },
            template_name='phish_buster/quiz.html',
        )
