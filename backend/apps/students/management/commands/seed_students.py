import random
from datetime import date, timedelta
from django.core.management.base import BaseCommand
from django.db import transaction
from faker import Faker
from apps.users.models import User
from apps.academics.models import Campus
from apps.students.models import Student

fake = Faker()

NATIONALITIES = ['India', 'China', 'Nepal', 'Vietnam', 'Philippines', 'Brazil', 'Colombia', 'Sri Lanka', 'Bangladesh', 'Indonesia']
LANGUAGES = ['Hindi', 'Mandarin', 'Punjabi', 'Vietnamese', 'Tagalog', 'Portuguese', 'Spanish', 'Sinhala', 'Bengali', 'Indonesian']


class Command(BaseCommand):
    help = 'Seed the database with fake student accounts and profiles for testing.'

    def add_arguments(self, parser):
        parser.add_argument('--count', type=int, default=100, help='Number of students to create')

    def handle(self, *args, **options):
        count = options['count']
        campuses = list(Campus.objects.all())

        if not campuses:
            self.stdout.write(self.style.ERROR('No campuses found. Create at least one Campus before seeding students.'))
            return

        created = 0
        for _ in range(count):
            first_name = fake.first_name()
            last_name = fake.last_name()
            base_username = f"{first_name}.{last_name}".lower().replace(' ', '')
            username = base_username
            count = 1
            suffix = 1
            while User.objects.filter(username=username).exists():
                username = f"{base_username}{suffix}"
                suffix += 1

            with transaction.atomic():
                count = count + 1;
                user = User.objects.create_user(
                    username=username,
                    email=f"rampolaveni13+{count}@gmail.com",
                    first_name=first_name,
                    last_name=last_name,
                    password='TempPass123!',
                    role='STUDENT',
                )

                dob = fake.date_of_birth(minimum_age=18, maximum_age=35)
                visa_expiry = date.today() + timedelta(days=random.randint(30, 900))

                Student.objects.create(
                    user=user,
                    campus=random.choice(campuses),
                    usi=fake.bothify(text='??????????').upper(),
                    usi_verified=random.choice([True, False]),
                    date_of_birth=dob,
                    gender=random.choice(['MALE', 'FEMALE', 'OTHER']),
                    mobile_phone=fake.phone_number()[:20],
                    postal_address=fake.address().replace('\n', ', '),
                    street_address=fake.address().replace('\n', ', '),
                    citizen_status=random.choice(['STUDENT_VISA', 'PERMANENT_RESIDENT', 'AU_CITIZEN']),
                    country_of_birth=random.choice(NATIONALITIES),
                    city_of_birth=fake.city(),
                    citizenship=random.choice(NATIONALITIES),
                    indigenous_status=random.choice(['YES', 'NO', 'PREFER_NOT_TO_SAY']),
                    employment_status=random.choice(['FULL_TIME', 'PART_TIME', 'UNEMPLOYED', 'NOT_IN_LABOUR_FORCE']),
                    occupation_identifier=fake.job()[:100],
                    industry_of_employment=fake.bs()[:100],
                    language=random.choice(LANGUAGES),
                    english_proficiency=random.choice(['VERY_WELL', 'WELL', 'NOT_WELL']),
                    needs_english_assistance=random.choice([True, False]),
                    highest_education=random.choice(['Year 12 or equivalent', 'Certificate III', 'Certificate IV', 'Diploma', "Bachelor's Degree"]),
                    attending_other_school=random.choice([True, False]),
                    survey_contact_status=random.choice(['INCLUDED', 'EXCLUDED']),
                    passport_number=fake.bothify(text='?#######').upper(),
                    visa_type='Student Visa (Subclass 500)',
                    visa_expiry_date=visa_expiry,
                    emergency_contact_name=fake.name(),
                    emergency_contact_relationship=random.choice(['Parent', 'Sibling', 'Uncle', 'Aunt', 'Spouse', 'Friend']),
                    emergency_contact_phone=fake.phone_number()[:20],
                    status=random.choices(
                        ['ACTIVE', 'ON_LEAVE', 'GRADUATED', 'WITHDRAWN'],
                        weights=[70, 10, 15, 5],
                    )[0],
                )
                created += 1

        self.stdout.write(self.style.SUCCESS(f'Successfully created {created} fake students.'))