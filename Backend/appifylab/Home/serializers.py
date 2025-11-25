from rest_framework import serializers
from .models import *


class UserRegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={"input_type": "password"}, write_only=True)

    class Meta:
        model = User
        fields = ["email", "first_name", "last_name", "password", "password2"]
        extra_kwargs = {"password": {"write_only": True}}

    def validate(self, attrs):
        password = attrs.get("password")
        password2 = attrs.get("password2")
        if password != password2:
            raise serializers.ValidationError({"password": "Passwords must match"})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')

        user = User.objects.create_user(**validated_data)
        user.is_active = True
        user.save()
        return user


class UserLoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=255)

    class Meta:
        model = User
        fields = ["email", "password"]

class GoogleAuthSerializer(serializers.Serializer):
    token = serializers.CharField()

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["email", "first_name", "last_name", "image", "is_admin", 'is_active']

class UpdateUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=False)
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)
    class Meta:
        model = User
        fields = ("email", "first_name", "last_name", "image")

    def validate_email(self, value):
        user = self.context['request'].user
        if value and User.objects.exclude(pk=user.pk).filter(email=value).exists():
            raise serializers.ValidationError({"email": "This email is already in use."})
        return value

    def update(self, instance, validated_data):
        user = self.context['request'].user

        if user.pk != instance.pk:
            raise serializers.ValidationError({"authorize": "You don't have permission for this user."})

        # Update fields based on the validated data
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.image = validated_data.get('image', instance.image)
        instance.email = validated_data.get('email', instance.email)

        
        instance.save()
        return instance
    
class UserChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(max_length=255, style={'input_type': 'password'}, write_only=True)
    password = serializers.CharField(max_length=255, style={'input_type': 'password'}, write_only=True)
    password2 = serializers.CharField(max_length=255, style={'input_type': 'password'}, write_only=True)

    class Meta:
        fields = ['current_password', 'password', 'password2']

    def validate(self, attrs):
        user = self.context.get('user')
        current_password = attrs.get('current_password')
        password = attrs.get('password')
        password2 = attrs.get('password2')

        # Validate current password
        if not user.check_password(current_password):
            raise serializers.ValidationError({"current_password": "Current password is incorrect."})

        # Validate new passwords
        if password != password2:
            raise serializers.ValidationError({"password": "New passwords must match."})

        return attrs

    def save(self):
        user = self.context.get('user')
        user.set_password(self.validated_data['password'])
        user.save()


# Reply Serializer


class ReplySerializer(serializers.ModelSerializer):
    author = UserProfileSerializer(read_only=True)
    likes_count = serializers.SerializerMethodField()
    liked_by_user = serializers.SerializerMethodField()
    liked_users = serializers.SerializerMethodField()
    shares_count = serializers.IntegerField(source='shares.count', read_only=True)
    shared_by_user = serializers.SerializerMethodField()

    class Meta:
        model = Reply
        fields = ['id', 'author', 'content', 'created_at', 'likes_count', 'liked_by_user', 'liked_users', 'shares_count', 'shared_by_user']
    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_liked_by_user(self, obj):
        user = self.context.get('request').user
        return obj.likes.filter(user=user).exists() if user.is_authenticated else False

    # ADD THIS METHOD
    def get_liked_users(self, obj):
        likes = obj.likes.all()
        return [{"user": UserProfileSerializer(like.user, context=self.context).data} 
                for like in likes]
    
    def get_shares_count(self, obj):
        return obj.shares.count()

    def get_shared_by_user(self, obj):
        user = self.context['request'].user
        return obj.shares.filter(user=user).exists()


# Comment Serializer (UPDATED)

class CommentSerializer(serializers.ModelSerializer):
    author = UserProfileSerializer(read_only=True)
    replies = ReplySerializer(many=True, read_only=True)
    likes_count = serializers.SerializerMethodField()
    liked_by_user = serializers.SerializerMethodField()
    liked_users = serializers.SerializerMethodField()
    shares_count = serializers.IntegerField(source='shares.count', read_only=True)
    shared_by_user = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'author', 'content', 'created_at', 'likes_count', 
                  'liked_by_user', 'replies', 'liked_users', 'shares_count', 'shared_by_user']  # ADD liked_users here

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_liked_by_user(self, obj):
        user = self.context.get('request').user
        return obj.likes.filter(user=user).exists() if user.is_authenticated else False

    # ADD THIS METHOD
    def get_liked_users(self, obj):
        likes = obj.likes.all()
        return [{"user": UserProfileSerializer(like.user, context=self.context).data} 
                for like in likes]

    def get_shares_count(self, obj):
        return obj.shares.count()
    
    def get_shared_by_user(self, obj):
        user = self.context['request'].user
        return obj.shares.filter(user=user).exists()


# Feed Serializer

class FeedSerializer(serializers.ModelSerializer):
    author = UserProfileSerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    likes_count = serializers.SerializerMethodField()
    liked_by_user = serializers.SerializerMethodField()
    liked_users = serializers.SerializerMethodField()
    shares_count = serializers.IntegerField(source='shares.count', read_only=True)
    shared_by_user = serializers.SerializerMethodField()
    class Meta:
        model = Feed
        fields = [
            'id', 'image', 'author', 'content', 'privacy', 
            'created_at', 'likes_count', 'liked_by_user', 
            'liked_users', 'shares_count', 'shared_by_user', 'comments'
        ]

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_liked_by_user(self, obj):
        user = self.context.get('request').user
        return obj.likes.filter(user=user).exists() if user.is_authenticated else False

    def get_liked_users(self, obj):
        likes = obj.likes.all()  # Assuming FeedLike has FK to Feed called 'likes'
        return FeedLikeSerializer(likes, many=True).data
    
    def get_shares_count(self, obj):
        return obj.shares.count()
    
    def get_shared_by_user(self, obj):
        user = self.context['request'].user
        return obj.shares.filter(user=user).exists()


class UserStatsSerializer(serializers.Serializer):
    email = serializers.EmailField(read_only=True)
    first_name = serializers.CharField(read_only=True)
    last_name = serializers.CharField(read_only=True)
    total_posts = serializers.IntegerField(read_only=True)
    total_likes = serializers.IntegerField(read_only=True)

class FeedLikeSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)  # Or just display name/email

    class Meta:
        model = FeedLike
        fields = ['user', 'created_at']  # created_at optional
