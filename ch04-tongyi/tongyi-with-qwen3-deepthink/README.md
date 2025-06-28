# 运行指南 (macOS)

## 1. 安装Python
确保已安装Python 3。可以通过终端运行以下命令检查：
```bash
python3 --version
```
如果没有安装，从[Python官网](https://www.python.org/downloads/)下载并安装。

## 2. 创建虚拟环境
在项目目录下创建虚拟环境：
```bash
python3 -m venv venv
```

## 3. 激活虚拟环境
```bash
source venv/bin/activate
```

## 4. 安装依赖
安装所需的Python包：
```bash
pip install pandas openpyxl
```

## 5. 准备Excel文件
- 将Excel文件命名为 `对账表.xlsx`，并确保其与脚本文件在同一目录下。
- Excel文件必须包含名为 `Sheet1` 的工作表，且格式如下：
  ```
  | 对账部门 | 应收应付 | 部门01 | 部门02 | ... |
  ```

## 6. 运行脚本
```bash
python3 analyze_receivables.py <excel_file_path>
```

## 7. 注意事项
- 空白单元格、金额为0的记录和相同部门交叉数据（如 `部门01应收部门01`）将被忽略。
- 部门名称格式无需硬编码，代码会动态识别所有部门列。
- 如果部门名称格式变化（如 `智慧高速公路设计所`），只需确保Excel列名正确即可。
