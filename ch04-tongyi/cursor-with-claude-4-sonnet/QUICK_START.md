# 🚀 快速开始指南

## 5分钟快速上手

### 步骤1: 创建虚拟环境
```bash
python3 -m venv receivable_env
source receivable_env/bin/activate
```

### 步骤2: 安装依赖
```bash
pip install -r requirements.txt
```

### 步骤3: 运行分析
```bash
python3 analyze_receivables.py ../部门对账表-脱敏-样例.xlsx
```

### 期望输出
```
==================================================
应收款金额排行（前三名）
==================================================
1. 部门06应收部门07：83元
2. 部门05应收部门07：81元
3. 部门04应收部门07：79元
==================================================
```

## 功能演示

运行演示脚本查看不同格式部门名称的支持：

```bash
python demo_flexible_departments.py
```

## 支持的部门名称格式

✅ **标准格式**: 部门01, 部门02, 部门03...
✅ **完整名称**: 智慧高速公路设计所, 财务管理中心, 人力资源部
✅ **简化名称**: 设计所, 财务部, 人事科

## 常用命令

```bash
# 激活环境
source receivable_env/bin/activate

# 分析数据
python analyze_receivables.py <Excel文件路径>

# 退出环境
deactivate
``` 