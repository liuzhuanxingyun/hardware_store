from django.contrib import admin
# 1. 导入 Welcome 模型
from .models import Banner, Welcome

# Register your models here.
admin.site.register(Banner)
# 2. 注册 Welcome 模型
admin.site.register(Welcome)