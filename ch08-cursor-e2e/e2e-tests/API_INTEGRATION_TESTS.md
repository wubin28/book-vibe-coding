# API Integration Tests

## 🎯 Overview

This document explains the special API integration test that verifies real DeepSeek API connectivity.

## 🔥 Critical Test: "API Integration: Verify real DeepSeek API access"

### Purpose
This test is specifically designed to **fail when the DeepSeek API key is invalid or missing**, ensuring that we can detect API configuration issues.

### How It Works

#### ✅ With Valid API Key
- Backend makes real API call to DeepSeek
- DeepSeek returns AI-generated content
- Test verifies response is from real API (not fallback template)
- **Test PASSES**

#### ❌ With Invalid API Key  
- Backend attempts API call to DeepSeek
- DeepSeek returns 401 Authentication Error
- Backend generates fallback template instead
- Test detects fallback template format
- **Test FAILS** (as intended)

### Test Logic

```typescript
// Detects fallback template format
expect(promptText).not.toMatch(/^I want you to act as a .+ for .+ in the field of .+\./);

// Ensures no error messages
expect(promptText).not.toContain('Error:');
expect(promptText).not.toContain('.env文件中的DEEPSEEK_API_KEY无效');

// Verifies response characteristics of real API
expect(promptText?.length || 0).toBeGreaterThan(50);
```

## 🚨 When This Test Fails

If you see this test failing, it indicates:

1. **Invalid API Key**: The DEEPSEEK_API_KEY in backend/.env is wrong
2. **Missing API Key**: No DEEPSEEK_API_KEY configured
3. **API Service Down**: DeepSeek service is temporarily unavailable
4. **Network Issues**: Cannot reach DeepSeek API endpoints

## 🔧 How to Fix

### 1. Check API Key
```bash
# Verify your .env file
cat backend/.env
```

### 2. Test API Key Manually
```bash
# Test with curl (replace YOUR_API_KEY)
curl -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     https://api.deepseek.com/v1/models
```

### 3. Update Configuration
```bash
# Edit backend/.env
DEEPSEEK_API_KEY=your_actual_api_key_here
```

## 📊 Test Categories

| Test Type | API Key Status | Expected Result |
|-----------|----------------|-----------------|
| **Other Happy/Sad Path Tests** | Invalid | ✅ PASS (uses fallback) |
| **API Integration Test** | Invalid | ❌ FAIL (detects invalid key) |
| **API Integration Test** | Valid | ✅ PASS (real API works) |

## 🎯 Why This Matters

- **Production Readiness**: Ensures API is properly configured before deployment
- **Real Integration**: Validates actual external service connectivity  
- **Configuration Validation**: Catches environment variable mistakes
- **Service Health**: Detects when external dependencies are down

## 🚀 Running the Test

```bash
# Run only the API integration test
npx playwright test --grep "API Integration: Verify real DeepSeek API access"

# Run all tests (this one will fail with invalid API key)
npm test
```

---

**Remember**: This test is supposed to fail when your API key is wrong. That's a feature, not a bug! 🎯 