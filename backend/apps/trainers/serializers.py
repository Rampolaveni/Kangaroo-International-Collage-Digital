from rest_framework import serializers
from apps.academics.models import Campus
from .models import Trainer


class TrainerSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    campus_names = serializers.SerializerMethodField()

    class Meta:
        model = Trainer
        fields = [
            'id', 'user', 'username', 'email', 'qualification', 'specialization',
            'bio', 'employment_type', 'hire_date', 'campuses', 'campus_names',
            'is_active', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_campus_names(self, obj):
        return [c.name for c in obj.campuses.all()]