from django.contrib import admin
from .models import *
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

class UserAdmin(BaseUserAdmin):
    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ["email", "first_name", "last_name","is_admin", "auth_provider"]
    list_filter = ["is_admin", "auth_provider"]
    
    fieldsets = [
        ('User Credentials', {"fields": ["email", "password"]}),
        ("Personal info", {"fields": ["first_name", "last_name", "image"]}),
        ("Permissions", {"fields": ["is_admin", "is_active"]}),
        ("Meta", {"fields": ["auth_provider", "last_login", "create_date", "update_date"]}),
    ]
    
    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = [
        (
            None,
            {
                "classes": ["wide"],
                "fields": ["email", "image", "first_name", "last_name", "password1", "password2", "is_admin", "is_active", "auth_provider"],
            },
        ),
    ]
    
    readonly_fields = ["last_login", "create_date", "update_date"]
    search_fields = ["email", "first_name", "last_name"]
    ordering = ["email", "first_name", "last_name"]
    filter_horizontal = []

# Now register the new UserAdmin...
admin.site.register(User, UserAdmin)

# ----------------------
# Feed Admin
# ----------------------
@admin.register(Feed)
class FeedAdmin(admin.ModelAdmin):
    list_display = ('author','privacy', 'created_at', 'image')
    list_filter = ('privacy','created_at')
    search_fields = ('content', 'author__email')
    ordering = ('-created_at',)

# ----------------------
# Comment Admin
# ----------------------
@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'author', 'feed', 'content', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('content', 'author__email')
    ordering = ('created_at',)

# ----------------------
# Reply Admin
# ----------------------
@admin.register(Reply)
class ReplyAdmin(admin.ModelAdmin):
    list_display = ('id', 'author', 'comment', 'content', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('content', 'author__email')
    ordering = ('created_at',)

# ----------------------
# FeedLike Admin
# ----------------------
@admin.register(FeedLike)
class FeedLikeAdmin(admin.ModelAdmin):
    list_display = ('user', 'feed', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__email', 'feed__feed_title')

# ----------------------
# CommentLike Admin
# ----------------------
@admin.register(CommentLike)
class CommentLikeAdmin(admin.ModelAdmin):
    list_display = ('user', 'comment', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__email', 'comment__content')

# ----------------------
# ReplyLike Admin
# ----------------------
@admin.register(ReplyLike)
class ReplyLikeAdmin(admin.ModelAdmin):
    list_display = ('user', 'reply', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__email', 'reply__content')
#CommentShare ,ReplyShare
@admin.register(FeedShare)
class FeedShareAdmin(admin.ModelAdmin):
    list_display = ('user', 'feed', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__email', 'feed__feed_title')

@admin.register(CommentShare)
class CommentShareAdmin(admin.ModelAdmin):
    list_display = ('user', 'comment', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__email', 'comment__content')
    
@admin.register(ReplyShare)
class ReplyShareAdmin(admin.ModelAdmin):
    list_display = ('user', 'reply', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__email', 'reply__content')