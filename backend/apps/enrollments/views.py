from rest_framework import viewsets
from apps.users.permissions import IsAdminOrSuperAdmin
from .models import Enrollment
from .serializers import EnrollmentSerializer


class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.select_related('student', 'course').all()
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAdminOrSuperAdmin]