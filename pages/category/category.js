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

  onItemTap(e) {
    const name = e.currentTarget.dataset.name;
    wx.showToast({
      title: '点击了: ' + name,
      icon: 'none'
    });
  }
})