from django.db import models
from django.urls import reverse

class Post(models.Model):
    title = models.CharField(max_length=200)
    slug = models.CharField(max_length=200, unique=True)
    content = models.TextField()
    pub_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-pub_date']

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('post_detail', kwargs={'slug': self.slug})
