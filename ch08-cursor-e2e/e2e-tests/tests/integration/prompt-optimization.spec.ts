import { test, expect } from '../../utils/test-setup';
import { testData, waitForStreamingComplete } from '../../utils/test-setup';

test.describe('Prompt Optimization End-to-End Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // 导航到主页
    await page.goto('/');
    
    // 验证页面加载完成 - 使用更精确的选择器，定位到主内容区域的标题
    await expect(page.locator('main h1')).toContainText('Promptyoo');
    await expect(page.locator('button', { hasText: 'Optimize prompt' })).toBeVisible();
  });

  test('Happy Path: Successfully optimize prompt with valid data', async ({ page }) => {
    // 填写RABPOC表单 - 使用有效的测试数据
    await page.fill('input[placeholder*="Prompt Optimization Expert"]', testData.validPromptData.role);
    await page.fill('input[placeholder*="AI tool beginners"]', testData.validPromptData.audience);
    await page.fill('input[placeholder*="Prompt optimization"]', testData.validPromptData.boundary);
    await page.fill('input[placeholder*="find popular prompt optimization tools"]', testData.validPromptData.purpose);
    await page.fill('input[placeholder*="tool name (official website link)"]', testData.validPromptData.output);
    await page.fill('input[placeholder*="AI hallucinations"]', testData.validPromptData.concern);

    // 验证表单数据已填写
    await expect(page.locator('input[placeholder*="Prompt Optimization Expert"]')).toHaveValue(testData.validPromptData.role);
    await expect(page.locator('input[placeholder*="AI tool beginners"]')).toHaveValue(testData.validPromptData.audience);

    // 点击优化按钮
    await page.click('button:has-text("Optimize prompt")');

    // 验证按钮状态变为"Generating..."
    await expect(page.getByRole('button', { name: /Generating/ })).toBeVisible({ timeout: 5000 });

    // 等待流式响应完成（最多等待45秒，因为涉及真实的API调用）
    await waitForStreamingComplete(page, 45000);

    // 验证优化后的提示词区域
    const optimizedPromptArea = page.locator('pre').first();
    await expect(optimizedPromptArea).toBeVisible();
    
    // 验证提示词内容不是默认文本
    const promptText = await optimizedPromptArea.textContent();
    expect(promptText).not.toContain('Your optimized prompt will be displayed here');
    expect(promptText).not.toContain('Optimize your prompt now!');
    
    // 验证提示词包含我们输入的关键信息（不区分大小写）
    expect(promptText?.toLowerCase()).toContain('senior software engineer');
    expect(promptText?.toLowerCase()).toContain('junior developers');
    
    // 验证按钮恢复为正常状态
    await expect(page.getByRole('button', { name: 'Optimize prompt' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Generating/ })).not.toBeVisible();

    // 截图用于调试（仅在失败时）
    await page.screenshot({ path: 'test-results/happy-path-success.png', fullPage: true });
  });

  test('Happy Path: Optimize prompt with default values', async ({ page }) => {
    // 不填写任何字段，直接点击优化（应该使用默认值）
    await page.click('button:has-text("Optimize prompt")');

    // 验证加载状态
    await expect(page.getByRole('button', { name: /Generating/ })).toBeVisible({ timeout: 5000 });

    // 等待响应完成
    await waitForStreamingComplete(page, 45000);

    // 验证有输出结果
    const optimizedPromptArea = page.locator('pre').first();
    const promptText = await optimizedPromptArea.textContent();
    
    expect(promptText).not.toContain('Your optimized prompt will be displayed here');
    // 应该包含默认值（不区分大小写）
    expect(promptText?.toLowerCase()).toContain('prompt optimization');
    expect(promptText?.toLowerCase()).toContain('ai');
  });

  test('API Integration: Verify real DeepSeek API access (fails with invalid API key)', async ({ page }) => {
    // 🔥 这个测试专门验证真实的DeepSeek API集成
    // ⚠️  当API key无效时，此测试应该失败（不会使用fallback template）
    // ✅ 如果看到此测试失败，说明API配置有问题
    
    await page.fill('input[placeholder*="Prompt Optimization Expert"]', 'API Integration Tester');
    await page.fill('input[placeholder*="AI tool beginners"]', 'Test Users');
    await page.fill('input[placeholder*="Prompt optimization"]', 'API Testing');
    await page.fill('input[placeholder*="find popular prompt optimization tools"]', 'verify API connection');
    await page.fill('input[placeholder*="tool name (official website link)"]', 'detailed technical response');
    await page.fill('input[placeholder*="AI hallucinations"]', 'API authentication and connection issues');

    // 点击优化按钮
    await page.click('button:has-text("Optimize prompt")');

    // 验证加载状态
    await expect(page.getByRole('button', { name: /Generating/ })).toBeVisible({ timeout: 5000 });

    // 等待响应完成
    await waitForStreamingComplete(page, 45000);

    // 获取响应内容
    const optimizedPromptArea = page.locator('pre').first();
    const promptText = await optimizedPromptArea.textContent();
    
    console.log('API Integration Test - Response received:', promptText);

    // 核心验证：确保响应来自真实API，而不是fallback template
    // Fallback template的格式是: "I want you to act as a [role] for [audience] in the field of [boundary]..."
    expect(promptText).not.toMatch(/^I want you to act as a .+ for .+ in the field of .+\./);
    expect(promptText).not.toContain('I want you to act as a API Integration Tester');
    
    // 验证响应不是错误信息
    expect(promptText).not.toContain('Error:');
    expect(promptText).not.toContain('.env文件中的DEEPSEEK_API_KEY无效');
    expect(promptText).not.toContain('Failed to fetch');
    expect(promptText).not.toContain('NetworkError');
    expect(promptText).not.toContain('Load failed');
    
    // 验证响应具有真实API的特征
    // 真实的DeepSeek API响应通常：
    // 1. 长度较长（至少50个字符）
    // 2. 包含完整的句子结构
    // 3. 不是简单的模板格式
    expect(promptText?.length || 0).toBeGreaterThan(50);
    
    // 验证响应包含我们期望的内容元素（但不是模板格式）
    expect(promptText?.toLowerCase()).toContain('api');
    expect(promptText?.toLowerCase()).toContain('test');
    
    // 验证响应是自然语言文本，而不是结构化模板
    // 真实API会生成类似："Act as an API Integration Tester and help Test Users..."的自然文本
    const isNaturalLanguage = promptText?.includes('Act as') && 
                             !promptText?.match(/^I want you to act as a .+ for .+ in the field of .+\.$/);
    expect(isNaturalLanguage).toBeTruthy();

    // 截图用于调试
    await page.screenshot({ path: 'test-results/api-integration-success.png', fullPage: true });
  });

  test('Sad Path: Handle backend service unavailable', async ({ page }) => {
    // 模拟后端服务不可用 - 通过拦截API请求并返回错误
    await page.route('**/api/optimize', route => {
      route.abort('failed');
    });

    // 填写表单
    await page.fill('input[placeholder*="Prompt Optimization Expert"]', 'Test Engineer');
    await page.fill('input[placeholder*="AI tool beginners"]', 'Developers');

    // 点击优化按钮
    await page.click('button:has-text("Optimize prompt")');

    // 等待错误处理完成（网络请求被拦截，所以不会有Generating状态）
    await page.waitForTimeout(3000);

    // 验证错误信息显示
    const optimizedPromptArea = page.locator('pre').first();
    const promptText = await optimizedPromptArea.textContent();
    
    expect(promptText).toContain('Error:');
    // Different browsers return different error messages for network failures
    // Firefox: "NetworkError when attempting to fetch resource"
    // WebKit: "Load failed"
    // Chrome: "Failed to fetch"
    expect(
      promptText?.includes('Failed to fetch') || 
      promptText?.includes('NetworkError') || 
      promptText?.includes('Load failed') ||
      promptText?.includes('Network request failed')
    ).toBeTruthy();

    // 验证按钮恢复正常状态
    await expect(page.getByRole('button', { name: 'Optimize prompt' })).toBeVisible();

    // 截图用于调试
    await page.screenshot({ path: 'test-results/sad-path-backend-error.png', fullPage: true });
  });

  test('Sad Path: Handle invalid API key (simulated)', async ({ page }) => {
    // 模拟API返回认证错误
    await page.route('**/api/optimize', route => {
      const response = {
        status: 200,
        contentType: 'text/event-stream',
        body: 'data: {"error":".env文件中的DEEPSEEK_API_KEY无效","fallbackTemplate":"I want you to act as a Test Engineer for Developers in the field of Testing.\\nMy goal is to create automated tests and I need the response in the format of test cases.\\nI\'m concerned about test reliability."}\n\n'
      };
      route.fulfill(response);
    });

    // 填写表单
    await page.fill('input[placeholder*="Prompt Optimization Expert"]', 'Test Engineer');
    await page.fill('input[placeholder*="AI tool beginners"]', 'Developers');
    await page.fill('input[placeholder*="Prompt optimization"]', 'Testing');
    await page.fill('input[placeholder*="find popular prompt optimization tools"]', 'create automated tests');
    await page.fill('input[placeholder*="tool name (official website link)"]', 'test cases');
    await page.fill('input[placeholder*="AI hallucinations"]', 'test reliability');

    // 点击优化按钮
    await page.click('button:has-text("Optimize prompt")');

    // 等待响应处理
    await page.waitForTimeout(2000);

    // 验证显示了fallback template
    const optimizedPromptArea = page.locator('pre').first();
    const promptText = await optimizedPromptArea.textContent();
    
    // 应该显示fallback template（可能有错误信息前缀，也可能直接显示fallback）
    expect(promptText).toContain('I want you to act as a Test Engineer');
    expect(promptText).toContain('Testing');
    expect(promptText).toContain('test cases');

    // 截图用于调试
    await page.screenshot({ path: 'test-results/sad-path-api-key-error.png', fullPage: true });
  });

  test('Sad Path: Handle network timeout', async ({ page }) => {
    // 模拟网络超时
    await page.route('**/api/optimize', route => {
      // 延迟响应模拟超时
      setTimeout(() => {
        route.abort('timedout');
      }, 1000);
    });

    // 填写表单
    await page.fill('input[placeholder*="Prompt Optimization Expert"]', 'Network Test');

    // 点击优化按钮
    await page.click('button:has-text("Optimize prompt")');

    // 等待超时处理
    await page.waitForTimeout(5000);

    // 验证错误处理
    const optimizedPromptArea = page.locator('pre').first();
    const promptText = await optimizedPromptArea.textContent();
    
    expect(promptText).toContain('Error:');

    // 截图用于调试
    await page.screenshot({ path: 'test-results/sad-path-timeout.png', fullPage: true });
  });
}); 