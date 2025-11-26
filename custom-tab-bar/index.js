Component({
  data: {
    selected: 0,
    color: "#999999",
    selectedColor: "#ff6b00",
    list: [] // 初始为空，等待从缓存或接口获取
  },
  attached() {
    // 组件加载时，尝试从缓存读取最新的 TabBar 配置
    const list = wx.getStorageSync('tabBarList');
    if (list) {
      this.setData({ list });
    }
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      const url = data.path;
      
      // 切换 Tab
      wx.switchTab({ url });
      
      // 更新选中态（虽然在页面 onShow 也会更新，但这里可以提升响应速度）
      this.setData({ selected: data.index });
    }
  }
})