from rest_framework import viewsets
from apps.users.permissions import IsAdminOrSuperAdmin
from .models import Trainer
from .serializers import TrainerSerializer


class TrainerViewSet(viewsets.ModelViewSet):
    queryset = Trainer.objects.select_related('user').prefetch_related('campuses').all()
    serializer_class = TrainerSerializer
    permission_classes = [IsAdminOrSuperAdmin]