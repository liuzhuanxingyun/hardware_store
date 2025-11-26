from django.db import models

# 轮播图模型
class Banner(models.Model):
    title = models.CharField(max_length=100, verbose_name="标题", blank=True)
    img = models.ImageField(upload_to='banner_images/', default='banner_images/default.png', verbose_name="图片")
    link = models.URLField(max_length=200, verbose_name="跳转链接", blank=True)
    order = models.PositiveIntegerField(default=0, verbose_name="排序")
    is_active = models.BooleanField(default=True, verbose_name="是否显示")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")

    def __str__(self):
        return self.title or "Banner"

# 欢迎页模型
class Welcome(models.Model):
    title = models.CharField(max_length=100, verbose_name="标题", blank=True)
    img = models.ImageField(upload_to='welcome_images/', default='welcome_images/default.png', verbose_name="图片")
    description = models.TextField(verbose_name="描述", blank=True)
    link = models.URLField(max_length=200, verbose_name="跳转链接", blank=True)
    order = models.PositiveIntegerField(default=0, verbose_name="排序")
    is_active = models.BooleanField(default=True, verbose_name="是否显示")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")

    def __str__(self):
        return self.title or "Welcome"
    
# cd backend
# conda activate hardware_store
# python manage.py makemigrations
# python manage.py migrate