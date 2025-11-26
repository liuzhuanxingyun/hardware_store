// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [
      '/images/home1.jpg',
      '/images/home2.jpg',
      '/images/home3.jpg',
      '/images/home4.jpg'
    ],
    // 新增分类数据
    categories: [
      { id: 1, name: '卫浴龙头', icon: '/images/icon_faucet.jpg' },
      { id: 2, name: '水电材料', icon: '/images/icon_material.jpg' },
      { id: 3, name: '五金杂项', icon: '/images/icon_hardware.jpg' },
      { id: 4, name: '常备工具', icon: '/images/icon_tool.jpg' }
    ],
    goodsList: [
      { id: 1, name: '全铜冷热面盆水龙头 家用洗脸盆防溅水', price: 399, img: '/images/goods1.png', tag: '热销' },
      { id: 2, name: '增压淋浴花洒套装 恒温数显黑色大喷头', price: 128, img: '/images/goods2.jpg', tag: '新品' },
      { id: 3, name: '304不锈钢波纹管 防爆耐高温进水软管', price: 66, img: '/images/goods3.jpg', tag: '' },
      { id: 4, name: '多功能活动扳手 卫浴安装专用工具', price: 45, img: '/images/goods1.jpg', tag: '特价' } // 模拟更多数据
    ]
  },

  // 点击商品跳转详情
  onGoodsTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.showToast({
      title: '查看商品ID: ' + id,
      icon: 'none'
    })
    // 实际开发中：
    // wx.navigateTo({ url: `/pages/goods-detail/index?id=${id}` })
  },

  // 点击分类
  onCategoryTap(e) {
    const id = e.currentTarget.dataset.id;
    
    // 1. 计算索引：你的 id 是 1,2,3,4，而 tab 索引是 0,1,2,3，所以减 1
    const targetIndex = id - 1;

    // 2. 存入全局变量
    const app = getApp();
    app.globalData.categoryIndex = targetIndex;

    // 3. 切换到分类Tab
    wx.switchTab({
      url: '/pages/category/category'
    })
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

  }
})