from rest_framework import permissions

class IsAuthorOrReadOnly(permissions.BasePermission):
    """
    Only the author of the feed can edit or delete it.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed for any request
        if request.method in permissions.SAFE_METHODS:
            return True
        # Write permissions only for the author
        return obj.author == request.user
