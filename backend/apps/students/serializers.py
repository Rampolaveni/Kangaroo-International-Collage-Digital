from django.db import transaction
from rest_framework import serializers
from apps.users.models import User
from .models import Student


class StudentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    campus_name = serializers.CharField(source='campus.name', read_only=True)
    updated_by_username = serializers.CharField(source='updated_by.username', read_only=True, default=None)

    class Meta:
        model = Student
        fields = [
            'id', 'user', 'username', 'email', 'student_id',
            'usi', 'usi_verified', 'optional_id', 'date_of_birth', 'gender',
            'mobile_phone', 'postal_address', 'street_address',
            'citizen_status', 'country_of_birth', 'city_of_birth', 'citizenship',
            'indigenous_status', 'employment_status', 'occupation_identifier',
            'industry_of_employment', 'language', 'english_proficiency',
            'needs_english_assistance', 'highest_education', 'attending_other_school',
            'survey_contact_status', 'passport_number', 'visa_type', 'visa_expiry_date',
            'emergency_contact_name', 'emergency_contact_relationship', 'emergency_contact_phone',
            'campus', 'campus_name', 'enrollment_date', 'status',
            'created_at', 'updated_at', 'updated_by', 'updated_by_username',
        ]
        read_only_fields = ['id', 'student_id', 'enrollment_date', 'created_at', 'updated_at', 'updated_by']


class StudentCreateSerializer(serializers.Serializer):
    # User account fields
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField(required=False, allow_blank=True)
    first_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, min_length=8)

    # Student profile fields (all optional at creation except campus)
    campus = serializers.PrimaryKeyRelatedField(queryset=Student._meta.get_field('campus').related_model.objects.all())
    usi = serializers.CharField(required=False, allow_blank=True)
    date_of_birth = serializers.DateField(required=False, allow_null=True)
    gender = serializers.ChoiceField(choices=Student.Gender.choices, required=False, allow_blank=True)
    mobile_phone = serializers.CharField(required=False, allow_blank=True)
    citizen_status = serializers.ChoiceField(choices=Student.CitizenStatus.choices, required=False, allow_blank=True)
    citizenship = serializers.CharField(required=False, allow_blank=True)
    passport_number = serializers.CharField(required=False, allow_blank=True)
    visa_type = serializers.CharField(required=False, allow_blank=True)
    visa_expiry_date = serializers.DateField(required=False, allow_null=True)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value

    @transaction.atomic
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data.pop('username'),
            email=validated_data.pop('email', ''),
            first_name=validated_data.pop('first_name', ''),
            last_name=validated_data.pop('last_name', ''),
            password=validated_data.pop('password'),
            role='STUDENT',
        )
        student = Student.objects.create(user=user, **validated_data)
        return student

class BulkEmailSerializer(serializers.Serializer):
    student_ids = serializers.ListField(child=serializers.IntegerField(), min_length=1)
    category = serializers.ChoiceField(choices=[
        ('GENERAL', 'General Announcement'),
        ('SCHEDULE', 'Schedule Notice'),
        ('WARNING', 'Warning'),
        ('COMPLIANCE', 'Compliance Reminder'),
    ])
    subject = serializers.CharField(max_length=255)
    message = serializers.CharField()