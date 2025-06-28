// index.ts
// 获取应用实例
const app = getApp<IAppOption>()

Component({
  data: {
    userPrompt: '', // 用户输入的初始提示词
    optimizedPrompt: '', // 优化后的提示词
    canSubmit: false, // 是否可以提交
  },
  methods: {
    // 处理用户输入
    onPromptInput(e: any) {
      const value = e.detail.value
      this.setData({
        userPrompt: value,
        canSubmit: value.trim().length > 0
      })
    },

    // 优化提示词
    onOptimizePrompt() {
      const { userPrompt } = this.data
      if (!userPrompt.trim()) {
        wx.showToast({
          title: '请输入提示词',
          icon: 'none'
        })
        return
      }

      // 添加减幻提示词：在开头添加"你是专家"，然后是用户输入的提示词，最后添加辅助提示
      const optimizedPrompt = `你是专家\n\n${userPrompt.trim()}\n\n请为每个主要观点提供至少3个不同来源的出处网页链接以便我查验。\n\n如你不知道或查不到请直说，不要编造。`
      
      this.setData({
        optimizedPrompt
      })

      wx.showToast({
        title: '优化完成',
        icon: 'success'
      })
    },

    // 复制优化后的提示词
    onCopyPrompt() {
      const { optimizedPrompt } = this.data
      wx.setClipboardData({
        data: optimizedPrompt,
        success: () => {
          wx.showToast({
            title: '复制成功',
            icon: 'success'
          })
        },
        fail: () => {
          wx.showToast({
            title: '复制失败',
            icon: 'none'
          })
        }
      })
    },

    // 新优化 - 清空内容
    onNewOptimize() {
      this.setData({
        userPrompt: '',
        optimizedPrompt: ''
      })
      wx.showToast({
        title: '已清空',
        icon: 'success'
      })
    },

    // 分享功能
    onShare() {
      return {
        title: '减少AI幻觉 - 让AI回复更准确可靠',
        path: '/pages/index/index',
        imageUrl: '' // 可以设置分享图片
      }
    }
  },

  // 页面分享配置
  onShareAppMessage() {
    return {
      title: '减少AI幻觉 - 让AI回复更准确可靠',
      path: '/pages/index/index'
    }
  }
})
