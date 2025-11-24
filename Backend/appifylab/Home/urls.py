from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from .views import *

router = DefaultRouter()
router.register(r'feeds', FeedViewSet, basename='feeds')

# Nested routers for comments and replies
feed_router = routers.NestedDefaultRouter(router, r'feeds', lookup='feed')
feed_router.register(r'comments', CommentViewSet, basename='feed-comments')

comment_router = routers.NestedDefaultRouter(feed_router, r'comments', lookup='comment')
comment_router.register(r'replies', ReplyViewSet, basename='comment-replies')

urlpatterns = [
    # Auth/User routes
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('userprofile/', UserProfileView.as_view(), name='userprofile'),
    path('google-login/', GoogleLoginView.as_view(), name='google-login'),
    path('google-client-id/', GoogleClientIdView.as_view(), name='google-client-id'),
    path('update_profile/<str:pk>/', UpdateProfileView.as_view(), name='auth_update_profile'),
    path('changepassword/', UserChangePasswordView.as_view(), name='changepassword'),
    path('delete_user/', delete_user, name='delete_user'),

    # Include routers
    path('', include(router.urls)),          # Feed routes including user-stats
    path('', include(feed_router.urls)),     # Comments nested under feeds
    path('', include(comment_router.urls)),  # Replies nested under comments
]
