from rest_framework.permissions import BasePermission


class IsSuperAdmin(BasePermission):
    message = "Only Super Admins can perform this action."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == 'SUPER_ADMIN'
        )


class IsAdmin(BasePermission):
    message = "Only Admins can perform this action."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == 'ADMIN'
        )


class IsTrainer(BasePermission):
    message = "Only Trainers can perform this action."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == 'TRAINER'
        )


class IsStudent(BasePermission):
    message = "Only Students can perform this action."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == 'STUDENT'
        )


class IsAdminOrSuperAdmin(BasePermission):
    """Many admin-level endpoints should allow both Admins and Super Admins."""
    message = "Only Admins or Super Admins can perform this action."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role in ('ADMIN', 'SUPER_ADMIN')
        )