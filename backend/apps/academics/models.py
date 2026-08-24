from django.db import models


class Campus(models.Model):
    name = models.CharField(max_length=150)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    capacity = models.PositiveIntegerField(
        default=0,
        help_text="Maximum number of students this campus can accommodate."
    )
    timezone = models.CharField(
        max_length=50,
        default='Australia/Melbourne',
        help_text="IANA timezone name, e.g. Australia/Melbourne"
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        verbose_name_plural = 'Campuses'

    def __str__(self):
        return f"{self.name} ({self.city})"

class Course(models.Model):
    campus = models.ForeignKey(
        Campus,
        on_delete=models.PROTECT,
        related_name='courses',
    )
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=20, unique=True, help_text="Unique course code, e.g. DIP-IT-01")
    description = models.TextField(blank=True)
    duration_weeks = models.PositiveIntegerField()
    fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    start_date = models.DateField()
    end_date = models.DateField()
    max_students = models.PositiveIntegerField(default=30)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-start_date']

    def __str__(self):
        return f"{self.code} - {self.name}"