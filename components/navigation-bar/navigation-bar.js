Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    extClass: {
      type: String,
      value: ''
    },
    title: {
      type: String,
      value: ''
    },
    background: {
      type: String,
      value: ''
    },
    color: {
      type: String,
      value: ''
    },
    back: {
      type: Boolean,
      value: true
    },
    loading: {
      type: Boolean,
      value: false
    },
    homeButton: {
      type: Boolean,
      value: false,
    },
    animated: {
      // 显示隐藏的时候opacity动画效果
      type: Boolean,
      value: true
    },
    show: {
      // 显示隐藏导航，隐藏的时候navigation-bar的高度占位还在
      type: Boolean,
      value: true,
      observer: '_showChange'
    },
    // back为true的时候，返回的页面深度
    delta: {
      type: Number,
      value: 1
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    displayStyle: ''
  },
  lifetimes: {
    attached() {
      const rect = wx.getMenuButtonBoundingClientRect()
      const systemInfo = wx.getWindowInfo() || wx.getSystemInfoSync()
      
      const statusBarHeight = systemInfo.statusBarHeight
      const windowWidth = systemInfo.windowWidth
      
      // 胶囊按钮位置信息兜底（防止获取失败）
      const menuButtonTop = rect.top || (statusBarHeight + 4)
      const menuButtonHeight = rect.height || 32
      const menuButtonLeft = rect.left || (windowWidth - 97) // 假设胶囊宽87+右边距10

      // 核心公式：导航栏内容高度 = (胶囊顶部 - 状态栏高度) * 2 + 胶囊高度
      // 这样可以保证内容区域垂直居中于胶囊按钮
      let navBarHeight = (menuButtonTop - statusBarHeight) * 2 + menuButtonHeight
      
      // 异常兜底
      if (!navBarHeight || navBarHeight < 0) {
        navBarHeight = 44
      }

      // 计算左右对称的留白宽度：屏幕宽度 - 胶囊左边界
      // 这样左侧占位宽度 = 右侧胶囊+边距宽度，中间标题就能绝对居中
      const sideWidth = windowWidth - menuButtonLeft

      this.setData({
        innerPaddingRight: `padding-right: ${sideWidth}px`,
        leftWidth: `width: ${sideWidth}px`,
        // 强制设置高度和padding，覆盖CSS中的模糊计算
        safeAreaTop: `height: ${statusBarHeight + navBarHeight}px; padding-top: ${statusBarHeight}px`
      })
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    _showChange(show) {
      const animated = this.data.animated
      let displayStyle = ''
      if (animated) {
        displayStyle = `opacity: ${show ? '1' : '0'
          };transition:opacity 0.5s;`
      } else {
        displayStyle = `display: ${show ? '' : 'none'}`
      }
      this.setData({
        displayStyle
      })
    },
    back() {
      const data = this.data
      if (data.delta) {
        wx.navigateBack({
          delta: data.delta
        })
      }
      this.triggerEvent('back', { delta: data.delta }, {})
    }
  },
})
