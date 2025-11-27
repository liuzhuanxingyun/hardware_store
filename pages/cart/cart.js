// pages/cart/cart.js
Page({
  data: {
    cartList: [],
    allSelected: false,
    totalPrice: '0.00'
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 })
    }
    this.getCartList();
  },

  // 获取购物车列表
  getCartList() {
    // 修改处：优先从缓存获取 openid
    const userId = wx.getStorageSync('openid') || 'test_user'; 
    
    wx.request({
      url: 'http://127.0.0.1:8000/hardware_app/cart/list/',
      data: { user_id: userId },
      success: (res) => {
        if (res.data.code === 200) {
          this.setData({
            cartList: res.data.result
          });
          this.checkAllSelected();
          this.calculateTotal();
        }
      }
    });
  },

  // 切换单个商品选中状态
  toggleSelect(e) {
    const index = e.currentTarget.dataset.index;
    const item = this.data.cartList[index];
    const newSelected = !item.selected;
    
    // 乐观更新
    const key = `cartList[${index}].selected`;
    this.setData({ [key]: newSelected });
    
    this.checkAllSelected();
    this.calculateTotal();

    // 同步后端
    this.updateCartItem(item.id, { selected: newSelected });
  },

  // 全选/取消全选
  toggleAllSelect() {
    const newAllSelected = !this.data.allSelected;
    const list = this.data.cartList.map(item => {
      // 同步后端状态（实际项目中可能需要批量更新接口，这里简化为循环调用或只更新前端显示，结算时再校验）
      if (item.selected !== newAllSelected) {
        this.updateCartItem(item.id, { selected: newAllSelected });
      }
      return { ...item, selected: newAllSelected };
    });

    this.setData({
      cartList: list,
      allSelected: newAllSelected
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

  // 计算总价
  calculateTotal() {
    let total = 0;
    this.data.cartList.forEach(item => {
      if (item.selected) {
        total += item.price * item.num;
      }
    });
    this.setData({
      totalPrice: total.toFixed(3)
    });
  },

  // 更新数量
  updateQuantity(e) {
    const index = e.currentTarget.dataset.index;
    const type = e.currentTarget.dataset.type;
    const item = this.data.cartList[index];
    let num = item.num;

    if (type === 'minus' && num > 1) {
      num--;
    } else if (type === 'plus') {
      num++;
    } else {
      return;
    }

    const key = `cartList[${index}].num`;
    this.setData({ [key]: num });
    this.calculateTotal();

    this.updateCartItem(item.id, { count: num });
  },

  // 封装更新请求
  updateCartItem(cartId, data) {
    wx.request({
      url: 'http://127.0.0.1:8000/hardware_app/cart/update/',
      method: 'POST',
      data: { cart_id: cartId, ...data }
    });
  },

  // 删除商品
  onDeleteItem(e) {
    const index = e.currentTarget.dataset.index;
    const item = this.data.cartList[index];

    wx.showModal({
      title: '提示',
      content: '确定要删除这个商品吗？',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: 'http://127.0.0.1:8000/hardware_app/cart/delete/',
            method: 'POST',
            data: { cart_id: item.id },
            success: (res) => {
              if (res.data.code === 200) {
                const list = this.data.cartList;
                list.splice(index, 1);
                this.setData({ cartList: list });
                this.checkAllSelected();
                this.calculateTotal();
                wx.showToast({ title: '已删除', icon: 'none' });
              }
            }
          });
        }
      }
    });
  },

  // 点击商品跳转详情
  onGoodsTap(e) {
    const index = e.currentTarget.dataset.index;
    const item = this.data.cartList[index];
    wx.navigateTo({
      url: `/pages/goods_detail/goods_detail?id=${item.goods_id}`
    });
  },

  // 去结算
  onCheckout() {
    const selectedItems = this.data.cartList.filter(item => item.selected);
    if (selectedItems.length === 0) {
      wx.showToast({
        title: '请选择商品',
        icon: 'none'
      });
      return;
    }

    // 将选中的商品信息存储到本地
    wx.setStorageSync('checkoutItems', selectedItems);
    
    // 跳转到确认订单页面
    wx.navigateTo({
      url: '/pages/order_confirm/order_confirm'
    });
  }
})