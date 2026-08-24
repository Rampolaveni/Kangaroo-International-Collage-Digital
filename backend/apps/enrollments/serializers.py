from rest_framework import serializers
from .models import Enrollment


class EnrollmentSerializer(serializers.ModelSerializer):
    student_username = serializers.CharField(source='student.username', read_only=True)
    course_code = serializers.CharField(source='course.code', read_only=True)
    course_name = serializers.CharField(source='course.name', read_only=True)

    class Meta:
        model = Enrollment
        fields = [
            'id', 'student', 'student_username', 'course', 'course_code', 'course_name',
            'status', 'enrolled_at', 'updated_at',
        ]
        read_only_fields = ['id', 'enrolled_at', 'updated_at']
        validators = []

    def validate_student(self, value):
        if value.role != 'STUDENT':
            raise serializers.ValidationError("Selected user is not a Student.")
        return value

    def validate(self, data):
        student = data.get('student', getattr(self.instance, 'student', None))
        course = data.get('course', getattr(self.instance, 'course', None))
        status = data.get('status', Enrollment.Status.ACTIVE)

        # Rule 1: no duplicate ACTIVE enrollment for the same student+course
        if status == Enrollment.Status.ACTIVE:
            existing = Enrollment.objects.filter(
                student=student, course=course, status=Enrollment.Status.ACTIVE
            )
            if self.instance:
                existing = existing.exclude(pk=self.instance.pk)
            if existing.exists():
                raise serializers.ValidationError(
                    "This student already has an active enrollment in this course."
                )

        # Rule 2: course capacity check (only relevant for new active enrollments)
        if status == Enrollment.Status.ACTIVE and course:
            active_count = Enrollment.objects.filter(
                course=course, status=Enrollment.Status.ACTIVE
            )
            if self.instance:
                active_count = active_count.exclude(pk=self.instance.pk)

            if active_count.count() >= course.max_students:
                raise serializers.ValidationError(
                    f"Course '{course.code}' has reached its maximum capacity of {course.max_students} students."
                )

        return data