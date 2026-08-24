from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import StudentBulkEmailView, StudentViewSet, StudentCreateView

router = DefaultRouter()
router.register('students', StudentViewSet, basename='student')

urlpatterns = [
    path('students/create-with-account/', StudentCreateView.as_view(), name='student_create_with_account'),
    path('students/bulk-email/', StudentBulkEmailView.as_view(), name='student_bulk_email'),
] + router.urls