// pages/category/category.js
Page({
  data: {
    currentTab: 0,
    categories: [],       // 改为动态获取
    currentGoodsList: []  // 新增：用于存储右侧显示的商品列表
  },

  onLoad(options) {
    // 页面加载时获取分类列表
    this.getCategories();
  },

  onShow() {
    const app = getApp();
    // 检查是否有从首页传来的跳转索引
    if (app.globalData.categoryIndex !== null && app.globalData.categoryIndex !== undefined) {
      const targetIndex = app.globalData.categoryIndex;
      
      this.setData({
        currentTab: targetIndex
      });
      
      // 如果分类列表已经加载完毕，直接加载对应商品
      if (this.data.categories.length > 0) {
        this.getGoodsList(targetIndex);
      }
      
      // 清空全局变量
      app.globalData.categoryIndex = null;
    }
    
    // 更新 TabBar 选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 })
    }
  },

  // 获取分类列表
  getCategories() {
    wx.request({
      url: 'http://127.0.0.1:8000/hardware_app/category/list/',
      method: 'GET',
      success: (res) => {
        if (res.data.code === 200) {
          this.setData({
            categories: res.data.result
          });
          
          // 分类加载完成后，加载当前选中分类的商品
          this.getGoodsList(this.data.currentTab);
        }
      }
    })
  },

  // 根据索引获取该分类下的商品
  getGoodsList(index) {
    const category = this.data.categories[index];
    if (!category) return;

    wx.showLoading({ title: '加载中...' });

    wx.request({
      url: 'http://127.0.0.1:8000/hardware_app/goods/list/',
      data: {
        category_id: category.id
      },
      success: (res) => {
        wx.hideLoading();
        if (res.data.code === 200) {
          this.setData({
            currentGoodsList: res.data.result
          });
        }
      },
      fail: () => {
        wx.hideLoading();
      }
    });
  },

  // 点击左侧分类
  onTabTap(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      currentTab: index
    });
    // 切换分类时重新获取商品
    this.getGoodsList(index);
  },

  // 点击右侧商品跳转详情
  onItemTap(e) {
    const id = e.currentTarget.dataset.id;
    const goods = this.data.currentGoodsList.find(item => item.id === id);
    
    if (goods) {
      wx.navigateTo({
        url: `/pages/goods_detail/goods_detail?id=${goods.id}&name=${encodeURIComponent(goods.name)}&price=${goods.price}&img=${encodeURIComponent(goods.img)}`
      });
    }
  }
})