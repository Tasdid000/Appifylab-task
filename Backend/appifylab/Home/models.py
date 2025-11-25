from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin
import random
from django.utils import timezone

# Create your models here.
# Create user manager
class MyUserManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, password=None):
        """
        Creates and saves a User with the given email, name, phone_Number, and password.
        """
        if not email:
            raise ValueError("Users must have an email address")

        user = self.model(
            email=self.normalize_email(email),
            first_name=first_name,
            last_name=last_name,

        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, first_name, last_name, password=None):
        """
        Creates and saves a superuser with the given email, first_name, last_name and password.
        """
        user = self.create_user(
            email,
            password=password,
            first_name=first_name,
            last_name=last_name,
        )
        user.is_admin = True
        user.save(using=self._db)
        return user

class User(AbstractBaseUser, PermissionsMixin):
    AUTH_PROVIDERS = {
        'email': 'email',
        'google': 'google',
    }
    email = models.EmailField(primary_key=True, 
        verbose_name="email address",
        max_length=255,
        unique=True,
    )
    image = models.ImageField(upload_to='media/userimage', default="media/userimage/img4.png")
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    create_date = models.DateTimeField(auto_now_add=True)
    update_date = models.DateTimeField(auto_now=True)
    
    
    auth_provider = models.CharField(
        max_length=20,
        blank=False,
        null=False,
        default=AUTH_PROVIDERS.get('email'),
        choices=[(key, key.title()) for key in AUTH_PROVIDERS]
    )

    
    objects = MyUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        """
        Does the user have a specific permission?
        Only admins should have full permissions.
        """
        return self.is_admin

    def has_module_perms(self, app_label):
        """
        Does the user have permissions to view the app `app_label`?
        Only admins should have full permissions.
        """
        return self.is_admin

    @property
    def is_staff(self):
        """
        Is the user a member of staff?
        All admins are considered staff.
        """
        return self.is_admin
    
  

# ----------------------
# Feed / Post Model
# ----------------------
class Feed(models.Model):
    PRIVACY_CHOICES = (
        ('PUBLIC', 'Public'),
        ('PRIVATE', 'Private'),
    )

    id = models.AutoField(primary_key=True)
    image = models.ImageField(upload_to="media/Event/images", blank=True, null=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='feeds')  
    content = models.TextField()
    privacy = models.CharField(max_length=10, choices=PRIVACY_CHOICES, default='PUBLIC')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']  # newest first

    def __str__(self):
        return f"{self.author.email} at {self.created_at}"

# ----------------------
# Comment Model
# ----------------------
class Comment(models.Model):
    feed = models.ForeignKey(Feed, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

# ----------------------
# Reply Model
# ----------------------
class Reply(models.Model):
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name='replies')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

# ----------------------
# Like Models
# ----------------------
class FeedLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    feed = models.ForeignKey(Feed, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'feed')

class CommentLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'comment')

class ReplyLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    reply = models.ForeignKey(Reply, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'reply')

class FeedLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    feed = models.ForeignKey(Feed, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'feed')

class FeedShare(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    feed = models.ForeignKey(Feed, on_delete=models.CASCADE, related_name='shares')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'feed')


class CommentShare(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name='shares')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'comment')


class ReplyShare(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    reply = models.ForeignKey(Reply, on_delete=models.CASCADE, related_name='shares')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'reply')
