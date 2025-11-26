// pages/cart/cart.js
Page({
  data: {
    cartList: [
      { 
        id: 101, 
        name: '全铜冷热面盆水龙头', 
        price: 399, 
        img: '/images/goods1.png', 
        num: 1, 
        selected: true, 
        spec: '全铜主体' 
      },
      { 
        id: 102, 
        name: '多功能五金工具箱', 
        price: 128, 
        img: '/images/icon_tool.jpg', 
        num: 1, 
        selected: false, 
        spec: '家用套装' 
      }
    ],
    allSelected: false,
    totalPrice: 0
  },

  onLoad() {
    // 页面加载时添加测试数据
    this.addTestData();
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 })
    }
    this.checkAllSelected();
    this.calculateTotal();
  },

  // 生成10条假数据用于测试
  addTestData() {
    const testItems = [
      { name: '加厚不锈钢水槽', price: 450, img: '/images/icon_faucet.jpg' },
      { name: '家用电动螺丝刀', price: 199, img: '/images/icon_tool.jpg' },
      { name: '防滑耐磨劳保手套', price: 15, img: '/images/icon_material.jpg' },
      { name: '强力万能胶水', price: 8, img: '/images/icon_hardware.jpg' },
      { name: '高精度卷尺 5M', price: 25, img: '/images/icon_tool.jpg' },
      { name: '多功能扳手套装', price: 88, img: '/images/icon_hardware.jpg' },
      { name: 'LED节能灯泡 10W', price: 12, img: '/images/icon_material.jpg' },
      { name: '家用插排接线板', price: 45, img: '/images/icon_hardware.jpg' },
      { name: 'PVC绝缘胶带', price: 5, img: '/images/icon_material.jpg' },
      { name: '羊角锤', price: 35, img: '/images/icon_tool.jpg' }
    ];

    const newList = testItems.map((item, index) => ({
      id: 200 + index, // 生成唯一ID
      name: item.name,
      price: item.price,
      img: item.img,
      num: 1,
      selected: false,
      spec: '标准规格'
    }));

    this.setData({
      cartList: [...this.data.cartList, ...newList]
    });
    
    // 数据更新后重新计算状态
    this.checkAllSelected();
    this.calculateTotal();
  },

  // 切换单选
  toggleSelect(e) {
    const index = e.currentTarget.dataset.index;
    const key = `cartList[${index}].selected`;
    this.setData({
      [key]: !this.data.cartList[index].selected
    });
    this.checkAllSelected();
    this.calculateTotal();
  },

  // 全选/反选
  toggleAllSelect() {
    const allSelected = !this.data.allSelected;
    const list = this.data.cartList.map(item => {
      item.selected = allSelected;
      return item;
    });
    this.setData({
      cartList: list,
      allSelected: allSelected
    });
    this.calculateTotal();
  },

  // 检查是否全选
  checkAllSelected() {
    if (this.data.cartList.length === 0) {
      this.setData({ allSelected: false });
      return;
    }
    const allSelected = this.data.cartList.every(item => item.selected);
    this.setData({ allSelected });
  },

  // 数量变化
  updateQuantity(e) {
    const index = e.currentTarget.dataset.index;
    const type = e.currentTarget.dataset.type;
    let num = this.data.cartList[index].num;

    if (type === 'minus' && num > 1) {
      num--;
    } else if (type === 'plus') {
      num++;
    }

    const key = `cartList[${index}].num`;
    this.setData({ [key]: num });
    this.calculateTotal();
  },

  // 删除商品
  onDeleteItem(e) {
    const index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '提示',
      content: '确定要删除这个商品吗？',
      success: (res) => {
        if (res.confirm) {
          const list = this.data.cartList;
          list.splice(index, 1);
          this.setData({
            cartList: list
          });
          this.checkAllSelected();
          this.calculateTotal();
          
          wx.showToast({
            title: '已删除',
            icon: 'none'
          });
        }
      }
    });
  },

  // 计算总价
  calculateTotal() {
    let total = 0;
    this.data.cartList.forEach(item => {
      if (item.selected) {
        total += item.price * item.num;
      }
    });
    this.setData({ totalPrice: total });
  },

  onCheckout() {
    if (this.data.totalPrice === 0) {
      wx.showToast({ title: '请选择商品', icon: 'none' });
      return;
    }
    wx.showToast({ title: '正在前往结算...', icon: 'none' });
  },

  onGoodsTap(e) {
    const index = e.currentTarget.dataset.index;
    const goods = this.data.cartList[index];
    wx.navigateTo({
      url: `/pages/goods_detail/goods_detail?id=${goods.id}`
    });
  }
})