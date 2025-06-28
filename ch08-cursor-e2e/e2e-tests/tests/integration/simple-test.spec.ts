import { test, expect, waitForStreamingComplete } from '../../utils/test-setup';

test.describe('Simple Functionality Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main h1')).toContainText('Promptyoo');
  });

  test('Basic UI Test: Page loads and form is visible', async ({ page }) => {
    // 验证主要UI元素存在
    await expect(page.getByRole('button', { name: 'Optimize prompt' })).toBeVisible();
    
    // 验证RABPOC表单字段存在
    await expect(page.locator('input[placeholder*="Prompt Optimization Expert"]')).toBeVisible();
    await expect(page.locator('input[placeholder*="AI tool beginners"]')).toBeVisible();
    await expect(page.locator('input[placeholder*="Prompt optimization"]')).toBeVisible();
    
    // 验证优化结果区域存在
    await expect(page.locator('pre')).toBeVisible();
    
    console.log('✅ All UI elements are visible');
  });

  test('Form Input Test: Can fill out RABPOC form', async ({ page }) => {
    // 填写表单
    await page.fill('input[placeholder*="Prompt Optimization Expert"]', 'Test Role');
    await page.fill('input[placeholder*="AI tool beginners"]', 'Test Audience');
    await page.fill('input[placeholder*="Prompt optimization"]', 'Test Boundary');
    
    // 验证输入值
    await expect(page.locator('input[placeholder*="Prompt Optimization Expert"]')).toHaveValue('Test Role');
    await expect(page.locator('input[placeholder*="AI tool beginners"]')).toHaveValue('Test Audience');
    await expect(page.locator('input[placeholder*="Prompt optimization"]')).toHaveValue('Test Boundary');
    
    console.log('✅ Form input functionality works');
  });

  test('Backend Connection Test: Submit form and check response', async ({ page }) => {
    // 填写最少的表单数据
    await page.fill('input[placeholder*="Prompt Optimization Expert"]', 'Simple Test');
    
    // 点击优化按钮
    await page.click('button:has-text("Optimize prompt")');
    
    // 等待流式响应完成
    await waitForStreamingComplete(page, 30000);
    
    // 检查结果区域的内容
    const resultArea = page.locator('pre').first();
    const resultText = await resultArea.textContent();
    
    console.log('Result text:', resultText);
    
    // 验证不是默认文本（说明有响应）
    expect(resultText).not.toContain('Your optimized prompt will be displayed here');
    
    console.log('✅ Backend connection works');
  });
}); 