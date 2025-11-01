"""Defines the database models for Questions, PlayerSessions, PlayerAnswers,
and LeaderboardEntries."""

from django.db import models


# Create your models here.
class Question(models.Model):
    """A model representing a phishing identification question."""

    type = models.CharField(max_length=100)  # e.g. 'email', 'sms', 'webpage'
    sender = models.CharField(max_length=200)
    subject = models.CharField(max_length=200)
    body = models.TextField()
    content = models.TextField(blank=True, null=True)
    tactic_context = models.TextField(max_length=500)
    link = models.URLField(blank=True, null=True)
    attachments = models.CharField(max_length=100, blank=True, null=True)
    is_phishing = models.BooleanField()


class PlayerSession(models.Model):
    """A model representing a player's session."""

    username = models.CharField(max_length=20)  # arcade-style nickname
    score = models.IntegerField(default=0)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Session:{self.username}-{self.start_time}"


class PlayerAnswer(models.Model):
    """A model representing a player's answer to a question."""

    session = models.ForeignKey(
        PlayerSession,
        on_delete=models.CASCADE,
        related_name="answers",
    )
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_ans = models.BooleanField()  # what the player chose
    is_correct = models.BooleanField()  # whether they got it right

    def __str__(self):
        return f"Answer - {self.session}"



class LeaderboardEntry(models.Model):
    """A model representing a leaderboard entry."""

    username = models.CharField(max_length=20)
    score = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)
