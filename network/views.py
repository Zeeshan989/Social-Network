import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import JsonResponse
from django.shortcuts import HttpResponse, HttpResponseRedirect, render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.core import serializers
from django.contrib.auth import get_user_model
from django.db.models import F

from .models import User,Post,Likes

ulikes={}
foll={}
User = get_user_model()

def index(request):
    return render(request, "network/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
    


@csrf_exempt
@login_required
def compose(request):

    # Composing a new email must be via POST
    if request.method == "GET":
        posts = Post.objects.all()
        return JsonResponse([post.serialize() for post in posts], safe=False) # Pass serialized data and set safe=False

    # Check recipient emails
    data = json.loads(request.body)
    username = data.get("user", "")
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return JsonResponse({"error": f"User with username {username} does not exist."}, status=400)


    content = data.get("text", "")
    timestamp= data.get("time","")
    post = Post(
            user=user,
            content=content,
            timestamp=timestamp,
        )
    post.save()

    

    return JsonResponse({"message": "Post submitted successfully."}, status=201)


@csrf_exempt
@login_required
def postid(request, post_id):
  
    # Query for requested post
    try:
        pt = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return JsonResponse({"error": "Post not found."}, status=404)
    
    if request.method == "POST":
        # Handle POST request (creating a new post) here
        # Your existing POST logic goes here
        
        return JsonResponse({"message": "Post created successfully."}, status=201)
    
    elif request.method == "PUT":
        data = json.loads(request.body)
        

        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return JsonResponse({"error": "Post not found."}, status=404)
        
        if (data.get("likes")):

            if not Likes.objects.filter(post_liked=post):
                lik = Likes(liked_by=request.user, post_liked=post)
                post.likes = F('likes') + 1
                lik.save()
                post.save()
                return JsonResponse({"message": "Post liked successfully."}, status=201)
            elif Likes.objects.filter(liked_by=request.user, post_liked=post).exists():
                return JsonResponse({"error": "You have already liked this post."}, status=400)
            else:
                lik = Likes(liked_by=request.user, post_liked=post)
                post.likes = F('likes') + 1
                lik.save()
                post.save()
                return JsonResponse({"message": "Post liked successfully."}, status=201)
            
        if (data.get("unlikes")):
                lik = Likes(liked_by=request.user, post_liked=post)
                post.likes = F('likes') - 1
                lik.save()
                post.save()
                return JsonResponse({"message": "Post unliked successfully."}, status=201)



@csrf_exempt
@login_required
def userpage(request, user_id):
     if request.method == "GET":
        posts = Post.objects.filter(user_id=user_id)
        return JsonResponse([post.serialize() for post in posts], safe=False) # Pass serialized data and set safe=False
       
  

@csrf_exempt
@login_required
def username(request, user_id):
    if request.method == "GET":
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found."}, status=404)

        user_data = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            # Add more user fields here if needed
        }

        return JsonResponse(user_data)
       
  

@csrf_exempt
@login_required
def follow(request, user_id):
    if request.method == "GET":
         foll.setdefault(user_id, []).append(0)
         if (request.user.id) in foll[user_id]:
             pass
         else:
            foll.setdefault(user_id, []).append(request.user.id)
            print(foll)
            return JsonResponse({"error": "POST request required."}, status=200)
       
@csrf_exempt
@login_required
def followers(request, user_id):
    if request.method == "GET":
        if user_id in foll:
            c = sum(1 for i in foll[user_id] if i != 0)
            return JsonResponse({"followers": c}, status=200)
        else:
            return JsonResponse({"error": "User not found in followers data."}, status=404)
