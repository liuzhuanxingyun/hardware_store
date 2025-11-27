// pages/address_edit/address_edit.js
Page({
  data: {
    id: null,
    name: '',
    phone: '',
    region: ['广东省', '广州市', '天河区'],
    detail: '',
    isDefault: false
  },
  onLoad(options) {
    if (options.id) {
      this.setData({
        id: options.id,
        name: options.name,
        phone: options.phone,
        detail: options.detail,
        isDefault: options.is_default === 'true',
        region: JSON.parse(options.region)
      });
      wx.setNavigationBarTitle({ title: '编辑收货地址' });
    }
  },
  onRegionChange(e) {
    this.setData({ region: e.detail.value });
  },
  onInput(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({ [key]: e.detail.value });
  },
  onSwitchChange(e) {
    this.setData({ isDefault: e.detail.value });
  },
  save() {
    const userId = wx.getStorageSync('openid') || 'test_user';
    wx.request({
      url: 'http://127.0.0.1:8000/hardware_app/address/save/',
      method: 'POST',
      data: {
        id: this.data.id,
        user_id: userId,
        name: this.data.name,
        phone: this.data.phone,
        region: this.data.region,
        detail: this.data.detail,
        is_default: this.data.isDefault
      },
      success: (res) => {
        if (res.data.code === 200) {
          wx.navigateBack();
        }
      }
    });
  },
  deleteAddr() {
    if (!this.data.id) return;
    wx.showModal({
      title: '提示',
      content: '确定要删除该地址吗？',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: 'http://127.0.0.1:8000/hardware_app/address/delete/',
            method: 'POST',
            data: { id: this.data.id },
            success: (res) => {
              if (res.data.code === 200) wx.navigateBack();
            }
          });
        }
      }
    });
  }
})