# End-to-End Tests for Promptyoo

This directory contains comprehensive end-to-end tests for the Promptyoo application using Playwright.

## Prerequisites

1. **Backend Environment**: Ensure `../backend/.env` file exists with valid `DEEPSEEK_API_KEY`
2. **Node.js**: Version 18 or higher
3. **Dependencies**: Both frontend and backend dependencies should be installed

## Setup

```bash
# Install test dependencies
npm install

# Install browsers for Playwright
npx playwright install
```

## Test Structure

- `tests/integration/` - Complete end-to-end integration tests
- `utils/` - Test utilities and helpers
- `fixtures/` - Test data and mock responses
- `test-results/` - Screenshots and videos (auto-generated)

## Test Cases

### Happy Path Tests
- **Valid Data Flow**: Tests complete user journey with valid RABPOC inputs
- **Default Values**: Tests optimization using default placeholder values
- 🔥 **API Integration**: **Verifies real DeepSeek API access** (fails with invalid API key)

### Sad Path Tests  
- **Backend Unavailable**: Tests error handling when backend service is down
- **Invalid API Key**: Tests fallback template when DeepSeek API key is invalid
- **Network Timeout**: Tests timeout handling for slow network conditions

## 🚨 Important: API Integration Test

The **"API Integration: Verify real DeepSeek API access"** test is designed to **fail when your API key is invalid**. This is intentional behavior:

- ❌ **Test fails** = Invalid/missing API key (configuration issue)
- ✅ **Test passes** = Valid API key and real API connectivity

See [API_INTEGRATION_TESTS.md](./API_INTEGRATION_TESTS.md) for detailed explanation.

## Running Tests

### Basic Commands

```bash
# Run all tests (headless)
npm test

# Run tests with browser UI visible
npm run test:headed

# Run tests in interactive UI mode
npm run test:ui

# Run with debugging
npm run test:debug
```

### Advanced Usage

```bash
# Run specific test file
npx playwright test prompt-optimization.spec.ts

# Run only happy path tests
npx playwright test --grep "Happy Path"

# Run only sad path tests  
npx playwright test --grep "Sad Path"

# Generate test report
npm run test:report
```

## Environment Variables

The tests automatically handle service startup, but you can customize:

- `CI=true` - Enables CI mode (no browser reuse, more retries)
- `PLAYWRIGHT_HTML_REPORT` - Custom report output directory

## Troubleshooting

### Common Issues

1. **Backend .env missing**: Ensure `../backend/.env` exists with `DEEPSEEK_API_KEY`
2. **Port conflicts**: Tests use ports 3000 (backend) and 5173 (frontend)
3. **Timeout errors**: Increase timeout in playwright.config.ts if needed

### Debug Information

- Screenshots: `test-results/` directory
- Videos: Available for failed tests
- Traces: Use `npx playwright show-trace <trace-file>`

## CI/CD Integration

The tests are designed to run in CI environments:

```yaml
# Example GitHub Actions step
- name: Run E2E Tests
  run: |
    cd e2e-tests
    npm install
    npx playwright install --with-deps
    npm test
``` 