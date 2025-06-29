# 《氛围编程：AI让编程像聊天一样简单》配套代码

## 项目目录结构

本项目包含《氛围编程：AI让编程像聊天一样简单》一书的所有配套代码和示例，按章节组织，便于读者学习和参考。

### 📁 核心目录说明

#### `listings/`
存放本书的所有代码清单文件，包含从第3章到第7章的代码示例：
- `L3-1.md` ~ `L3-3.md`: 第3章代码清单
- `L4-1.md` ~ `L4-2.md`: 第4章代码清单  
- `L5-1.md`: 第5章代码清单
- `L6-1.md` ~ `L6-7.md`: 第6章代码清单
- `L7-1.md` ~ `L7-9.md`: 第7章代码清单

### 📚 章节目录详解

#### `ch01/` - 第1章：颠覆传统的氛围编程
- `c4-model-diagrams/`: C4模型架构图表文件
  - 包含系统架构的可视化图表（SVG格式）

#### `ch02-coze/` - 第2章：用扣子实现“减少AI幻觉”智能体
- `prompts/`: 提示词工程相关文件
  - `prompt-reduce-ai-hallucinations.md`: 减少AI幻觉的提示词策略

#### `ch03-windsurf/` - 第3章 用Windsurf等5款工具可视化数据
包含AI工作数据集分析和可视化仪表板的多种实现：
- `ai_job_dataset.csv`: AI工作岗位数据集
- `claude/`: 使用Claude Sonnet 4生成的仪表板
- `cursor-with-claude/`: 使用Cursor + Claude 4 Sonnet的实现
- `deepseek/`: 使用DeepSeek R1的实现
- `trae-with-claude/`: 使用Trae + Claude 4 Sonnet的实现
- `trae-with-doubao/`: 使用Trae + 豆包的实现
- `windsurf-with-o3/`: 使用Windsurf + OpenAI O3的实现
- `prompts/`: 数据仪表板生成的提示词

#### `ch04-tongyi/` - 第4章 用Claude和通义等分析Excel数据
应收账款分析系统的多种AI实现：
- `claude-with-sonnet-4/`: Claude Sonnet 4实现版本
- `cursor-with-claude-4-sonnet/`: Cursor + Claude 4 Sonnet实现版本
- `deepseek-with-r1/`: DeepSeek R1实现版本
- `tongyi-with-qwen3-deepthink/`: 通义千问3深度思考模式实现版本
- `*.xlsx`: 示例数据文件（包含脱敏样例数据）

#### `ch05-trae-wechat/` - 第5章 用Trae实现微信小程序
微信小程序开发的多种AI生成版本：
- `promptyoo-1-by-copilot-with-codebuddy-with-hunyuan/`: Copilot + CodeBuddy + 混元实现
- `promptyoo-1-by-trae-with-claude-4-sonnet/`: Trae + Claude 4 Sonnet实现
- `promptyoo-1-by-trae-with-doubao/`: Trae + 豆包实现
- 每个版本都包含完整的微信小程序项目结构

#### `ch06-bolt-trae/` - 第6章 用bolt和Trae等4款工具快速实现Web产品原型
Next.js Web应用开发：
- `next-js-app/`: 完整的Next.js应用（包含API、组件、hooks等）
- `project-by-bolt-only/`: 仅使用Bolt生成的项目版本
- `c4-model-diagrams/`: 项目架构的C4模型图
- `wireframes/`: 项目原型图
- `prompts/`: Next.js应用生成的提示词
- `linear-issue-template.csv`: Linear项目管理模板

#### `ch07-copilot-feat/` - 第7章 用GitHub Copilot实现前后端分离Web应用
前后端分离的Web应用项目：
- `frontend/`: React + Vite前端应用
- `frontend-by-bolt-only/`: 仅使用Bolt生成的前端版本
- `backend/`: Node.js + TypeScript后端服务
- `c4-model-diagrams/`: 系统架构图
- `prompts/`: 各种开发提示词
- `rules/`: 架构规则文档
- `linear-issue-template.csv`: 项目管理模板

#### `ch08-cursor-e2e/` - 第8章 用Cursor保护代码逻辑不被破坏
完整的全栈应用与测试体系：
- `frontend/`: React前端应用
- `backend/`: Node.js后端服务
- `e2e-tests/`: 端到端测试套件
  - 包含Playwright测试配置和测试用例
  - 集成测试文档和结果报告
  - 测试数据和工具函数

### 📄 其他文件

- `LICENSE.txt`: 项目许可证
- `README.md`: 本说明文档

## 使用指南

1. **查找代码清单**: 直接访问 `listings/` 目录下对应的文件
2. **学习特定章节**: 进入对应的 `chXX-xxx/` 目录
3. **比较不同AI实现**: 各章节目录中包含多种AI工具的实现版本，便于对比学习
4. **运行示例代码**: 每个项目目录都包含相应的配置文件和说明文档

## 技术栈覆盖

本配套代码涵盖了以下技术栈和工具：
- **前端**: React, Next.js, 微信小程序, HTML/CSS/JavaScript
- **后端**: Node.js, TypeScript, Express
- **测试**: Playwright, 端到端测试
- **AI工具**: Claude, ChatGPT, DeepSeek, 通义千问, 豆包, GitHub Copilot
- **开发平台**: Cursor, Windsurf, Bolt, Trae, Coze

通过学习这些示例代码，读者可以深入理解如何在实际项目中有效使用各种AI编程工具。

