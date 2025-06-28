// index.ts
// 获取应用实例
const app = getApp<IAppOption>()

Component({
  data: {
    inputPrompt: '', // 用户输入的原始提示词
    optimizedPrompt: '', // 优化后的提示词
    isOptimizing: false, // 优化中状态
    history: [], // 历史记录
  },

  methods: {
    // 处理用户输入
    onInputChange(e: any) {
      this.setData({
        inputPrompt: e.detail.value
      })
    },

    // 优化提示词
    async optimizePrompt() {
      const { inputPrompt, history } = this.data
      
      if (!inputPrompt || inputPrompt.trim() === '') {
        wx.showToast({
          title: '请输入提示词',
          icon: 'none'
        })
        return
      }

      // 设置加载状态
      this.setData({ isOptimizing: true })

      try {
        // 基础优化规则
        const baseRules = [
          '请为每个主要观点提供至少3个不同来源的出处网页链接以便我查验',
          '如你不知道或查不到请直说，不要编造',
          '请详细说明你的推理过程',
          '如果有多个可能的答案，请列出所有可能性并解释各自的依据'
        ]

        // 根据输入内容添加特定规则
        const specificRules = []
        
        // 如果是询问事实或数据
        if (inputPrompt.match(/数据|统计|比例|多少|何时|哪里/)) {
          specificRules.push('请提供具体的数据来源和统计时间')
          specificRules.push('如果数据有时效性，请说明数据的有效期')
        }

        // 如果是请求建议或观点
        if (inputPrompt.match(/建议|推荐|如何|怎么|应该/)) {
          specificRules.push('请说明建议的适用条件和限制')
          specificRules.push('如果建议涉及风险，请明确指出潜在风险')
        }

        // 如果涉及专业领域
        if (inputPrompt.match(/技术|科学|医疗|法律|金融/)) {
          specificRules.push('请说明这些信息仅供参考，不构成专业建议')
          specificRules.push('建议咨询相关领域的专业人士获取更准确的建议')
        }

        // 组合所有规则
        const allRules = [...baseRules, ...specificRules]
        
        // 构建优化后的提示词
        const optimized = `${inputPrompt.trim()}

=== 为确保回答的准确性和可靠性，请遵循以下要求 ===

${allRules.map((rule, index) => `${index + 1}. ${rule}`).join('\n')}`;

        // 更新状态
        this.setData({
          optimizedPrompt: optimized,
          isOptimizing: false,
          // 添加到历史记录
          history: [{
            original: inputPrompt,
            optimized: optimized,
            timestamp: new Date().toISOString()
          }, ...history.slice(0, 9)] // 只保留最近10条记录
        })

        // 保存历史记录到本地存储
        wx.setStorage({
          key: 'promptHistory',
          data: this.data.history
        })

        wx.showToast({
          title: '提示词已优化',
          icon: 'success'
        })
      } catch (error) {
        console.error('优化提示词失败:', error)
        this.setData({ isOptimizing: false })
        wx.showToast({
          title: '优化失败，请重试',
          icon: 'error'
        })
      }
    },

    // 复制优化后的提示词
    copyPrompt() {
      const { optimizedPrompt } = this.data
      
      if (!optimizedPrompt) {
        wx.showToast({
          title: '没有可复制的内容',
          icon: 'none'
        })
        return
      }

      wx.setClipboardData({
        data: optimizedPrompt,
        success: () => {
          wx.showToast({
            title: '已复制到剪贴板',
            icon: 'success'
          })
        }
      })
    },

    // 分享功能
    handleShare() {
      wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
      })
    },

    // 加载历史记录项
    loadHistoryItem(e: any) {
      const index = e.currentTarget.dataset.index
      const item = this.data.history[index]
      
      if (item) {
        this.setData({
          inputPrompt: item.original,
          optimizedPrompt: item.optimized
        })
        
        wx.showToast({
          title: '已加载历史记录',
          icon: 'success'
        })
      }
    },

    // 新优化功能（清空输入和结果）
    handleNew() {
      this.setData({
        inputPrompt: '',
        optimizedPrompt: ''
      })
      
      wx.showToast({
        title: '已清空',
        icon: 'success'
      })
    }
  },

  // 页面生命周期
  pageLifetimes: {
    show() {
      // 设置分享信息
      wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
      })

      // 加载历史记录
      wx.getStorage({
        key: 'promptHistory',
        success: (res) => {
          this.setData({ history: res.data })
        }
      })
    }
  },

  // 分享给朋友
  onShareAppMessage() {
    return {
      title: '减少AI幻觉 - 优化提示词，获取更准确的AI回答',
      path: '/pages/index/index'
    }
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '减少AI幻觉 - 优化提示词，获取更准确的AI回答'
    }
  }
})