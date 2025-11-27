from django.urls import path
from .views import welcome, banner_list, category_list, goods_list, goods_detail, tabbar_list, add_to_cart, cart_list, update_cart, delete_cart, wechat_login, address_list, address_save, address_delete

urlpatterns = [
    path('welcome/', welcome),
    path('banner/list/', banner_list),
    path('category/list/', category_list),
    path('goods/list/', goods_list),
    path('goods/detail/', goods_detail),
    path('tabbar/list/', tabbar_list),
    path('cart/add/', add_to_cart),
    path('cart/list/', cart_list),
    path('cart/update/', update_cart),
    path('cart/delete/', delete_cart),
    path('user/login/', wechat_login),
    path('address/list/', address_list),
    path('address/save/', address_save),
    path('address/delete/', address_delete),
]