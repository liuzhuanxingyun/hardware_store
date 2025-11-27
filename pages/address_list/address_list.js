// pages/address_list/address_list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: [],
    source: '' // 判断来源，'order'表示从订单页来
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.source) {
      this.data.source = options.source;
    }
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
    this.getAddressList();
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
   * 获取地址列表
   */
  getAddressList() {
    const userId = wx.getStorageSync('openid') || 'test_user';
    wx.request({
      url: 'http://127.0.0.1:8000/hardware_app/address/list/',
      data: { user_id: userId },
      success: (res) => {
        if (res.data.code === 200) {
          this.setData({ addressList: res.data.result });
        }
      }
    });
  },

  /**
   * 添加地址
   */
  onAdd() {
    wx.navigateTo({ url: '/pages/address_edit/address_edit' });
  },

  /**
   * 编辑地址
   */
  onEdit(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/pages/address_edit/address_edit?id=${item.id}&name=${item.name}&phone=${item.phone}&detail=${item.detail}&is_default=${item.is_default}&region=${JSON.stringify(item.region)}`
    });
  },

  /**
   * 选择地址
   */
  onSelect(e) {
    if (this.data.source === 'order') {
      const item = e.currentTarget.dataset.item;
      wx.setStorageSync('selectedAddress', item);
      wx.navigateBack();
    }
  }
})