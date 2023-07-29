from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.auth import get_user_model



class User(AbstractUser):
    pass

class Post(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="postuser")
    content = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
    likes=models.IntegerField(default=0)
    

    def serialize(self):
        User = get_user_model()
        return {
            "id": self.id,
            "content":self.content,
            "user_id": self.user.id,  # Access the unique ID of the user
            "user": self.user.username,  # Serialize user field as a string
            "timestamp":self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "likes":self.likes
        }
    
class Likes(models.Model):
    liked_by=models.ForeignKey("User", on_delete=models.CASCADE, related_name="liked_by")
    post_liked=models.ForeignKey("Post",on_delete=models.CASCADE, related_name="post_liked")