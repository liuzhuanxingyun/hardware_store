from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
import json
import requests # 记得导入 requests
from .models import Welcome, Banner, Category, Goods, TabBar, CartItem # 引入 CartItem
from dotenv import load_dotenv
import os

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

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
        # 判断是否有规格
        has_specs = g.specs.exists()
        
        data.append({
            'id': g.id,
            'name': g.name,
            'price': str(g.price),
            'img': img_url,
            'tag': '热销' if g.is_hot else ('新品' if g.is_new else ''),
            'has_specs': has_specs # 新增字段
        })
    return JsonResponse({'code': 200, 'msg': '获取成功', 'result': data})

# 3. 获取商品详情
def goods_detail(request):
    goods_id = request.GET.get('id')
    try:
        goods = Goods.objects.get(id=goods_id)
        
        # 获取该商品的所有规格
        specs = []
        for spec in goods.specs.all():
            specs.append({
                'id': spec.id,
                'name': spec.name,
                'price': float(spec.price) if spec.price else float(goods.price),
                'stock': spec.stock
            })

        data = {
            'id': goods.id,
            'name': goods.name,
            'price': float(goods.price),
            'img': f"http://127.0.0.1:8000/backend/media/{goods.img}" if goods.img else "",
            'description': goods.description,
            'detailImages': [f"http://127.0.0.1:8000/backend/media/{goods.img}"], # 暂时用主图模拟
            'specs': specs # 返回规格列表
        }
        return JsonResponse({'code': 200, 'msg': '获取成功', 'result': data})
    except Goods.DoesNotExist:
        return JsonResponse({'code': 404, 'msg': '商品不存在'})

# 4. 获取底部导航栏列表
def tabbar_list(request):
    tabs = TabBar.objects.filter(is_active=True).order_by('order')
    data = []
    for t in tabs:
        # 拼接完整图片链接
        icon_url = f"http://127.0.0.1:8000/backend/media/{t.icon}" if t.icon else ""
        selected_icon_url = f"http://127.0.0.1:8000/backend/media/{t.selected_icon}" if t.selected_icon else ""
        
        data.append({
            'pagePath': t.page_path,
            'text': t.name,
            'iconPath': icon_url,
            'selectedIconPath': selected_icon_url
        })
    return JsonResponse({'code': 200, 'msg': '获取成功', 'result': data})

# 新增：用户登录接口
@csrf_exempt
def login_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
        except:
            username = request.POST.get('username')
            password = request.POST.get('password')

        if not username or not password:
             return JsonResponse({'code': 400, 'msg': '请输入用户名和密码'})

        # 使用 Django 自带的验证功能
        user = authenticate(username=username, password=password)
        if user is not None:
            return JsonResponse({
                'code': 200, 
                'msg': '登录成功', 
                'result': {
                    'id': user.id,
                    'username': user.username,
                    'is_superuser': user.is_superuser,
                    # 这里还可以返回更多信息，比如头像等
                }
            })
        else:
            return JsonResponse({'code': 401, 'msg': '账号或密码错误'})
    return JsonResponse({'code': 405, 'msg': 'Method not allowed'})

# 5. 添加到购物车
@csrf_exempt
def add_to_cart(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        goods_id = data.get('goods_id')
        user_id = data.get('user_id', 'test_user')
        count = data.get('count', 1)
        spec_name = data.get('spec_name', '标准规格') # 获取规格名称

        try:
            # 查找是否已有相同商品且相同规格的记录
            item = CartItem.objects.get(user_id=user_id, goods_id=goods_id, spec_name=spec_name)
            item.count += count
            item.save()
        except CartItem.DoesNotExist:
            CartItem.objects.create(user_id=user_id, goods_id=goods_id, count=count, spec_name=spec_name)
        
        return JsonResponse({'code': 200, 'msg': '加入购物车成功'})
    return JsonResponse({'code': 405, 'msg': '方法不允许'})

# 6. 获取购物车列表
def cart_list(request):
    user_id = request.GET.get('user_id', 'test_user')
    items = CartItem.objects.filter(user_id=user_id)
    
    data = []
    for item in items:
        img_url = f"http://127.0.0.1:8000/backend/media/{item.goods.img}" if item.goods.img else ""
        data.append({
            'id': item.id,
            'goods_id': item.goods.id,
            'name': item.goods.name,
            'price': float(item.goods.price), # 这里可以优化为取规格对应的价格，如果需要的话
            'img': img_url,
            'num': item.count,
            'selected': item.is_selected,
            'spec': item.spec_name # 返回规格名称
        })
    
    return JsonResponse({'code': 200, 'msg': '获取成功', 'result': data})

# 7. 更新购物车（数量或选中状态）
@csrf_exempt
def update_cart(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        cart_id = data.get('cart_id')
        count = data.get('count')
        selected = data.get('selected')

        try:
            item = CartItem.objects.get(id=cart_id)
            if count is not None:
                item.count = count
            if selected is not None:
                item.is_selected = selected
            item.save()
            return JsonResponse({'code': 200, 'msg': '更新成功'})
        except CartItem.DoesNotExist:
            return JsonResponse({'code': 404, 'msg': '记录不存在'})

# 8. 删除购物车商品
@csrf_exempt
def delete_cart(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        cart_id = data.get('cart_id')
        CartItem.objects.filter(id=cart_id).delete()
        return JsonResponse({'code': 200, 'msg': '删除成功'})

# 9. 微信登录接口
@csrf_exempt
def wechat_login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        code = data.get('code')
        
        if not code:
            return JsonResponse({'code': 400, 'msg': '缺少code'})

        # 填入你的小程序 AppID 和 AppSecret
        APP_ID = os.getenv('WECHAT_APP_ID')
        APP_SECRET = os.getenv('WECHAT_APP_SECRET')
        
        # 微信接口地址
        url = f"https://api.weixin.qq.com/sns/jscode2session?appid={APP_ID}&secret={APP_SECRET}&js_code={code}&grant_type=authorization_code"
        
        try:
            response = requests.get(url)
            res_data = response.json()
            
            if 'openid' in res_data:
                openid = res_data['openid']
                # 这里可以直接把 openid 当作用户ID返回给前端
                # 也可以在这里把 openid 存入数据库建立用户档案
                return JsonResponse({'code': 200, 'msg': '登录成功', 'result': {'openid': openid}})
            else:
                return JsonResponse({'code': 400, 'msg': '微信接口调用失败', 'error': res_data})
        except Exception as e:
            return JsonResponse({'code': 500, 'msg': '服务器内部错误', 'error': str(e)})
            
    return JsonResponse({'code': 405, 'msg': '方法不允许'})