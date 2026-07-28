from django.contrib import admin
from django.urls import path
from article.views import index, detail

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', index, name='post_list'),
    path('post/<slug:slug>/', detail, name='post_detail'),
]
