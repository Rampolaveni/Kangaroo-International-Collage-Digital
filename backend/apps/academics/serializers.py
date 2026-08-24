from rest_framework import serializers
from .models import Campus, Course


class CampusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campus
        fields = [
            'id', 'name', 'address', 'city', 'phone', 'email',
            'capacity', 'timezone', 'is_active', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class CourseSerializer(serializers.ModelSerializer):
    campus_name = serializers.CharField(source='campus.name', read_only=True)

    class Meta:
        model = Course
        fields = [
            'id', 'campus', 'campus_name', 'name', 'code', 'description',
            'duration_weeks', 'fee', 'start_date', 'end_date', 'max_students',
            'is_active', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate(self, data):
        start = data.get('start_date', getattr(self.instance, 'start_date', None))
        end = data.get('end_date', getattr(self.instance, 'end_date', None))
        if start and end and end <= start:
            raise serializers.ValidationError("end_date must be after start_date.")
        return data