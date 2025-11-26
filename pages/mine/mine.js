// pages/mine/mine.js
Page({
  data: {
    hasUserInfo: false,
    userInfo: {
      nickName: '点击登录',
      avatarUrl: '/images/launch.jpg'
    },
    // 菜单配置：添加订单记录，保留收货地址
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

  getUserProfile() {
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
        wx.setStorageSync('userInfo', res.userInfo);
      },
      fail: () => {
        const fakeUser = {
          nickName: '五金达人',
          avatarUrl: '/images/launch.jpg'
        };
        this.setData({
          userInfo: fakeUser,
          hasUserInfo: true
        });
        wx.setStorageSync('userInfo', fakeUser);
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