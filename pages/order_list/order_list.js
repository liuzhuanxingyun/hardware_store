// pages/order_list/order_list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: []
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
    this.getOrderList();
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
   * 获取订单列表
   */
  getOrderList() {
    // 1. 获取当前登录用户的 OpenID
    const userId = wx.getStorageSync('openid');
    
    if (!userId) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '加载订单中...' });

    // 2. 向后端发起请求
    wx.request({
      url: 'http://127.0.0.1:8000/hardware_app/order/list/',
      method: 'GET',
      data: { user_id: userId },
      success: (res) => {
        wx.hideLoading();
        console.log('订单列表返回：', res.data); // 调试用
        
        if (res.data.code === 200) {
          this.setData({ orderList: res.data.result });
        } else {
          // 如果后端返回错误信息
          wx.showToast({ title: '获取失败', icon: 'none' });
        }
      },
      fail: (err) => {
        wx.hideLoading();
        console.error('订单请求失败', err);
        wx.showToast({ title: '网络连接错误', icon: 'none' });
      }
    });
  }
})