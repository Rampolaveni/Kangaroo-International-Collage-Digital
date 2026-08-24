from django.contrib import admin
from .models import Campus, Course


@admin.register(Campus)
class CampusAdmin(admin.ModelAdmin):
    list_display = ['name', 'city', 'capacity', 'is_active']
    list_filter = ['is_active', 'city']
    search_fields = ['name', 'city']

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'campus', 'start_date', 'end_date', 'is_active']
    list_filter = ['is_active', 'campus']
    search_fields = ['code', 'name']