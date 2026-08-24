from django.contrib import admin
from .models import Student


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ['student_id', 'user', 'campus', 'citizenship', 'status']
    list_filter = ['status', 'campus', 'citizen_status']
    search_fields = ['student_id', 'usi', 'user__username', 'passport_number']