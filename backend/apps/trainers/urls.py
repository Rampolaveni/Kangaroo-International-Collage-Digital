from rest_framework.routers import DefaultRouter
from .views import TrainerViewSet

router = DefaultRouter()
router.register('trainers', TrainerViewSet, basename='trainer')

urlpatterns = router.urls