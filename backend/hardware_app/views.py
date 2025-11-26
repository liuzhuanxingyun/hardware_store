from django.shortcuts import render
from .models import Welcome
from django.http import JsonResponse

def welcome(request):
    res = Welcome.objects.all().order_by('-order').first()
    if res:
        img = 'http://127.0.0.1:8000/backend/media/' + str(res.img)
        return JsonResponse({'code': 100, 'msg': '成功', 'result': img})
    else:
        return JsonResponse({'code': 101, 'msg': '暂无欢迎页图片', 'result': ''})