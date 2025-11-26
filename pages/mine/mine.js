// pages/mine/mine.js
Page({
  data: {
    hasUserInfo: false, // 新增：判断是否已登录
    userInfo: {
      nickName: '点击登录',
      avatarUrl: '/images/launch.jpg' // 默认头像
    },
    orderTypes: [
      { icon: 'pending-payment', name: '待付款', count: 1 },
      { icon: 'pending-shipment', name: '待发货', count: 0 },
      { icon: 'pending-receipt', name: '待收货', count: 2 },
      { icon: 'completed', name: '已完成', count: 0 }
    ],
    // 菜单配置，增加 icon 字段
    menuList: [
      { name: '收货地址', type: 'address', icon: '/images/icon_address.png' }, // 请确保图片存在，或暂时使用占位图
      { name: '联系客服', type: 'contact', icon: '/images/icon_service.png' },
      { name: '意见反馈', type: 'feedback', icon: '/images/icon_feedback.png' },
      { name: '设置', type: 'setting', icon: '/images/icon_setting.png' }
    ]
  },

  onLoad(options) {
    // 检查本地存储是否有用户信息
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
        hasUserInfo: true
      });
    }
  },

  // 用户登录
  getUserProfile() {
    // 推荐使用 wx.getUserProfile 获取用户信息
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
        // 模拟登录（如果用户拒绝或在开发工具中调试）
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

  // 菜单点击处理
  onMenuTap(e) {
    const type = e.currentTarget.dataset.type;
    if (type === 'address') {
      wx.chooseAddress({}); // 微信原生收货地址
    } else if (type === 'setting') {
      wx.showToast({ title: '打开设置', icon: 'none' });
    }
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 })
    }
  }
})