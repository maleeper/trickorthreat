from django.contrib import admin
from .models import Question, PlayerSession, PlayerAnswer


admin.site.register(Question)
admin.site.register(PlayerSession)
admin.site.register(PlayerAnswer)
