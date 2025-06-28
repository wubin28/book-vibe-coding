import { test as base } from '@playwright/test';

// 扩展测试上下文，添加通用的测试工具
export const test = base.extend({
  // 可以在这里添加自定义fixtures
});

export { expect } from '@playwright/test';

// 测试数据
export const testData = {
  validPromptData: {
    role: "Senior Software Engineer",
    audience: "Junior developers",
    boundary: "React application development",
    purpose: "create a reusable component library",
    output: "Step-by-step guide with code examples",
    concern: "Performance optimization and accessibility"
  },
  
  emptyPromptData: {
    role: "",
    audience: "",
    boundary: "",
    purpose: "",
    output: "",
    concern: ""
  }
};

// 辅助函数：等待流式响应完成
export async function waitForStreamingComplete(page: any, timeout = 30000) {
  // 等待"Generating..."按钮消失，表示流式响应完成
  await page.waitForFunction(
    () => !Array.from(document.querySelectorAll('button')).some(btn => btn.textContent?.includes('Generating...')),
    { timeout }
  );
} 