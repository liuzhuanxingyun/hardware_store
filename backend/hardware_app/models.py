import os
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

    def save(self, *args, **kwargs):
        # 自动设置标题为图片文件名
        if not self.title and self.img:
            self.title = os.path.basename(self.img.name)
        # 自动设置排序为最大+1
        if self.order == 0:
            max_order = Banner.objects.aggregate(models.Max('order'))['order__max'] or 0
            self.order = max_order + 1
        super().save(*args, **kwargs)

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

# 商品分类模型
class Category(models.Model):
    name = models.CharField(max_length=50, verbose_name="分类名称")
    icon = models.ImageField(upload_to='icons/', default='icons/default.png', verbose_name="图标", blank=True)
    order = models.PositiveIntegerField(default=0, verbose_name="排序")

    class Meta:
        verbose_name = "商品分类"
        verbose_name_plural = verbose_name
        ordering = ['order']

    def __str__(self):
        return self.name

# 商品模型
class Goods(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='goods', verbose_name="所属分类")
    name = models.CharField(max_length=200, verbose_name="商品名称")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="价格")
    img = models.ImageField(upload_to='goods/', default='goods/default.png', verbose_name="主图")
    description = models.TextField(verbose_name="商品详情", blank=True)
    stock = models.PositiveIntegerField(default=100, verbose_name="库存")
    is_hot = models.BooleanField(default=False, verbose_name="是否热销")
    is_new = models.BooleanField(default=False, verbose_name="是否新品")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="上架时间")

    class Meta:
        verbose_name = "商品信息"
        verbose_name_plural = verbose_name
        ordering = ['-created_at']

    def __str__(self):
        return self.name

# 新增：商品规格模型
class GoodsSpec(models.Model):
    goods = models.ForeignKey(Goods, on_delete=models.CASCADE, related_name='specs', verbose_name="所属商品")
    name = models.CharField(max_length=100, verbose_name="规格名称") # 例如：直径10mm, 红色
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="规格价格", blank=True, null=True, help_text="如果不填则使用商品默认价格")
    stock = models.PositiveIntegerField(default=100, verbose_name="库存")

    class Meta:
        verbose_name = "商品规格"
        verbose_name_plural = verbose_name

    def __str__(self):
        return f"{self.goods.name} - {self.name}"

# 新增：底部导航栏模型
class TabBar(models.Model):
    name = models.CharField(max_length=50, verbose_name="Tab名称")
    page_path = models.CharField(max_length=100, verbose_name="页面路径", help_text="例如: /pages/home/home")
    icon = models.ImageField(upload_to='tabbar/', verbose_name="未选中图标")
    selected_icon = models.ImageField(upload_to='tabbar/', verbose_name="选中图标")
    order = models.PositiveIntegerField(default=0, verbose_name="排序")
    is_active = models.BooleanField(default=True, verbose_name="是否启用")

    class Meta:
        verbose_name = "底部导航配置"
        verbose_name_plural = verbose_name
        ordering = ['order']

    def __str__(self):
        return self.name

# 修改：购物车模型
class CartItem(models.Model):
    # 实际项目中这里应该是关联 User 表，或者存储微信的 openid
    user_id = models.CharField(max_length=100, verbose_name="用户ID", default="test_user") 
    goods = models.ForeignKey(Goods, on_delete=models.CASCADE, verbose_name="商品")
    # 新增规格字段
    spec_name = models.CharField(max_length=100, verbose_name="规格名称", default="标准规格")
    count = models.PositiveIntegerField(default=1, verbose_name="数量")
    is_selected = models.BooleanField(default=True, verbose_name="是否选中")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")

    class Meta:
        verbose_name = "购物车"
        verbose_name_plural = verbose_name
        ordering = ['-created_at']

