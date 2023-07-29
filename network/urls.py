
from django.urls import path
from django.urls import path, re_path


from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # API Routes
    path("post", views.compose, name="post"),
    path("post/<int:post_id>", views.postid, name="postid"),
    path("user/<int:user_id>", views.userpage, name="userpage"),
    path("username/<int:user_id>", views.username, name="username"),
    path("follow/<int:user_id>", views.follow, name="follow"),
    path("followers/<int:user_id>", views.followers, name="followers"),

    
]


