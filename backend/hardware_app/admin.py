from django.contrib import admin
from .models import Banner, Welcome, Category, Goods, TabBar # 引入 TabBar

admin.site.register(Banner)
admin.site.register(Welcome)
admin.site.register(Category)
admin.site.register(Goods)
admin.site.register(TabBar) # 注册 TabBar