from django.urls import path
from .views import welcome, banner_list  # 👈 1. 导入 banner_list

urlpatterns = [
    path('welcome/', welcome),
    path('banner/list/', banner_list),   # 👈 2. 添加这一行
]