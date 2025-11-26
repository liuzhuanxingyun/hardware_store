// pages/launch/launch.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image: '',
    animationData: {} // 1. 新增：用于存储动画数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 2. 新增：创建动画实例
    const animation = wx.createAnimation({
      duration: 1000, // 动画持续时间 1秒
      timingFunction: 'ease',
    })
    this.animation = animation

    // 初始化状态：向上偏移 50px 且透明，准备下滑
    animation.translateY(-50).opacity(0).step()
    this.setData({
      animationData: animation.export()
    })

    wx.request({
      url: 'http://127.0.0.1:8000/hardware_app/welcome/',
      method: 'GET',
      success: (res) => {
        console.log("后端返回结果：", res);

        if (res.statusCode === 200 && res.data.code === 100) {
          this.setData({
            image: res.data.result
          })

          // 3. 新增：执行下滑显现动画
          setTimeout(() => {
            animation.translateY(0).opacity(1).step()
            this.setData({
              animationData: animation.export()
            })
          }, 200)

          // 4. 新增：延迟 3 秒后跳转到首页 (使用 switchTab 因为 home 通常是 Tab 页)
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/home/home'
            })
          }, 3000)

        } else {
          // 修改这里：如果 msg 不存在，显示状态码，帮助定位是 404 还是 500
          let errorMsg = res.data.msg || `请求异常 (代码: ${res.statusCode})`;
          
          if (res.statusCode === 500) errorMsg = '服务器内部报错 (500)';
          if (res.statusCode === 404) errorMsg = '接口地址找不到 (404)';
          
          wx.showToast({
            title: errorMsg,
            icon: 'none',
            duration: 3000
          })

          // 即使出错，3秒后也跳转，避免卡死
          setTimeout(() => { wx.switchTab({ url: '/pages/home/home' }) }, 3000)
        }
      },
      fail: (err) => {
        console.log("网络连接失败：", err);
        wx.showToast({
          title: '无法连接服务器',
          icon: 'none'
        })
        // 即使失败，3秒后也跳转
        setTimeout(() => { wx.switchTab({ url: '/pages/home/home' }) }, 3000)
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