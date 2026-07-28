from django.test import TestCase
from django.urls import reverse
from article.models import Post

class PostModelAndViewsTestCase(TestCase):
    def setUp(self):
        self.post1 = Post.objects.create(
            title="第一篇教學文章",
            slug="first-post",
            content="這是 Django Blog 移植教學的第一篇文章內容。"
        )
        self.post2 = Post.objects.create(
            title="第二篇教學文章",
            slug="second-post",
            content="這是第二篇文章內容，測試 ORM 與模板渲染。"
        )

    def test_post_str(self):
        self.assertEqual(str(self.post1), "第一篇教學文章")

    def test_post_absolute_url(self):
        self.assertEqual(self.post1.get_absolute_url(), "/post/first-post/")

    def test_post_list_view(self):
        response = self.client.get(reverse('post_list'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "第一篇教學文章")
        self.assertContains(response, "第二篇教學文章")

    def test_post_detail_view_success(self):
        response = self.client.get(reverse('post_detail', kwargs={'slug': 'first-post'}))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "這是 Django Blog 移植教學的第一篇文章內容。")

    def test_post_detail_view_404(self):
        response = self.client.get(reverse('post_detail', kwargs={'slug': 'non-existent-slug'}))
        self.assertEqual(response.status_code, 404)
