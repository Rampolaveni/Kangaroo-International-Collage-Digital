from django.db import models
from django.conf import settings
from apps.academics.models import Campus


class Student(models.Model):
    class Gender(models.TextChoices):
        MALE = 'MALE', 'Male'
        FEMALE = 'FEMALE', 'Female'
        OTHER = 'OTHER', 'Other'
        UNSPECIFIED = 'UNSPECIFIED', 'Prefer not to say'

    class CitizenStatus(models.TextChoices):
        AUSTRALIAN_CITIZEN = 'AU_CITIZEN', 'Australian Citizen'
        PERMANENT_RESIDENT = 'PERMANENT_RESIDENT', 'Permanent Resident'
        STUDENT_VISA = 'STUDENT_VISA', 'Student Visa'
        OTHER_VISA = 'OTHER_VISA', 'Other Visa'

    class IndigenousStatus(models.TextChoices):
        YES = 'YES', 'Yes'
        NO = 'NO', 'No'
        PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY', 'Prefer not to say'

    class EmploymentStatus(models.TextChoices):
        FULL_TIME = 'FULL_TIME', 'Full-time employee'
        PART_TIME = 'PART_TIME', 'Part-time employee'
        SELF_EMPLOYED = 'SELF_EMPLOYED', 'Self-employed'
        UNEMPLOYED = 'UNEMPLOYED', 'Unemployed'
        NOT_IN_LABOUR_FORCE = 'NOT_IN_LABOUR_FORCE', 'Not in labour force'

    class EnglishProficiency(models.TextChoices):
        VERY_WELL = 'VERY_WELL', 'Spoken Very Well'
        WELL = 'WELL', 'Spoken Well'
        NOT_WELL = 'NOT_WELL', 'Not Well'
        NOT_AT_ALL = 'NOT_AT_ALL', 'Not at all'

    class SurveyContactStatus(models.TextChoices):
        INCLUDED = 'INCLUDED', 'Included in survey use'
        EXCLUDED = 'EXCLUDED', 'Excluded from survey use'

    class Status(models.TextChoices):
        ACTIVE = 'ACTIVE', 'Active'
        ON_LEAVE = 'ON_LEAVE', 'On Leave'
        GRADUATED = 'GRADUATED', 'Graduated'
        WITHDRAWN = 'WITHDRAWN', 'Withdrawn'

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='student_profile',
    )

    # Identity
    student_id = models.CharField(max_length=20, unique=True, editable=False)
    usi = models.CharField('USI', max_length=20, blank=True)
    usi_verified = models.BooleanField('USI Verified', default=False)
    optional_id = models.CharField(max_length=50, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=20, choices=Gender.choices, blank=True)
    mobile_phone = models.CharField(max_length=20, blank=True)
    postal_address = models.CharField(max_length=255, blank=True)
    street_address = models.CharField(max_length=255, blank=True)

    # VET Related Details
    citizen_status = models.CharField(max_length=30, choices=CitizenStatus.choices, blank=True)
    country_of_birth = models.CharField(max_length=100, blank=True)
    city_of_birth = models.CharField(max_length=100, blank=True)
    citizenship = models.CharField(max_length=100, blank=True)
    indigenous_status = models.CharField(max_length=30, choices=IndigenousStatus.choices, blank=True)
    employment_status = models.CharField(max_length=30, choices=EmploymentStatus.choices, blank=True)
    occupation_identifier = models.CharField(max_length=100, blank=True)
    industry_of_employment = models.CharField(max_length=100, blank=True)
    language = models.CharField(max_length=100, blank=True)
    english_proficiency = models.CharField(max_length=20, choices=EnglishProficiency.choices, blank=True)
    needs_english_assistance = models.BooleanField(default=False)
    highest_education = models.CharField(max_length=150, blank=True)
    attending_other_school = models.BooleanField(default=False)
    survey_contact_status = models.CharField(max_length=20, choices=SurveyContactStatus.choices, blank=True)

    # CRICOS / International compliance
    passport_number = models.CharField(max_length=50, blank=True)
    visa_type = models.CharField(max_length=100, blank=True)
    visa_expiry_date = models.DateField(null=True, blank=True)

    # Emergency contact
    emergency_contact_name = models.CharField(max_length=150, blank=True)
    emergency_contact_relationship = models.CharField(max_length=50, blank=True)
    emergency_contact_phone = models.CharField(max_length=20, blank=True)

    # Academic
    campus = models.ForeignKey(Campus, on_delete=models.PROTECT, related_name='students')
    enrollment_date = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)

    # System tracking
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='students_updated',
    )

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.student_id:
            last = Student.objects.order_by('-id').first()
            next_num = (last.id + 1) if last else 1
            self.student_id = f"S{1000000 + next_num}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.student_id} - {self.user.username}"