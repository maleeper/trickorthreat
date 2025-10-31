from django.urls import path
from . import views

urlpatterns = [
    path('quiz', views.quiz, name='quiz'),
    path('', views.home, name='home'),
]
