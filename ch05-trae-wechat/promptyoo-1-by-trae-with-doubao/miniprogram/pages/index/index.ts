// index.ts
// 获取应用实例
const app = getApp<IAppOption>

Component({
  data: {
    originalPrompt: '',
    optimizedPrompt: '',
  },
  methods: {
    // 输入框内容变化时触发
    onInputChange(e: any) {
      this.setData({
        originalPrompt: e.detail.value,
      })
    },

    // 生成优化提示词
    optimizePrompt() {
      const { originalPrompt } = this.data
      if (!originalPrompt.trim()) {
        wx.showToast({
          title: '请输入提示词',
          icon: 'none',
        })
        return
      }

      // 添加辅助提示
      const optimized = `${originalPrompt}\n\n请为每个主要观点提供至少3个不同来源的出处网页链接以便我查验\n如你不知道或查不到请直说，不要编造`

      this.setData({
        optimizedPrompt: optimized,
      })
    },

    // 清空所有内容
    clearAll() {
      this.setData({
        originalPrompt: '',
        optimizedPrompt: '',
      })
    },

    // 复制到剪贴板
    copyToClipboard() {
      const { optimizedPrompt } = this.data
      wx.setClipboardData({
        data: optimizedPrompt,
        success() {
          wx.showToast({
            title: '复制成功',
            icon: 'success',
          })
        },
      })
    },
  },
})
