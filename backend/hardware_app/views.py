from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
import json
import requests
# 引入 Order, OrderItem
from .models import Welcome, Banner, Category, Goods, TabBar, CartItem, Address, Order, OrderItem
from dotenv import load_dotenv
import os
import datetime
import random

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

def welcome(request):
    res = Welcome.objects.all().order_by('-order').first()
    if res:
        img = 'http://127.0.0.1:8000/backend/media/' + str(res.img)
        return JsonResponse({'code': 100, 'msg': '成功', 'result': img})
    else:
        return JsonResponse({'code': 101, 'msg': '暂无欢迎页图片', 'result': ''})

def banner_list(request):
    banners = Banner.objects.filter(is_active=True).order_by('order')
    data = []
    for b in banners:
        if b.img:
            img_url = f"http://127.0.0.1:8000/backend/media/{b.img}"
        else:
            img_url = ""
        data.append({
            'id': b.id,
            'img': img_url,
            'title': b.title,
            'link': b.link
        })
    return JsonResponse({'code': 200, 'msg': '获取成功', 'result': data})

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
        specs = []
        for spec in g.specs.all():
            specs.append({
                'id': spec.id,
                'name': spec.name,
                'price': float(spec.price) if spec.price else float(g.price),
            })
        data.append({
            'id': g.id,
            'name': g.name,
            'price': str(g.price),
            'img': img_url,
            'tag': '热销' if g.is_hot else ('新品' if g.is_new else ''),
            'has_specs': len(specs) > 0,
            'specs': specs
        })
    return JsonResponse({'code': 200, 'msg': '获取成功', 'result': data})

def goods_detail(request):
    goods_id = request.GET.get('id')
    try:
        goods = Goods.objects.get(id=goods_id)
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
            'detailImages': [f"http://127.0.0.1:8000/backend/media/{goods.img}"],
            'specs': specs
        }
        return JsonResponse({'code': 200, 'msg': '获取成功', 'result': data})
    except Goods.DoesNotExist:
        return JsonResponse({'code': 404, 'msg': '商品不存在'})

def tabbar_list(request):
    tabs = TabBar.objects.filter(is_active=True).order_by('order')
    data = []
    for t in tabs:
        icon_url = f"http://127.0.0.1:8000/backend/media/{t.icon}" if t.icon else ""
        selected_icon_url = f"http://127.0.0.1:8000/backend/media/{t.selected_icon}" if t.selected_icon else ""
        data.append({
            'pagePath': t.page_path,
            'text': t.name,
            'iconPath': icon_url,
            'selectedIconPath': selected_icon_url
        })
    return JsonResponse({'code': 200, 'msg': '获取成功', 'result': data})

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
        user = authenticate(username=username, password=password)
        if user is not None:
            return JsonResponse({
                'code': 200, 
                'msg': '登录成功', 
                'result': {
                    'id': user.id,
                    'username': user.username,
                    'is_superuser': user.is_superuser,
                }
            })
        else:
            return JsonResponse({'code': 401, 'msg': '账号或密码错误'})
    return JsonResponse({'code': 405, 'msg': 'Method not allowed'})

@csrf_exempt
def add_to_cart(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        goods_id = data.get('goods_id')
        user_id = data.get('user_id', 'test_user')
        count = data.get('count', 1)
        spec_name = data.get('spec_name', '标准规格')
        try:
            item = CartItem.objects.get(user_id=user_id, goods_id=goods_id, spec_name=spec_name)
            item.count += count
            item.save()
        except CartItem.DoesNotExist:
            CartItem.objects.create(user_id=user_id, goods_id=goods_id, count=count, spec_name=spec_name)
        return JsonResponse({'code': 200, 'msg': '加入购物车成功'})
    return JsonResponse({'code': 405, 'msg': '方法不允许'})

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
            'price': float(item.goods.price),
            'img': img_url,
            'num': item.count,
            'selected': item.is_selected,
            'spec': item.spec_name
        })
    return JsonResponse({'code': 200, 'msg': '获取成功', 'result': data})

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

@csrf_exempt
def delete_cart(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        cart_id = data.get('cart_id')
        CartItem.objects.filter(id=cart_id).delete()
        return JsonResponse({'code': 200, 'msg': '删除成功'})

@csrf_exempt
def wechat_login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        code = data.get('code')
        if not code:
            return JsonResponse({'code': 400, 'msg': '缺少code'})
        APP_ID = os.getenv('WECHAT_APP_ID')
        APP_SECRET = os.getenv('WECHAT_APP_SECRET')
        url = f"https://api.weixin.qq.com/sns/jscode2session?appid={APP_ID}&secret={APP_SECRET}&js_code={code}&grant_type=authorization_code"
        try:
            response = requests.get(url)
            res_data = response.json()
            if 'openid' in res_data:
                openid = res_data['openid']
                return JsonResponse({'code': 200, 'msg': '登录成功', 'result': {'openid': openid}})
            else:
                return JsonResponse({'code': 400, 'msg': '微信接口调用失败', 'error': res_data})
        except Exception as e:
            return JsonResponse({'code': 500, 'msg': '服务器内部错误', 'error': str(e)})
    return JsonResponse({'code': 405, 'msg': '方法不允许'})

def address_list(request):
    user_id = request.GET.get('user_id')
    addresses = Address.objects.filter(user_id=user_id)
    data = []
    for addr in addresses:
        data.append({
            'id': addr.id,
            'name': addr.name,
            'phone': addr.phone,
            'region': addr.region.split(' '),
            'region_str': addr.region,
            'detail': addr.detail,
            'is_default': addr.is_default
        })
    return JsonResponse({'code': 200, 'msg': '获取成功', 'result': data})

@csrf_exempt
def address_save(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        addr_id = data.get('id')
        user_id = data.get('user_id')
        name = data.get('name')
        phone = data.get('phone')
        region_list = data.get('region', [])
        region = " ".join(region_list) if isinstance(region_list, list) else region_list
        detail = data.get('detail')
        is_default = data.get('is_default', False)
        if is_default:
            Address.objects.filter(user_id=user_id).update(is_default=False)
        if addr_id:
            Address.objects.filter(id=addr_id).update(
                name=name, phone=phone, region=region, detail=detail, is_default=is_default
            )
        else:
            if not Address.objects.filter(user_id=user_id).exists():
                is_default = True
            Address.objects.create(
                user_id=user_id, name=name, phone=phone, region=region, detail=detail, is_default=is_default
            )
        return JsonResponse({'code': 200, 'msg': '保存成功'})

@csrf_exempt
def address_delete(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        Address.objects.filter(id=data.get('id')).delete()
        return JsonResponse({'code': 200, 'msg': '删除成功'})

# 1. 提交订单接口
@csrf_exempt
def submit_order(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_id = data.get('user_id')
            address = data.get('address')
            remark = data.get('remark', '')
            items = data.get('items', [])

            if not user_id or not address or not items:
                return JsonResponse({'code': 400, 'msg': '参数不完整'})

            # 生成唯一订单号
            order_no = datetime.datetime.now().strftime('%Y%m%d%H%M%S') + str(random.randint(1000, 9999))
            
            # 计算总价
            total_price = 0
            for item in items:
                # 注意：前端传过来的可能是字符串，需转float
                price = float(item.get('price', 0))
                num = int(item.get('num', 1))
                total_price += price * num

            # 生成地址快照
            address_snapshot = f"{address.get('name')} {address.get('phone')} {address.get('region_str', '')} {address.get('detail')}"

            # 创建订单
            order = Order.objects.create(
                user_id=user_id,
                order_no=order_no,
                total_price=total_price,
                address_snapshot=address_snapshot,
                remark=remark
            )

            # 创建订单明细
            for item in items:
                OrderItem.objects.create(
                    order=order,
                    goods_name=item.get('name'),
                    spec_name=item.get('spec', '标准规格'),
                    price=item.get('price'),
                    count=item.get('num'),
                    img=item.get('img', '')
                )

            # 清空购物车 (可选，根据需求决定是否开启)
            # CartItem.objects.filter(user_id=user_id).delete() 

            return JsonResponse({'code': 200, 'msg': '下单成功', 'result': {'order_no': order_no}})

        except Exception as e:
            print(f"下单错误: {e}") 
            return JsonResponse({'code': 500, 'msg': '服务器错误', 'error': str(e)})
            
    return JsonResponse({'code': 405, 'msg': '方法不允许'})

# --- 👇 请务必确认添加了以下代码 👇 ---

def my_order_list(request):
    """
    获取我的订单列表
    """
    user_id = request.GET.get('user_id')
    if not user_id:
        return JsonResponse({'code': 400, 'msg': '缺少用户ID'})
    
    # 查询该用户的订单，按时间倒序
    orders = Order.objects.filter(user_id=user_id).order_by('-created_at')
    data = []
    
    for order in orders:
        item_list = []
        # 遍历订单下的商品
        for item in order.items.all():
            item_list.append({
                'name': item.goods_name,
                'spec': item.spec_name,
                'price': float(item.price),
                'count': item.count,
                'img': item.img
            })
            
        data.append({
            'id': order.id,
            'order_no': order.order_no,
            'status': '待发货' if order.status == 'pending' else '已完成',
            'total_price': float(order.total_price),
            'created_at': order.created_at.strftime('%Y-%m-%d %H:%M'),
            'items': item_list,
            'item_count': sum(item['count'] for item in item_list)
        })
        
    return JsonResponse({'code': 200, 'msg': '获取成功', 'result': data})