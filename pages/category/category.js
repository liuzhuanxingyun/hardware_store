// pages/category/category.js
Page({
  data: {
    currentTab: 0,
    // 与首页保持一致的分类结构
    categories: [
      { id: 1, name: '卫浴龙头' },
      { id: 2, name: '水电材料' },
      { id: 3, name: '五金杂项' },
      { id: 4, name: '常备工具' }
    ],
    // 模拟右侧子分类/商品数据
    subCategories: [
      [
        { name: '面盆龙头', icon: '/images/goods1.png' },
        { name: '淋浴花洒', icon: '/images/goods2.jpg' },
        { name: '厨房龙头', icon: '/images/goods3.jpg' },
        { name: '拖把池龙头', icon: '/images/goods1.jpg' }
      ],
      [
        { name: '进水软管', icon: '/images/goods3.jpg' },
        { name: '生料带', icon: '/images/goods1.png' },
        { name: '地漏', icon: '/images/goods2.jpg' }
      ],
      [
        { name: '角阀', icon: '/images/goods1.jpg' },
        { name: '浴室挂件', icon: '/images/goods2.jpg' },
        { name: '合页铰链', icon: '/images/goods3.jpg' }
      ],
      [
        { name: '活动扳手', icon: '/images/goods1.jpg' },
        { name: '螺丝刀', icon: '/images/goods2.jpg' },
        { name: '卷尺', icon: '/images/goods3.jpg' }
      ]
    ]
  },

  onTabTap(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      currentTab: index
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const app = getApp();
    // 检查全局变量中是否有指定的索引
    if (app.globalData.categoryIndex !== null && app.globalData.categoryIndex !== undefined) {
      this.setData({
        currentTab: app.globalData.categoryIndex
      });
      // 跳转完成后，清空全局变量，以免影响后续正常点击 TabBar
      app.globalData.categoryIndex = null;
    }
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 })
    }
  },

  onItemTap(e) {
    const name = e.currentTarget.dataset.name;
    // 查找商品图片
    let img = '';
    for(let group of this.data.subCategories) {
        const found = group.find(item => item.name === name);
        if(found) {
            img = found.icon;
            break;
        }
    }

    wx.navigateTo({
      url: `/pages/goods_detail/goods_detail?name=${encodeURIComponent(name)}&img=${encodeURIComponent(img)}&price=99.00` // 默认价格
    });
  }
})