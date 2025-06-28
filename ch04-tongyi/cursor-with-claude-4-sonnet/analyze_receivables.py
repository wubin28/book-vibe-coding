#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
部门对账表应收款数据分析工具
分析企业内部各部门申报的应收应付对账表中的应收款数据
"""

import pandas as pd
import numpy as np
from pathlib import Path
import sys
import re
from typing import List, Tuple, Optional, Dict


class ReceivablesAnalyzer:
    """应收款数据分析器"""
    
    def __init__(self, excel_file_path: str):
        """
        初始化分析器
        
        Args:
            excel_file_path: Excel文件路径
        """
        self.excel_file_path = Path(excel_file_path)
        self.df = None
        self.department_names = []
        
    def load_excel_data(self) -> bool:
        """
        加载Excel数据
        
        Returns:
            bool: 是否加载成功
        """
        try:
            # 尝试读取Excel文件的第一个工作表
            self.df = pd.read_excel(self.excel_file_path, sheet_name=0, header=0, index_col=0)
            print(f"成功加载Excel文件: {self.excel_file_path}")
            print(f"数据表形状: {self.df.shape}")
            
            # 显示表格的前几行和前几列，帮助理解数据结构
            print("\n数据表预览:")
            print("列名:", list(self.df.columns)[:5])  # 显示前5列
            print("行索引:", list(self.df.index)[:5])   # 显示前5行
            
            return True
        except FileNotFoundError:
            print(f"错误: 找不到文件 {self.excel_file_path}")
            return False
        except Exception as e:
            print(f"错误: 加载Excel文件失败 - {str(e)}")
            return False
    
    def extract_department_names(self) -> List[str]:
        """
        提取部门名称
        
        Returns:
            List[str]: 部门名称列表
        """
        if self.df is None:
            return []
        
        # 从行索引和列名中提取部门名称
        row_departments = [str(idx) for idx in self.df.index if pd.notna(idx) and str(idx).strip()]
        col_departments = [str(col) for col in self.df.columns if pd.notna(col) and str(col).strip()]
        
        # 合并并去重
        all_departments = list(set(row_departments + col_departments))
        
        # 过滤掉明显不是部门名称的项目
        department_pattern = re.compile(r'部门|所|处|科|室|中心|部|司')
        valid_departments = []
        
        # 排除的非部门关键词
        exclude_keywords = ['应收', '应付', '合计', '总计', '小计', '汇总', 'nan', 'NaN']
        
        for dept in all_departments:
            dept_clean = dept.strip()
            
            # 跳过空字符串和明显的非部门名称
            if not dept_clean or any(keyword in dept_clean for keyword in exclude_keywords):
                continue
            
            # 如果包含部门相关关键词，或者是"部门XX"格式，则认为是有效部门名称
            if (department_pattern.search(dept_clean) or 
                re.match(r'部门\d+', dept_clean) or
                (len(dept_clean) > 1 and not dept_clean.isdigit())):
                valid_departments.append(dept_clean)
        
        self.department_names = sorted(valid_departments)
        print(f"识别到 {len(self.department_names)} 个部门: {self.department_names}")
        return self.department_names
    
    def extract_receivables_data(self) -> List[Tuple[str, str, float]]:
        """
        提取应收款数据
        
        Returns:
            List[Tuple[str, str, float]]: (债权部门, 债务部门, 金额) 的列表
        """
        if self.df is None:
            return []
        
        receivables_data = []
        # 用于去重的字典 {(债权部门, 债务部门): 金额}
        receivables_dict: Dict[Tuple[str, str], float] = {}
        
        # 遍历数据表的每个单元格
        for row_idx, row_name in enumerate(self.df.index):
            # 检查是否有"应收应付"标识列
            receivable_payable_indicator = None
            if '应收应付' in self.df.columns:
                receivable_payable_indicator = self.df.iloc[row_idx]['应收应付']
            
            # 只处理应收款行，跳过应付款行
            if (receivable_payable_indicator is not None and 
                pd.notna(receivable_payable_indicator) and 
                '应付' in str(receivable_payable_indicator)):
                continue
            
            for col_idx, col_name in enumerate(self.df.columns):
                try:
                    # 跳过"应收应付"标识列
                    if col_name == '应收应付':
                        continue
                    
                    # 获取单元格值
                    cell_value = self.df.iloc[row_idx, col_idx]
                    
                    # 跳过空值、NaN值和非数值
                    if pd.isna(cell_value) or cell_value == '' or cell_value == 0:
                        continue
                    
                    # 尝试转换为数值
                    if isinstance(cell_value, (int, float)):
                        amount = float(cell_value)
                    elif isinstance(cell_value, str):
                        # 清理字符串中的非数字字符
                        cleaned_value = re.sub(r'[^\d.-]', '', cell_value)
                        if cleaned_value:
                            amount = float(cleaned_value)
                        else:
                            continue
                    else:
                        continue
                    
                    # 跳过金额为0或负数的记录（应收款应该为正数）
                    if amount <= 0:
                        continue
                    
                    # 获取部门名称
                    creditor_dept = str(row_name).strip()
                    debtor_dept = str(col_name).strip()
                    
                    # 跳过相同部门的交叉处（对角线）
                    if creditor_dept == debtor_dept:
                        continue
                    
                    # 跳过非部门名称
                    exclude_keywords = ['应收', '应付', '合计', '总计', '小计', '汇总', 'nan', 'NaN']
                    if (any(keyword in creditor_dept for keyword in exclude_keywords) or
                        any(keyword in debtor_dept for keyword in exclude_keywords)):
                        continue
                    
                    # 确保是有效的部门名称
                    if (creditor_dept in self.department_names and 
                        debtor_dept in self.department_names):
                        
                        # 记录应收款数据
                        dept_pair = (creditor_dept, debtor_dept)
                        if dept_pair not in receivables_dict:
                            receivables_dict[dept_pair] = amount
                    
                except (ValueError, TypeError) as e:
                    # 跳过无法转换的数据
                    continue
        
        # 将字典转换为列表
        receivables_data = [(creditor, debtor, amount) 
                           for (creditor, debtor), amount in receivables_dict.items()]
        
        print(f"提取到 {len(receivables_data)} 条应收款记录")
        return receivables_data
    
    def get_top_receivables(self, receivables_data: List[Tuple[str, str, float]], top_n: int = 3) -> List[Tuple[str, str, float]]:
        """
        获取应收款金额最高的前N个部门对
        
        Args:
            receivables_data: 应收款数据列表
            top_n: 返回前N个结果
            
        Returns:
            List[Tuple[str, str, float]]: 按金额降序排列的前N个部门对
        """
        if not receivables_data:
            return []
        
        # 按金额降序排序
        sorted_data = sorted(receivables_data, key=lambda x: x[2], reverse=True)
        
        return sorted_data[:top_n]
    
    def format_results(self, top_receivables: List[Tuple[str, str, float]]) -> str:
        """
        格式化输出结果
        
        Args:
            top_receivables: 前N个应收款记录
            
        Returns:
            str: 格式化的结果字符串
        """
        if not top_receivables:
            return "未找到有效的应收款数据"
        
        result_lines = []
        result_lines.append("=" * 50)
        result_lines.append("应收款金额排行（前三名）")
        result_lines.append("=" * 50)
        
        for idx, (creditor, debtor, amount) in enumerate(top_receivables, 1):
            # 格式化金额，保留整数部分
            amount_str = f"{int(amount)}" if amount == int(amount) else f"{amount:.2f}"
            result_lines.append(f"{idx}. {creditor}应收{debtor}：{amount_str}元")
        
        result_lines.append("=" * 50)
        return "\n".join(result_lines)
    
    def analyze(self) -> str:
        """
        执行完整的分析流程
        
        Returns:
            str: 分析结果
        """
        # 1. 加载数据
        if not self.load_excel_data():
            return "数据加载失败"
        
        # 2. 提取部门名称
        self.extract_department_names()
        
        # 3. 提取应收款数据
        receivables_data = self.extract_receivables_data()
        
        if not receivables_data:
            return "未找到有效的应收款数据"
        
        # 4. 获取前三名
        top_receivables = self.get_top_receivables(receivables_data, top_n=3)
        
        # 5. 格式化输出
        return self.format_results(top_receivables)


def main():
    """主函数"""
    # 检查命令行参数
    if len(sys.argv) != 2:
        print("使用方法: python analyze_receivables.py <Excel文件路径>")
        print("示例: python analyze_receivables.py 部门对账表-脱敏-样例.xlsx")
        sys.exit(1)
    
    excel_file_path = sys.argv[1]
    
    # 创建分析器并执行分析
    analyzer = ReceivablesAnalyzer(excel_file_path)
    result = analyzer.analyze()
    
    print(result)


if __name__ == "__main__":
    main() 