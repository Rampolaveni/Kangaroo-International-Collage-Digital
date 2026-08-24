from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from apps.users.permissions import IsAdminOrSuperAdmin
from .models import Student
from .serializers import StudentSerializer, StudentCreateSerializer
from django.core.mail import send_mail
from django.conf import settings
from .serializers import BulkEmailSerializer


class StudentBulkEmailView(APIView):
    permission_classes = [IsAdminOrSuperAdmin]

    def post(self, request):
        serializer = BulkEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        students = Student.objects.filter(id__in=data['student_ids']).select_related('user')

        sent, failed = [], []
        for student in students:
            recipient = student.user.email
            if not recipient:
                failed.append({'student_id': student.student_id, 'reason': 'No email on file'})
                continue
            try:
                send_mail(
                    subject=f"[{data['category']}] {data['subject']}",
                    message=data['message'],
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[recipient],
                    fail_silently=False,
                )
                sent.append(student.student_id)
            except Exception as e:
                failed.append({'student_id': student.student_id, 'reason': str(e)})

        return Response({'sent': sent, 'failed': failed, 'total': len(students)})


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.select_related('user', 'campus', 'updated_by').all()
    serializer_class = StudentSerializer
    permission_classes = [IsAdminOrSuperAdmin]

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)


class StudentCreateView(APIView):
    permission_classes = [IsAdminOrSuperAdmin]

    def post(self, request):
        serializer = StudentCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        student = serializer.save()
        return Response(StudentSerializer(student).data, status=status.HTTP_201_CREATED)