from django.urls import path
from .views import welcome, banner_list, category_list, goods_list, goods_detail, tabbar_list, login_user # 记得引入 login_user

urlpatterns = [
    path('welcome/', welcome),
    path('banner/list/', banner_list),
    path('category/list/', category_list),
    path('goods/list/', goods_list),
    path('goods/detail/', goods_detail),
    path('tabbar/list/', tabbar_list),
    path('login/', login_user),
]