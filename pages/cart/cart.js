// pages/cart/cart.js
Page({
  data: {
    cartList: [
      { id: 1, name: '全铜冷热面盆水龙头', price: 399, img: '/images/goods1.png', num: 1, selected: true, spec: '全铜主体' },
      { id: 2, name: '304不锈钢波纹管', price: 66, img: '/images/goods3.jpg', num: 2, selected: false, spec: '50cm' }
    ],
    allSelected: false,
    totalPrice: 0
  },

  onShow() {
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
    const allSelected = this.data.cartList.every(item => item.selected);
    this.setData({ allSelected });
  },

  // 数量变化
  updateQuantity(e) {
    const index = e.currentTarget.dataset.index;
    const type = e.currentTarget.dataset.type; // 'plus' or 'minus'
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
          this.checkAllSelected(); // 删除后重新检查全选状态
          this.calculateTotal();   // 重新计算总价
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
    wx.showToast({ title: '去结算...', icon: 'none' });
  }
})