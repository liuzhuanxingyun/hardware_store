from django.shortcuts import render, get_object_or_404
from .models import Welcome, Banner, Category, Goods # 记得导入新模型
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

# 1. 获取分类列表
def category_list(request):
    categories = Category.objects.all().order_by('order')
    data = []
    for c in categories:
        icon_url = f"http://127.0.0.1:8000/backend/media/{c.icon}" if c.icon else ""
        data.append({
            'id': c.id,
            'name': c.name,
            'icon': icon_url
        })
    return JsonResponse({'code': 200, 'msg': '获取成功', 'result': data})

# 2. 获取商品列表 (支持按分类筛选、热销筛选)
def goods_list(request):
    category_id = request.GET.get('category_id')
    is_hot = request.GET.get('is_hot')
    
    goods_query = Goods.objects.all()
    
    if category_id:
        goods_query = goods_query.filter(category_id=category_id)
    
    if is_hot == 'true':
        goods_query = goods_query.filter(is_hot=True)
        
    data = []
    for g in goods_query:
        img_url = f"http://127.0.0.1:8000/backend/media/{g.img}" if g.img else ""
        data.append({
            'id': g.id,
            'name': g.name,
            'price': str(g.price),
            'img': img_url,
            'tag': '热销' if g.is_hot else ('新品' if g.is_new else '')
        })
    return JsonResponse({'code': 200, 'msg': '获取成功', 'result': data})

# 3. 获取商品详情
def goods_detail(request):
    goods_id = request.GET.get('id')
    if not goods_id:
        return JsonResponse({'code': 400, 'msg': '缺少商品ID'})
        
    g = get_object_or_404(Goods, id=goods_id)
    
    img_url = f"http://127.0.0.1:8000/backend/media/{g.img}" if g.img else ""
    
    # 模拟多张详情图（实际项目中可以建一个 GoodsImage 模型）
    detail_images = [img_url] 
    
    result = {
        'id': g.id,
        'name': g.name,
        'price': str(g.price),
        'img': img_url,
        'description': g.description,
        'stock': g.stock,
        'detailImages': detail_images
    }
    return JsonResponse({'code': 200, 'msg': '获取成功', 'result': result})