// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [],
    categories: [], // 修改：初始化为空数组，等待后端获取
    goodsList: [],
    
    // --- 新增：弹窗相关数据 ---
    showSpecPopup: false,
    currentGoods: null, // 当前选中的商品
    currentSpec: null,  // 当前选中的规格
    buyCount: 1,        // 购买数量
    currentPrice: null  // 当前显示价格
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

  // 修改：首页点击加号，弹出规格面板
  onAddToCart(e) {
    const item = e.currentTarget.dataset.item;
    
    // 初始化选中状态
    let initialSpec = null;
    let initialPrice = item.price;

    // 如果商品有规格，默认选中第一个
    if (item.specs && item.specs.length > 0) {
        initialSpec = item.specs[0];
        initialPrice = initialSpec.price; // 如果规格有特定价格
    }

    this.setData({
      showSpecPopup: true,
      currentGoods: item,
      buyCount: 1,
      currentSpec: initialSpec,
      currentPrice: initialPrice
    });
  },

  // --- 新增：弹窗交互方法 ---

  // 关闭弹窗
  closePopup() {
    this.setData({
      showSpecPopup: false
    });
  },

  // 选择规格
  selectSpec(e) {
    const spec = e.currentTarget.dataset.spec;
    this.setData({
      currentSpec: spec,
      currentPrice: spec.price // 更新为规格价格
    });
  },

  // 调整数量
  changeCount(e) {
    const type = e.currentTarget.dataset.type;
    let count = this.data.buyCount;
    if (type === 'minus') {
      if (count > 1) count--;
    } else {
      count++;
    }
    this.setData({
      buyCount: count
    });
  },

  // 确认加入购物车
  confirmAction() {
    const userId = wx.getStorageSync('openid') || 'test_user';
    const { currentGoods, buyCount, currentSpec } = this.data;

    wx.showLoading({ title: '添加中...' });

    wx.request({
      url: 'http://127.0.0.1:8000/hardware_app/cart/add/',
      method: 'POST',
      data: {
        user_id: userId,
        goods_id: currentGoods.id,
        count: buyCount,
        spec_name: currentSpec ? currentSpec.name : '标准规格'
      },
      success: (res) => {
        wx.hideLoading();
        if (res.data.code === 200) {
          wx.showToast({
            title: '已加入购物车',
            icon: 'success'
          });
          this.closePopup(); // 成功后关闭弹窗
        } else {
          wx.showToast({ title: '添加失败', icon: 'none' });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({ title: '网络错误', icon: 'none' });
      }
    });
  },

  // 点击分类
  onCategoryTap(e) {
    const id = e.currentTarget.dataset.id;
    
    // 修改：动态查找索引，而不是简单减1，防止ID不连续导致错误
    const targetIndex = this.data.categories.findIndex(item => item.id === id);

    if (targetIndex !== -1) {
      // 2. 存入全局变量
      const app = getApp();
      app.globalData.categoryIndex = targetIndex;

      // 3. 切换到分类Tab
      wx.switchTab({
        url: '/pages/category/category'
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 2. 页面加载时，调用获取轮播图的方法
    this.getBanners();
    // 新增：调用获取分类列表的方法
    this.getCategories();
    // 修改处：调用获取商品列表的方法
    this.getGoodsList();
  },

  // 新增：获取分类列表的方法
  getCategories() {
    wx.request({
      url: 'http://127.0.0.1:8000/hardware_app/category/list/',
      method: 'GET',
      success: (res) => {
        console.log('分类数据获取成功：', res.data);
        if (res.data.code === 200) {
          this.setData({
            categories: res.data.result
          });
        }
      },
      fail: (err) => {
        console.error('分类请求失败', err);
      }
    })
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