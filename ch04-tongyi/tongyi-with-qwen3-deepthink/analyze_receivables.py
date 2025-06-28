import pandas as pd
import sys

def analyze_receivables(excel_file):
    # 读取Excel文件
    df = pd.read_excel(excel_file, sheet_name='Sheet1')
    
    # 筛选“应收款”数据
    receivables = df[df['应收应付'] == '应收款']
    
    results = []
    
    # 遍历每行数据
    for _, row in receivables.iterrows():
        source_dept = row['对账部门']  # 当前对账部门
        for dept_col in df.columns[2:]:  # 动态获取部门列
            amount = row[dept_col]
            target_dept = dept_col  # 目标部门
            # 忽略空白单元格、金额为0的情况和相同部门交叉数据
            if pd.notna(amount) and amount != 0 and source_dept != target_dept:
                results.append({
                    'source': source_dept,
                    'target': target_dept,
                    'amount': amount
                })
    
    # 按金额降序排序
    sorted_results = sorted(results, key=lambda x: x['amount'], reverse=True)
    
    # 输出前三名
    for i, res in enumerate(sorted_results[:3], 1):
        print(f"{i}. {res['source']}应收{res['target']}：{int(res['amount'])}元")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("使用方法: python3 analyze_receivables.py <Excel文件路径>")
        sys.exit(1)
    
    excel_file = sys.argv[1]
    analyze_receivables(excel_file)