// pages/order_confirm/order_confirm.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderItems: [],
    totalPrice: '0.00',
    address: null,
    remark: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // --- 新增：加载结算商品 ---
    const items = wx.getStorageSync('checkoutItems');
    if (items) {
      this.setData({ orderItems: items });
      this.calculateTotal();
    }
    // -----------------------

    // 1. 优先检查是否有从地址列表选中的地址
    const selectedAddr = wx.getStorageSync('selectedAddress');
    if (selectedAddr) {
      this.setData({ address: selectedAddr });
      wx.removeStorageSync('selectedAddress'); //以此为一次性选择
    } else if (!this.data.address) {
      // 2. 如果没有，则从后端获取默认地址
      this.getDefaultAddress();
    }
  },

  getDefaultAddress() {
    const userId = wx.getStorageSync('openid') || 'test_user';
    wx.request({
      url: 'http://127.0.0.1:8000/hardware_app/address/list/',
      data: { user_id: userId },
      success: (res) => {
        if (res.data.code === 200 && res.data.result.length > 0) {
          // 找到默认地址，或者取第一个
          const defaultAddr = res.data.result.find(item => item.is_default) || res.data.result[0];
          this.setData({ address: defaultAddr });
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  /**
   * 计算总价
   */
  calculateTotal() {
    let total = 0;
    this.data.orderItems.forEach(item => {
      total += item.price * item.num;
    });
    this.setData({ totalPrice: total.toFixed(2) });
  },

  /**
   * 选择地址（修改为跳转自定义页面）
   */
  chooseAddress() {
    wx.navigateTo({
      url: '/pages/address_list/address_list?source=order'
    });
  },

  /**
   * 输入备注
   */
  onRemarkInput(e) {
    this.setData({ remark: e.detail.value });
  },

  /**
   * 提交订单
   */
  submitOrder() {
    if (!this.data.address) {
      wx.showToast({ title: '请选择收货地址', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '正在提交...' });

    // 模拟提交订单到后端
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({ title: '下单成功', icon: 'success' });

      // 清除购物车中已购买的商品（这里需要调用后端接口真正删除）
      // 暂时只清除本地缓存
      wx.removeStorageSync('checkoutItems');

      // 延迟跳转回首页或订单列表
      setTimeout(() => {
        wx.switchTab({ url: '/pages/home/home' });
      }, 1500);
    }, 1000);
  }
})