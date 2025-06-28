# 部门对账表应收款数据分析工具

这是一个用于分析企业内部各部门申报的应收应付对账表中应收款数据的Python工具。该工具能够自动识别Excel表格中的部门名称，提取应收款数据，并按金额降序排列输出前三名的部门对。

## 功能特点

- 🔍 **智能部门识别**: 自动识别各种格式的部门名称（如"部门01"、"智慧高速公路设计所"等）
- 📊 **数据清洗**: 自动忽略空白单元格、无效数据和相同部门交叉处的数据
- 📈 **排序分析**: 按应收款金额降序排列，输出前三名部门对
- 🎯 **灵活适配**: 支持不同格式的部门名称和表格结构

## 系统要求

- macOS 10.14 或更高版本
- Python 3.8 或更高版本

## 安装指南（macOS）

### 1. 确认Python安装

首先检查系统是否已安装Python 3：

```bash
python3 --version
```

如果未安装Python 3，请访问 [Python官网](https://www.python.org/downloads/) 下载安装。

### 2. 克隆或下载项目

```bash
# 如果使用Git
git clone <项目地址>
cd <项目目录>/ch04

# 或直接下载项目文件到本地目录
```

### 3. 创建Python虚拟环境

```bash
# 创建虚拟环境
python3 -m venv receivable_env

# 激活虚拟环境
source receivable_env/bin/activate

# 确认虚拟环境已激活（命令行前缀会显示虚拟环境名称）
```

### 4. 安装依赖包

```bash
# 升级pip（可选但推荐）
pip install --upgrade pip

# 安装项目依赖
pip install -r requirements.txt
```

### 5. 验证安装

```bash
# 检查已安装的包
pip list
```

应该能看到以下包：
- pandas
- openpyxl
- numpy

## 使用方法

### 基本用法

```bash
# 确保虚拟环境已激活
source receivable_env/bin/activate

# 运行分析工具
python analyze_receivables.py <Excel文件路径>
```

### 示例

```bash
# 分析部门对账表
python analyze_receivables.py 部门对账表-脱敏-样例.xlsx

# 或使用相对路径
python analyze_receivables.py ./data/部门对账表-脱敏-样例.xlsx

# 或使用绝对路径
python analyze_receivables.py /Users/username/Documents/部门对账表-脱敏-样例.xlsx
```

### 输出示例

```
成功加载Excel文件: 部门对账表-脱敏-样例.xlsx
数据表形状: (8, 8)
识别到 8 个部门: ['部门01', '部门02', '部门03', '部门04', '部门05', '部门06', '部门07', '部门08']
提取到 25 条应收款记录
==================================================
应收款金额排行（前三名）
==================================================
1. 部门06应收部门07：83元
2. 部门05应收部门07：81元
3. 部门04应收部门07：79元
==================================================
```

## 文件结构

```
ch04/
├── analyze_receivables.py  # 主分析脚本
├── requirements.txt        # Python依赖包
├── README.md              # 使用说明（本文件）
└── receivable_env/        # Python虚拟环境目录（创建后）
```

## 常用命令

### 虚拟环境管理

```bash
# 激活虚拟环境
source receivable_env/bin/activate

# 退出虚拟环境
deactivate

# 删除虚拟环境（如需重新创建）
rm -rf receivable_env
```

### 包管理

```bash
# 查看已安装的包
pip list

# 查看包的详细信息
pip show pandas

# 更新包
pip install --upgrade pandas

# 卸载包
pip uninstall pandas
```

## 支持的数据格式

### Excel文件要求

- 文件格式：`.xlsx` 或 `.xls`
- 表格结构：矩阵格式，行和列都表示部门名称
- 数据类型：数值型（整数或浮点数）

### 部门名称格式

工具支持多种部门名称格式：

- 标准格式：`部门01`, `部门02`, `部门03`...
- 完整名称：`智慧高速公路设计所`, `财务管理中心`, `人力资源部`
- 简化名称：`设计所`, `财务部`, `人事科`

### 数据处理规则

1. **忽略空值**：空白单元格、NULL值、空字符串
2. **忽略零值**：金额为0的记录
3. **忽略负值**：应收款不应为负数
4. **忽略对角线**：相同部门间的数据（如部门01对部门01）
5. **数值清理**：自动提取字符串中的数值部分

## 故障排除

### 常见问题

1. **ImportError: No module named 'pandas'**
   ```bash
   # 确保虚拟环境已激活并安装依赖
   source receivable_env/bin/activate
   pip install -r requirements.txt
   ```

2. **FileNotFoundError: Excel文件未找到**
   ```bash
   # 检查文件路径是否正确
   ls -la 部门对账表-脱敏-样例.xlsx
   
   # 使用绝对路径
   python analyze_receivables.py /完整路径/部门对账表-脱敏-样例.xlsx
   ```

3. **Permission denied**
   ```bash
   # 确保Python脚本有执行权限
   chmod +x analyze_receivables.py
   ```

4. **Excel文件格式不支持**
   ```bash
   # 确保文件是有效的Excel格式
   file 部门对账表-脱敏-样例.xlsx
   ```

### 调试模式

如需查看详细的调试信息，可以修改脚本中的打印语句或使用Python调试器：

```bash
# 使用Python调试器运行
python -m pdb analyze_receivables.py 部门对账表-脱敏-样例.xlsx
```

## 版本信息

- 版本：1.0.0
- 更新日期：2024年
- Python版本要求：3.8+
- 操作系统：macOS 10.14+

## 技术支持

如遇到问题或需要技术支持，请提供以下信息：

1. macOS版本：`sw_vers`
2. Python版本：`python3 --version`
3. 错误信息的完整输出
4. Excel文件的基本结构描述

## 更新日志

### v1.0.0 (2024)
- 初始版本发布
- 支持基本的应收款数据分析
- 智能部门名称识别
- macOS系统适配 