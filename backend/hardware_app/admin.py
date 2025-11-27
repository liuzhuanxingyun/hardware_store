from django.contrib import admin
# 引入 Order, OrderItem
from .models import Banner, Welcome, Category, Goods, TabBar, CartItem, GoodsSpec, Address, Order, OrderItem

admin.site.register(Banner)
admin.site.register(Welcome)
admin.site.register(Category)
admin.site.register(TabBar)
admin.site.register(CartItem)
admin.site.register(Address)

# 商品管理
class GoodsSpecInline(admin.TabularInline):
    model = GoodsSpec
    extra = 1

class GoodsAdmin(admin.ModelAdmin):
    inlines = [GoodsSpecInline]
    list_display = ('name', 'category', 'price', 'stock', 'is_hot')

admin.site.register(Goods, GoodsAdmin)
admin.site.register(GoodsSpec)

# --- 新增：订单管理 ---
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('goods_name', 'spec_name', 'price', 'count') # 订单明细通常不可修改

class OrderAdmin(admin.ModelAdmin):
    inlines = [OrderItemInline]
    list_display = ('order_no', 'user_id', 'total_price', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('order_no', 'user_id', 'address_snapshot')
    readonly_fields = ('order_no', 'user_id', 'total_price', 'address_snapshot', 'created_at') # 关键信息只读

admin.site.register(Order, OrderAdmin)