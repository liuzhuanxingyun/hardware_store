Page({
  data: {
    goods: {
      id: '',
      name: '',
      price: '',
      img: '',
      description: '',
      detailImages: []
    }
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
          this.setData({
            goods: res.data.result
          });
        }
      }
    });
  },

  // 返回首页
  goHome() {
    wx.switchTab({
      url: '/pages/home/home'
    });
  },

  addToCart() {
    wx.showToast({
      title: '已加入购物车',
      icon: 'success'
    });
  },

  buyNow() {
    wx.showToast({
      title: '正在购买...',
      icon: 'none'
    });
  }
})