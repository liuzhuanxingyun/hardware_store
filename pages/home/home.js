// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [], // 1. 把这里的假数据清空，留个空数组即可，等待后端填入
    categories: [
      { id: 1, name: '卫浴龙头', icon: '/images/icon_faucet.jpg' },
      { id: 2, name: '水电材料', icon: '/images/icon_material.jpg' },
      { id: 3, name: '五金杂项', icon: '/images/icon_hardware.jpg' },
      { id: 4, name: '常备工具', icon: '/images/icon_tool.jpg' }
    ],
    goodsList: [] // 修改处：清空这里的假数据，等待接口填充
  },

  // 点击商品跳转详情
  onGoodsTap(e) {
    const id = e.currentTarget.dataset.id;
    // 查找当前点击的商品数据
    const goods = this.data.goodsList.find(item => item.id === id);
    
    if (goods) {
      wx.navigateTo({
        url: `/pages/goods_detail/goods_detail?id=${goods.id}&name=${encodeURIComponent(goods.name)}&price=${goods.price}&img=${encodeURIComponent(goods.img)}`
      });
    }
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
    // 2. 页面加载时，调用获取轮播图的方法
    this.getBanners();
    // 修改处：调用获取商品列表的方法
    this.getGoodsList();
  },

  // 3. 新增：获取轮播图数据的方法
  getBanners() {
    wx.request({
      url: 'http://127.0.0.1:8000/hardware_app/banner/list/', // 后端接口地址
      method: 'GET',
      success: (res) => {
        console.log('轮播图数据获取成功：', res.data);
        if (res.data.code === 200) {
          // 拿到数据后，更新到页面的 data 中
          this.setData({
            banners: res.data.result
          });
        }
      },
      fail: (err) => {
        console.error('轮播图请求失败', err);
      }
    })
  },

  // 修改处：新增获取商品列表的方法
  getGoodsList() {
    wx.request({
      url: 'http://127.0.0.1:8000/hardware_app/goods/list/',
      method: 'GET',
      // data: { is_hot: 'true' }, // 如果只想显示勾选了“是否热销”的商品，可以加上这行
      success: (res) => {
        console.log('商品列表获取成功：', res.data);
        if (res.data.code === 200) {
          this.setData({
            goodsList: res.data.result
          });
        }
      },
      fail: (err) => {
        console.error('商品列表请求失败', err);
      }
    })
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
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 })
    }
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