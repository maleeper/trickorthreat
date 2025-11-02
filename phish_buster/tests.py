from django.test import TestCase, Client
from django.urls import reverse
from .models import Question, PlayerSession, PlayerAnswer


class QuizNoDuplicateQuestionsTestCase(TestCase):
    """Test that the quiz does not present duplicate questions to a user."""

    def setUp(self):
        """Create test questions."""
        # Create 15 test questions
        for i in range(15):
            Question.objects.create(
                type='email',
                sender=f'test{i}@example.com',
                subject=f'Test Subject {i}',
                body=f'Test body {i}',
                content=f'Test content {i}',
                tactic_context=f'Test tactic {i}',
                is_phishing=(i % 2 == 0),  # Alternate between phishing and not
            )

    def test_no_duplicate_questions_in_quiz(self):
        """Test that a user doesn't get the same question twice."""
        client = Client()

        # Start a quiz session
        response = client.post(
            reverse('quiz'),
            data={'username': 'testuser'},
        )
        # Follow redirect to quiz with session_id
        self.assertEqual(response.status_code, 302)
        session_id = response.url.split('/')[-2]

        # Track questions we've seen
        seen_question_ids = set()

        # Answer 10 questions (QUESTIONS_PER_ROUND)
        for i in range(10):
            # Get a question
            response = client.get(reverse('quiz_with_session_id', args=[session_id]))
            self.assertEqual(response.status_code, 200)

            # Extract question ID from response context
            question = response.context['question']
            self.assertIsNotNone(question, f"Question {i+1} should not be None")

            question_id = question.id

            # Check that we haven't seen this question before
            self.assertNotIn(
                question_id,
                seen_question_ids,
                f"Question {question_id} was shown twice!"
            )

            seen_question_ids.add(question_id)

            # Submit an answer
            response = client.post(
                reverse('quiz_with_session_id', args=[session_id]),
                data={
                    'answer': {
                        'question': question_id,
                        'choice': 'phish',
                        'time_left': 30,
                    }
                },
                content_type='application/json',
                HTTP_X_REQUESTED_WITH='XMLHttpRequest',
            )
            self.assertEqual(response.status_code, 200)

        # Verify we got 10 unique questions
        self.assertEqual(len(seen_question_ids), 10)
