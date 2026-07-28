from django.shortcuts import render, get_object_or_404
from article.models import Post
from django.utils import timezone

def index(request):
    posts = Post.objects.all()
    now = timezone.now()
    return render(request, "index.html", {'posts': posts, 'now': now})

def detail(request, slug):
    post = get_object_or_404(Post, slug=slug)
    now = timezone.now()
    return render(request, "show.html", {'post': post, 'now': now})
