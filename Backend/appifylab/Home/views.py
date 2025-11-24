from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from .permissions import IsAuthorOrReadOnly
from .renderers import Userrenderer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .serializers import *
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import *
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests
import os
from django.contrib.auth import get_user_model
# Create your views here.


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

User = get_user_model()

@method_decorator(csrf_exempt, name="dispatch")
class UserRegistrationView(APIView):
    renderer_classes = [Userrenderer]
    permission_classes = [permissions.AllowAny]
    def post(self, request, format=None):
        # Pass request context to the serializer
        serializer = UserRegistrationSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token = get_tokens_for_user(user)
        return Response({"token": token, "msg": "User created successfully"}, status=status.HTTP_201_CREATED)
    

@method_decorator(csrf_exempt, name="dispatch")
class UserLoginView(APIView):
    renderer_classes = [Userrenderer]
    permission_classes = [permissions.AllowAny]
    def post(self, request, format=None):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.data.get("email")
        password = serializer.data.get("password")
        user = authenticate(email=email, password=password)
        if user is not None:
            token = get_tokens_for_user(user)
            return Response({'token': token, 'msg': 'User logged in successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': {'non_field_error': ['Invalid email or password']}}, status=status.HTTP_404_NOT_FOUND)

class GoogleLoginView(APIView):
    def post(self, request):
        # Validate the token with serializer
        serializer = GoogleAuthSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        token = serializer.validated_data['token']

        try:
            # Verify ID token with Google's OAuth2
            id_info = google_id_token.verify_oauth2_token(
                token, requests.Request(), os.environ.get('GOOGLE_CLIENT_ID')
            )

            email = id_info['email']
            first_name = id_info.get('given_name', '')
            last_name = id_info.get('family_name', '')

            # Create or get the user
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'first_name': first_name,
                    'last_name': last_name,
                    'is_active': True,
                    'is_verified': True,
                    'auth_provider': 'google',
                }
            )

            if created:
                # Set unusable password for new users (Google login only)
                user.set_unusable_password()
                user.save()
            else:
                # Update names if empty
                if not user.first_name:
                    user.first_name = first_name
                if not user.last_name:
                    user.last_name = last_name
                user.auth_provider = 'google'
                user.save()

            # Generate JWT tokens
            token_data = get_tokens_for_user(user)

            return Response({'token': token_data, 'msg': 'Google login successful'}, status=status.HTTP_200_OK)

        except ValueError:
            return Response({'error': 'Invalid Google token'}, status=status.HTTP_400_BAD_REQUEST)


class GoogleClientIdView(APIView):
    def get(self, request):
        google_client_id = os.environ.get('GOOGLE_CLIENT_ID')
        if not google_client_id:
            return Response({'error': 'Google Client ID not configured'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({"google_client_id": google_client_id}, status=status.HTTP_200_OK)


class UserProfileView(APIView):
    renderer_classes = [Userrenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        user = request.user
        serializer = UserProfileSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
class UpdateProfileView(generics.UpdateAPIView):

    queryset = User.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = UpdateUserSerializer


    
class UserChangePasswordView(APIView):
    renderer_classes = [Userrenderer]
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        serializer = UserChangePasswordSerializer(
            data=request.data, context={'user': request.user})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'msg': 'Password changed successfully'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user(request):
    user = request.user
    user.delete()
    return Response({'message': 'Account deleted successfully'}, status=status.HTTP_204_NO_CONTENT)



class FeedViewSet(viewsets.ModelViewSet):
    queryset = Feed.objects.all()
    serializer_class = FeedSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Feed.objects.filter(
            models.Q(privacy='PUBLIC') | models.Q(author=user)
        ).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    # Toggle like/unlike
    @action(detail=True, methods=['POST'])
    def like(self, request, pk=None):
        feed = self.get_object()
        like, created = FeedLike.objects.get_or_create(user=request.user, feed=feed)
        if not created:
            like.delete()
            return Response({'status': 'unliked'})
        return Response({'status': 'liked'})

    # ----------------------
    # Get stats for logged-in user
    # ----------------------
    @action(detail=False, methods=['GET'], url_path='my-stats')
    def my_stats(self, request):
        user = request.user

        total_posts = Feed.objects.filter(author=user).count()
        total_likes = FeedLike.objects.filter(feed__author=user).count()

        data = {
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "total_posts": total_posts,
            "total_likes": total_likes
        }

        serializer = UserStatsSerializer(data)
        return Response(serializer.data)
    

# ----------------------
# Comment ViewSet
# ----------------------
class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        feed_id = self.kwargs['feed_pk']
        return Comment.objects.filter(feed_id=feed_id).order_by('created_at')

    def perform_create(self, serializer):
        feed_id = self.kwargs['feed_pk']
        serializer.save(author=self.request.user, feed_id=feed_id)

    @action(detail=True, methods=['POST'])
    def like(self, request, feed_pk=None, pk=None):
        comment = self.get_object()
        like, created = CommentLike.objects.get_or_create(user=request.user, comment=comment)
        if not created:
            like.delete()
            return Response({'status': 'unliked'})
        return Response({'status': 'liked'})

# ----------------------
# Reply ViewSet
# ----------------------
class ReplyViewSet(viewsets.ModelViewSet):
    serializer_class = ReplySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        comment_id = self.kwargs['comment_pk']
        return Reply.objects.filter(comment_id=comment_id).order_by('created_at')

    def perform_create(self, serializer):
        comment_id = self.kwargs['comment_pk']
        serializer.save(author=self.request.user, comment_id=comment_id)

    @action(detail=True, methods=['POST'])
    def like(self, request, feed_pk=None, comment_pk=None, pk=None):
        reply = self.get_object()

        like, created = ReplyLike.objects.get_or_create(
            user=request.user,
            reply=reply
        )

        if not created:
            like.delete()
            return Response({'status': 'unliked'})

        return Response({'status': 'liked'})
