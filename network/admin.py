from django.contrib import admin

# Register your models here.
from .models import Post
from .models import User
from .models import Likes
admin.site.register(Post)
admin.site.register(User)
admin.site.register(Likes)

# Register your models here.
