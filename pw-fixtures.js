import { test as base, chromium } from "@playwright/test";
import { fileURLToPath } from "node:url";

export const test = base.extend({
  context: async ({}, use) => {
    const pathToExtension = fileURLToPath(import.meta.resolve("."));
    const context = await chromium.launchPersistentContext("", {
      args: [
        "--headless=new",
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    });

    await use(context);
    await context.close();
  },
  serviceWorker: async ({ context }, use) => {
    let [worker] = context.serviceWorkers();
    if (!worker) {
      worker = await context.waitForEvent("serviceworker");
    }

    // Wait for the service worker state to be 'activated'
    for (let i = 0; i < 5; i++) {
      const ready = await worker.evaluate(
        () =>
          typeof chrome !== "undefined" &&
          !!chrome.runtime &&
          self instanceof ServiceWorkerGlobalScope &&
          self.serviceWorker.state === "activated"
      );
      if (!ready) {
        await new Promise((resolve) => setTimeout(resolve, 25));
      } else {
        break;
      }
    }

    await use(worker);
  },
  extension: async ({ serviceWorker }, use) => {
    const id = serviceWorker.url().split("/")[2];
    const bubbleUrl = await serviceWorker.evaluate(() =>
      chrome.runtime.getURL("bubble.html")
    );
    await use({ id, bubbleUrl });
  },
});

export const expect = test.expect;
