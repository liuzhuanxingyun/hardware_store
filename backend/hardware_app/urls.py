from django.urls import path
from .views import welcome, banner_list, category_list, goods_list, goods_detail

urlpatterns = [
    path('welcome/', welcome),
    path('banner/list/', banner_list),
    path('category/list/', category_list), # 分类列表
    path('goods/list/', goods_list),       # 商品列表
    path('goods/detail/', goods_detail),   # 商品详情
]