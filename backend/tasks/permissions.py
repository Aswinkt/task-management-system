from rest_framework import permissions

class IsAdminOrOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object or admins to edit it.
    """

    def has_object_permission(self, request, view, obj):
        # Admin can do anything
        if request.user.is_admin():
            return True

        # For task objects
        if hasattr(obj, 'created_by'):
            return obj.created_by == request.user

        # For comment objects
        if hasattr(obj, 'task'):
            return obj.task.created_by == request.user

        return False 