// pages/mine/mine.js
const app = getApp();

Page({
  data: {
    userInfo: {
      nickName: '微信用户',
      avatarUrl: '/images/launch.jpg' // 默认头像，可以使用 logo 或其他通用图
    },
    userId: '', // 用于展示简短ID
    menuList: [
      { name: '订单记录', type: 'orders', icon: '/images/icon_order.png' },
      { name: '收货地址', type: 'address', icon: '/images/icon_address.png' },
      { name: '联系客服', type: 'contact', icon: '/images/icon_service.png' } // 示例新增
    ]
  },

  onLoad() {
    this.checkLoginStatus();
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 })
    }
    // 每次显示页面也检查一下，防止 OpenID 异步获取延迟
    this.checkLoginStatus();
  },

  checkLoginStatus() {
    const openid = wx.getStorageSync('openid');
    if (openid) {
      // 截取 OpenID 后6位作为展示ID，看起来像个会员号
      const shortId = openid.substring(openid.length - 6).toUpperCase();
      
      this.setData({
        userId: shortId,
        'userInfo.nickName': '微信用户 ' + shortId
      });
    }
  },

  onMenuTap(e) {
    const type = e.currentTarget.dataset.type;
    if (type === 'address') {
      // 微信原生收货地址管理
      wx.chooseAddress({});
    } else if (type === 'orders') {
      wx.showToast({ title: '暂无订单记录', icon: 'none' });
    } else if (type === 'contact') {
      wx.makePhoneCall({
        phoneNumber: '13800000000' // 替换为你的五金店电话
      });
    }
  }
})