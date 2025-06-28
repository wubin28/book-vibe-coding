#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
增强版Excel部门应收款分析工具
自动识别任意格式的部门名称，分析企业各部门间应收款项
支持调试模式，显示详细的数据识别过程
"""

import pandas as pd
import openpyxl
import sys
from pathlib import Path
import argparse


def analyze_receivables_enhanced(excel_file_path, debug=False):
    """
    增强版应收款分析函数，支持任意格式的部门名称
    
    Args:
        excel_file_path (str): Excel文件路径
        debug (bool): 是否显示调试信息
        
    Returns:
        list: 排序后的应收款数据
    """
    try:
        # 读取Excel文件
        df = pd.read_excel(excel_file_path, sheet_name=0)
        
        if debug:
            print("="*60)
            print("调试信息 - 数据结构分析")
            print("="*60)
            print(f"数据表形状: {df.shape}")
            print(f"列名: {list(df.columns)}")
            print("\n前5行数据:")
            print(df.head())
            print("\n数据类型:")
            print(df.dtypes)
        
        # 智能识别部门列表（从第3列开始，即索引2开始）
        departments = []
        excluded_keywords = [
            'unnamed', 'nan', 'none', '对账部门', '应收应付', 'sum', 'total', 
            '合计', '小计', '备注', 'remark', 'note', '序号', 'index'
        ]
        
        for i, col in enumerate(df.columns[2:], start=2):  # 从第3列开始
            if pd.notna(col):
                col_name = str(col).strip()
                col_lower = col_name.lower()
                
                # 排除明显的非部门列
                if (col_name and 
                    not col_name.isdigit() and 
                    not any(keyword in col_lower for keyword in excluded_keywords) and
                    len(col_name) > 0):
                    
                    # 检查该列是否有有效数据
                    col_data = df.iloc[:, i].dropna()
                    if len(col_data) > 0:
                        departments.append(col_name)
                        if debug:
                            print(f"列 {i} ('{col_name}') 被识别为部门，包含 {len(col_data)} 个非空值")
        
        print(f"识别到的部门: {departments}")
        
        # 智能识别第一列中的部门名称
        dept_names_in_rows = set()
        for index, row in df.iterrows():
            if pd.notna(row.iloc[0]):
                dept_name = str(row.iloc[0]).strip()
                dept_lower = dept_name.lower()
                
                # 排除标题行和明显的非部门名称
                if (dept_name and 
                    not any(keyword in dept_lower for keyword in excluded_keywords) and
                    dept_name != df.columns[0]):  # 排除列标题
                    dept_names_in_rows.add(dept_name)
        
        if debug:
            print(f"第一列中识别到的部门: {sorted(dept_names_in_rows)}")
        
        # 提取应收款数据
        receivable_data = []
        processed_rows = 0
        
        # 遍历每一行
        for index, row in df.iterrows():
            # 检查第一列是否为有效的部门名称
            if not pd.notna(row.iloc[0]):
                continue
                
            from_dept = str(row.iloc[0]).strip()
            if not from_dept or from_dept.lower() in [kw.lower() for kw in excluded_keywords]:
                continue
            
            # 检查第二列是否为"应收款"
            if not pd.notna(row.iloc[1]):
                continue
                
            type_field = str(row.iloc[1]).strip()
            if type_field not in ['应收款', '应收', 'receivable', 'Receivable']:
                continue
            
            processed_rows += 1
            if debug:
                print(f"\n处理第 {index+2} 行: {from_dept} - {type_field}")
                
            # 遍历所有部门列
            for dept in departments:
                if dept in row.index:
                    amount_value = row[dept]
                    if debug and pd.notna(amount_value):
                        print(f"  -> {dept}: {amount_value} (类型: {type(amount_value)})")
                    
                    # 检查金额是否有效
                    if pd.notna(amount_value):
                        try:
                            amount = float(amount_value)
                            if amount > 0:
                                receivable_data.append({
                                    'from_dept': from_dept,
                                    'to_dept': dept,
                                    'amount': amount
                                })
                                if debug:
                                    print(f"    ✓ 记录: {from_dept} -> {dept}: {amount}")
                        except (ValueError, TypeError):
                            if debug:
                                print(f"    ✗ 无法转换为数字: {amount_value}")
        
        if debug:
            print(f"\n处理了 {processed_rows} 行应收款数据")
            print(f"提取到 {len(receivable_data)} 条有效记录")
        
        return receivable_data
        
    except FileNotFoundError:
        print(f"错误: 找不到文件 {excel_file_path}")
        return []
    except Exception as e:
        print(f"读取Excel文件时发生错误: {e}")
        if debug:
            import traceback
            traceback.print_exc()
        return []


def display_top_receivables(receivable_data, top_n=3):
    """
    显示排名前N的应收款数据
    
    Args:
        receivable_data (list): 应收款数据列表
        top_n (int): 显示前N名，默认为3
    """
    if not receivable_data:
        print("没有找到有效的应收款数据")
        return
    
    # 按金额降序排序
    sorted_data = sorted(receivable_data, key=lambda x: x['amount'], reverse=True)
    
    print("\n" + "="*60)
    print("所有应收款数据:")
    print("="*60)
    for i, item in enumerate(sorted_data, 1):
        print(f"{i:2d}. {item['from_dept']}应收{item['to_dept']}：{item['amount']:.0f}元")
    
    print("\n" + "="*60)
    print(f"排名前{top_n}的应收款:")
    print("="*60)
    for i, item in enumerate(sorted_data[:top_n], 1):
        print(f"{i}. {item['from_dept']}应收{item['to_dept']}：{item['amount']:.0f}元")


def main():
    """主函数"""
    parser = argparse.ArgumentParser(description='Excel部门应收款分析工具')
    parser.add_argument('excel_file', help='Excel文件路径')
    parser.add_argument('-d', '--debug', action='store_true', help='启用调试模式')
    parser.add_argument('-n', '--top', type=int, default=3, help='显示前N名（默认3）')
    
    args = parser.parse_args()
    
    # 检查文件是否存在
    if not Path(args.excel_file).exists():
        print(f"错误: 文件 {args.excel_file} 不存在")
        sys.exit(1)
    
    print(f"正在分析文件: {args.excel_file}")
    if args.debug:
        print("调试模式已启用")
    
    # 分析应收款数据
    receivable_data = analyze_receivables_enhanced(args.excel_file, debug=args.debug)
    
    # 显示结果
    display_top_receivables(receivable_data, top_n=args.top)


if __name__ == "__main__":
    main()