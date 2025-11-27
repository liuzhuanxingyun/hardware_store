from django.contrib import admin
from .models import Banner, Welcome, Category, Goods, TabBar, CartItem, GoodsSpec, Address

admin.site.register(Banner)
admin.site.register(Welcome)
admin.site.register(Category)
admin.site.register(Goods)
admin.site.register(TabBar)
admin.site.register(CartItem)
admin.site.register(Address) # 新增注册

class GoodsSpecInline(admin.TabularInline):
    model = GoodsSpec
    extra = 1

class GoodsAdmin(admin.ModelAdmin):
    inlines = [GoodsSpecInline]
    list_display = ('name', 'category', 'price', 'stock', 'is_hot')

admin.site.unregister(Goods) # 如果之前注册过，先注销
admin.site.register(Goods, GoodsAdmin)
admin.site.register(GoodsSpec)