from django.urls import path
from . import views

urlpatterns = [
    path('quiz/', views.quiz, name='quiz'),
    path('quiz/<int:session_id>/', views.quiz, name='quiz_with_session_id'),
    path('leaderboard/', views.leaderboard, name='leaderboard'),
    path(
        'leaderboard/<int:session_id>/',
        views.leaderboard,
        name='leaderboard_with_session_id',
    ),
    path('', views.home, name='home'),
    path('team/', views.team, name='team'),
    path('scanner/', views.scanner, name='scanner'),
]
