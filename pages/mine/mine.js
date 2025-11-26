// pages/mine/mine.js
Page({
  data: {
    hasUserInfo: false,
    userInfo: null,
    username: '',
    password: '',
    showLoginModal: false, // 新增：控制弹窗显示
    menuList: [
      { name: '订单记录', type: 'orders', icon: '/images/icon_order.png' },
      { name: '收货地址', type: 'address', icon: '/images/icon_address.png' }
    ]
  },

  onLoad(options) {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
        hasUserInfo: true
      });
    }
  },

  // 点击头部：如果未登录，打开弹窗
  onHeaderTap() {
    if (!this.data.hasUserInfo) {
      this.setData({ showLoginModal: true });
    }
  },

  // 关闭弹窗
  closeLoginModal() {
    this.setData({ showLoginModal: false });
  },

  // 阻止冒泡（防止点击弹窗内容时关闭弹窗）
  preventBubble() {},

  onInputUsername(e) {
    this.setData({ username: e.detail.value });
  },
  onInputPassword(e) {
    this.setData({ password: e.detail.value });
  },

  doLogin() {
    if (!this.data.username || !this.data.password) {
      wx.showToast({ title: '请输入账号密码', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '登录中...' });

    wx.request({
      url: 'http://127.0.0.1:8000/hardware_app/login/',
      method: 'POST',
      data: {
        username: this.data.username,
        password: this.data.password
      },
      success: (res) => {
        wx.hideLoading();
        if (res.data.code === 200) {
          const user = res.data.result;
          const userInfo = {
            nickName: user.username,
            avatarUrl: '/images/launch.jpg', // 建议换成一个通用的默认头像
            id: user.id
          };

          this.setData({
            userInfo: userInfo,
            hasUserInfo: true,
            showLoginModal: false, // 登录成功关闭弹窗
            username: '', // 清空输入
            password: ''
          });

          wx.setStorageSync('userInfo', userInfo);
          wx.showToast({ title: '登录成功' });
        } else {
          wx.showToast({ title: res.data.msg || '登录失败', icon: 'none' });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({ title: '网络请求失败', icon: 'none' });
      }
    });
  },

  doLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            hasUserInfo: false,
            userInfo: null
          });
          wx.removeStorageSync('userInfo');
        }
      }
    });
  },

  onMenuTap(e) {
    const type = e.currentTarget.dataset.type;
    if (type === 'address') {
      wx.chooseAddress({});
    } else if (type === 'orders') {
      wx.showToast({ title: '查看订单记录', icon: 'none' });
    }
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 })
    }
  }
})