Page({
  data: {
    goods: {
      id: '',
      name: '',
      price: '',
      img: '',
      description: '',
      detailImages: [],
      specs: [] // 规格列表
    },
    showSpecPopup: false,
    actionType: '', // 'cart' or 'buy'
    currentSpec: null,
    currentPrice: null,
    buyCount: 1
  },

  onLoad(options) {
    const id = options.id;
    if (id) {
      this.getGoodsDetail(id);
    }
  },

  getGoodsDetail(id) {
    wx.request({
      url: 'http://127.0.0.1:8000/hardware_app/goods/detail/',
      data: { id: id },
      success: (res) => {
        if (res.data.code === 200) {
          const goods = res.data.result;
          this.setData({
            goods: goods,
            currentPrice: goods.price // 默认显示商品原价
          });
          
          // 如果有规格，默认选中第一个
          if (goods.specs && goods.specs.length > 0) {
            this.setData({
              currentSpec: goods.specs[0],
              currentPrice: goods.specs[0].price
            });
          }
        }
      }
    });
  },

  goHome() {
    wx.switchTab({ url: '/pages/home/home' });
  },

  // 显示加入购物车面板
  showCartPopup() {
    this.setData({
      showSpecPopup: true,
      actionType: 'cart'
    });
  },

  // 显示立即购买面板
  showBuyPopup() {
    this.setData({
      showSpecPopup: true,
      actionType: 'buy'
    });
  },

  closePopup() {
    this.setData({ showSpecPopup: false });
  },

  // 选择规格
  selectSpec(e) {
    const spec = e.currentTarget.dataset.spec;
    this.setData({
      currentSpec: spec,
      currentPrice: spec.price
    });
  },

  // 调整数量
  changeCount(e) {
    const type = e.currentTarget.dataset.type;
    let count = this.data.buyCount;
    if (type === 'minus' && count > 1) {
      count--;
    } else if (type === 'plus') {
      count++;
    }
    this.setData({ buyCount: count });
  },

  // 确认按钮点击
  confirmAction() {
    if (this.data.actionType === 'cart') {
      this.addToCart();
    } else {
      this.buyNow();
    }
  },

  addToCart() {
    // 修改处：优先从缓存获取 openid
    const userId = wx.getStorageSync('openid') || 'test_user'; 
    const specName = this.data.currentSpec ? this.data.currentSpec.name : '标准规格';

    wx.request({
      url: 'http://127.0.0.1:8000/hardware_app/cart/add/',
      method: 'POST',
      data: {
        user_id: userId,
        goods_id: this.data.goods.id,
        count: this.data.buyCount,
        spec_name: specName
      },
      success: (res) => {
        if (res.data.code === 200) {
          wx.showToast({ title: '已加入购物车', icon: 'success' });
          this.closePopup();
        } else {
          wx.showToast({ title: '添加失败', icon: 'none' });
        }
      },
      fail: () => {
        wx.showToast({ title: '网络错误', icon: 'none' });
      }
    });
  },

  buyNow() {
    // 这里可以跳转到订单确认页面，传递商品信息
    wx.showToast({ title: '功能开发中...', icon: 'none' });
  }
})