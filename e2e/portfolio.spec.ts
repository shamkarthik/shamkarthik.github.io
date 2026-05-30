import { test, expect } from "@playwright/test"

const BASE = "/vite-project/"

test.describe("Portfolio E2E", () => {
  test("Home page loads with Hero", async ({ page }) => {
    await page.goto(BASE)
    await expect(page.locator("h1")).toContainText("Sham")
    await expect(page.getByText("Senior AI/ML Engineer @ Tiger Analytics")).toBeVisible()
    await expect(page.getByRole("link", { name: "LinkedIn" }).first()).toBeVisible()
    await expect(page.getByRole("link", { name: "GitHub" }).first()).toBeVisible()
  })

  test("Home page has experience timeline with all projects", async ({ page }) => {
    await page.goto(BASE)
    await expect(page.getByText("Experience Timeline")).toBeVisible()
    await expect(page.getByText("Tiger Analytics", { exact: true }).first()).toBeVisible()
    await expect(page.getByText("Hexaware Technologies")).toBeVisible()
    await expect(page.getByText("AIGronomist").first()).toBeVisible()
    await expect(page.getByText("PepIris — On-Device CV")).toBeVisible()
    await expect(page.getByText("RapidX")).toBeVisible()
  })

  test("Home page shows open source projects", async ({ page }) => {
    await page.goto(BASE)
    await expect(page.getByText("Open Source &")).toBeVisible()
    await expect(page.getByText("react-native-nitro-opencv")).toBeVisible()
    await expect(page.getByText("TLDR-ON")).toBeVisible()
  })

  test("AIGronomist features toggle works", async ({ page }) => {
    await page.goto(BASE)
    const toggleBtn = page.getByRole("button", { name: /Top 15 Features/ })
    await toggleBtn.click()
    await expect(page.getByText("ONNX Model On-Device Inference")).toBeVisible()
    await expect(page.getByText("Showing 15 of 15 features")).toBeVisible()
    await page.getByRole("button", { name: /Hide Top 15 Features/ }).click()
    await expect(page.getByText("Showing 15 of 15 features")).not.toBeVisible()
  })

  test("AIGronomist features filter by category", async ({ page }) => {
    await page.goto(BASE)
    await page.getByRole("button", { name: /Top 15 Features/ }).click()
    await page.getByRole("button", { name: "ML / AI" }).click()
    await expect(page.getByText("Showing 5 of 15 features")).toBeVisible()
    await page.getByRole("button", { name: "All" }).click()
    await expect(page.getByText("Showing 15 of 15 features")).toBeVisible()
  })

  test("Blog page loads", async ({ page }) => {
    await page.goto(`${BASE}#/blog`)
    await expect(page.locator("h1")).toContainText("Blog")
    await expect(page.getByText("View all on Medium")).toBeVisible()
  })

  test("Contact page loads with form", async ({ page }) => {
    await page.goto(`${BASE}#/contact`)
    await expect(page.locator("h1")).toContainText("Get in Touch")
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('textarea[name="message"]')).toBeVisible()
    await expect(page.getByRole("button", { name: "Send Message" })).toBeVisible()
  })

  test("Contributions page loads with stats", async ({ page }) => {
    await page.goto(`${BASE}#/contributions`)
    await expect(page.locator("h1")).toContainText("GitHub")
    await expect(page.getByText("Total Repos")).toBeVisible()
    await expect(page.getByText("26", { exact: true }).first()).toBeVisible()
  })

  test("Navigation works between pages", async ({ page }) => {
    await page.goto(BASE)
    await page.getByRole("link", { name: "Blog" }).click()
    await expect(page).toHaveURL(/#\/blog$/)
    await page.getByRole("link", { name: "Contributions" }).click()
    await expect(page).toHaveURL(/#\/contributions$/)
    await page.getByRole("link", { name: "Contact" }).click()
    await expect(page).toHaveURL(/#\/contact$/)
    await page.getByRole("link", { name: "Home" }).click()
    await expect(page).toHaveURL(/\/vite-project\/?#\/?$/)
  })

  test("Skills section renders", async ({ page }) => {
    await page.goto(BASE)
    await expect(page.getByText("Technical Skills")).toBeVisible()
    await expect(page.getByText("TypeScript").first()).toBeVisible()
    await expect(page.getByText("ONNX Runtime").first()).toBeVisible()
  })

  test("No console errors on Home page", async ({ page }) => {
    const errors: string[] = []
    page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()) })
    page.on("pageerror", (err) => errors.push(err.message))
    await page.goto(BASE)
    await page.waitForTimeout(2000)
    expect(errors).toHaveLength(0)
  })

  test("Contact form has FormSubmit endpoint", async ({ page }) => {
    await page.goto(`${BASE}#/contact`)
    const form = page.locator("form")
    await expect(form).toBeVisible()
    const action = await form.getAttribute("action")
    expect(action).toContain("formsubmit.co")
  })
})
