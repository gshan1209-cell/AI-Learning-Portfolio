from django.contrib import admin
from article.models import Post

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'pub_date')
    search_fields = ('title', 'content')
    prepopulated_fields = {'slug': ('title',)}
