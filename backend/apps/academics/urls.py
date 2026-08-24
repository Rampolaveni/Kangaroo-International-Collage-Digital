from rest_framework.routers import DefaultRouter
from .views import CampusViewSet, CourseViewSet

router = DefaultRouter()
router.register('campuses', CampusViewSet, basename='campus')
router.register('courses', CourseViewSet, basename='course')

urlpatterns = router.urls