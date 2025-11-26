from django.shortcuts import render
from .models import Welcome, Banner  # 👈 1. 记得在这里导入 Banner
from django.http import JsonResponse

def welcome(request):
    res = Welcome.objects.all().order_by('-order').first()
    if res:
        img = 'http://127.0.0.1:8000/backend/media/' + str(res.img)
        return JsonResponse({'code': 100, 'msg': '成功', 'result': img})
    else:
        return JsonResponse({'code': 101, 'msg': '暂无欢迎页图片', 'result': ''})

# 👇 2. 在文件末尾添加这个新函数
def banner_list(request):
    # 获取所有 is_active=True 的轮播图，并按 order 从小到大排序
    banners = Banner.objects.filter(is_active=True).order_by('order')
    
    data = []
    for b in banners:
        # 拼接完整的图片链接
        if b.img:
            # 修改处：在字符串前添加 'f'
            img_url = f"http://127.0.0.1:8000/backend/media/{b.img}"
        else:
            img_url = ""
            
        data.append({
            'id': b.id,
            'img': img_url,
            'title': b.title,
            'link': b.link
        })
        
    # 返回 JSON 数据列表
    return JsonResponse({'code': 200, 'msg': '获取成功', 'result': data})