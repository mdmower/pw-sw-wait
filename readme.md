## Playwright serviceworker event not firing

This is a minimal reproduction of an issue with Playwright failing to fire the `serviceworker` event after a chrome extension is installed. See issue https://github.com/microsoft/playwright/issues/33682.

Testing instructions:

```sh
# This installs @playwright/test v1.49.0
npm install
npx playwright install
npm run test
# Test fails with the output below

# Now try an older version of playwright
npm install --save-dev @playwright/test@1.48.2
npx playwright install
npm run test
# Test succeeds
```

When test fails, this is the output:

```
> test
> playwright test


Running 1 test using 1 worker
  1) [chromium] › bubble.spec.js:8:3 › Bubble › bubble contents ────────────────────────────────────

    Test timeout of 30000ms exceeded while running "beforeEach" hook.

      2 |
      3 | test.describe("Bubble", () => {
    > 4 |   test.beforeEach(async ({ page, extension }) => {
        |        ^
      5 |     await page.goto(extension.bubbleUrl);
      6 |   });
      7 |
        at /home/mdmower/source/pw-sw-wait/bubble.spec.js:4:8

    Error: browserContext.waitForEvent: Target page, context or browser has been closed

       at pw-fixtures.js:28

      26 |     let [worker] = context.serviceWorkers();
      27 |     if (!worker) {
    > 28 |       worker = await context.waitForEvent("serviceworker");
         |                              ^
      29 |     }
      30 |
      31 |     // Wait for the service worker state to be 'activated'
        at Object.serviceWorker (/home/mdmower/source/pw-sw-wait/pw-fixtures.js:28:30)

  Slow test file: [chromium] › bubble.spec.js (30.1s)
  Consider splitting slow test files to speed up parallel execution
  1 failed
    [chromium] › bubble.spec.js:8:3 › Bubble › bubble contents ─────────────────────────────────────
```
