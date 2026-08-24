from django.contrib import admin
from .models import Trainer


@admin.register(Trainer)
class TrainerAdmin(admin.ModelAdmin):
    list_display = ['user', 'specialization', 'employment_type', 'hire_date', 'is_active']
    list_filter = ['employment_type', 'is_active', 'campuses']
    search_fields = ['user__username', 'specialization']
    filter_horizontal = ['campuses']