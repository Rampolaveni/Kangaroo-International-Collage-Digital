from rest_framework import viewsets
from apps.users.permissions import IsAdminOrSuperAdmin
from .models import Campus, Course
from .serializers import CampusSerializer, CourseSerializer


class CampusViewSet(viewsets.ModelViewSet):
    queryset = Campus.objects.all()
    serializer_class = CampusSerializer
    permission_classes = [IsAdminOrSuperAdmin]

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.select_related('campus').all()
    serializer_class = CourseSerializer
    permission_classes = [IsAdminOrSuperAdmin]
