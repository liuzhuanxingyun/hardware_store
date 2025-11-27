// app.js
App({
  globalData: {
    userInfo: null,
    openid: null, // 存储 openid
    categoryIndex: 0
  },

  onLaunch() {
    // 登录
    wx.login({
      success: res => {
        if (res.code) {
          // 发送 res.code 到后台换取 openId
          wx.request({
            url: 'http://127.0.0.1:8000/hardware_app/user/login/',
            method: 'POST',
            data: {
              code: res.code
            },
            success: (response) => {
              if (response.data.code === 200) {
                const openid = response.data.result.openid;
                this.globalData.openid = openid;
                // 存入本地缓存，方便其他页面调用
                wx.setStorageSync('openid', openid);
                console.log('登录成功，OpenID:', openid);
              }
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })

    // 请求后端获取 TabBar 配置
    wx.request({
      url: 'http://127.0.0.1:8000/hardware_app/tabbar/list/', 
      success: (res) => {
        if (res.data.code === 200) {
          const list = res.data.result;
          // 修正路径：后端返回的 pagePath 必须以 / 开头，或者与 app.json 匹配
          // 这里假设后端返回的是 "pages/home/home" 这种格式，我们需要确保它能匹配
          
          // 将配置存入缓存
          wx.setStorageSync('tabBarList', list);
          
          // 如果当前页面已经加载了 custom-tab-bar，尝试更新它（可选）
        }
      }
    });
  }
})
