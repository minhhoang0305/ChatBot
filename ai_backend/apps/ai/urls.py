from django.urls import path
from . import views

urlpatterns = [
    path('ingest/', views.AdminIngestView.as_view(), name='admin-ingest'),
]
