import { expect, test } from '@playwright/test'
import type { BrowserContext, Page } from '@playwright/test'

const TAGLINE = 'Find your focus, one session at a time.'
const ARTICLE_URL = 'https://en.wikipedia.org/wiki/Pomodoro_Technique'

// Prevent any real network request to Wikipedia during tests.
async function stubWikipedia(context: BrowserContext): Promise<void> {
  await context.route('https://en.wikipedia.org/**', (route) =>
    route.fulfill({ status: 200, contentType: 'text/html', body: '<title>stub</title>' }),
  )
}

function tagline(page: Page) {
  return page.getByRole('link', { name: TAGLINE })
}

test.describe('tagline link', () => {
  test('P-1 tagline is a link with the original text', async ({ page }) => {
    await page.goto('/')
    const link = tagline(page)
    await expect(link).toBeVisible()
    await expect(link).toHaveText(TAGLINE)
  })

  test('P-2 link opens the article in a new tab', async ({ page, context }) => {
    await stubWikipedia(context)
    await page.goto('/')
    const originalUrl = page.url()
    const link = tagline(page)

    await expect(link).toHaveAttribute('href', ARTICLE_URL)
    await expect(link).toHaveAttribute('target', '_blank')
    await expect(link).toHaveAttribute('rel', /noopener/)
    await expect(link).toHaveAttribute('rel', /noreferrer/)

    const [popup] = await Promise.all([page.waitForEvent('popup'), link.click()])
    await expect(popup).toHaveURL(ARTICLE_URL)
    expect(page.url()).toBe(originalUrl)
    expect(await popup.evaluate(() => window.opener)).toBeNull()
  })

  test('P-3 timer is unaffected by opening the link', async ({ page, context }) => {
    await stubWikipedia(context)
    await page.clock.install()
    await page.goto('/')

    await page.getByRole('button', { name: 'Start' }).click()
    await page.clock.runFor(3000)
    await expect(page.locator('#clock')).toHaveText('24:57')

    const [popup] = await Promise.all([page.waitForEvent('popup'), tagline(page).click()])
    await expect(popup).toHaveURL(ARTICLE_URL)

    await page.clock.runFor(2000)
    await expect(page.locator('#clock')).toHaveText('24:55')
    await expect(page.locator('#count')).toHaveText('0')
  })

  test('P-4 link is keyboard operable with a visible focus ring', async ({ page, context }) => {
    await stubWikipedia(context)
    await page.goto('/')
    const link = tagline(page)

    for (let i = 0; i < 3; i += 1) {
      if (await link.evaluate((el) => el === document.activeElement)) break
      await page.keyboard.press('Tab')
    }
    await expect(link).toBeFocused()

    const outline = await link.evaluate((el) => {
      const style = getComputedStyle(el)
      return { style: style.outlineStyle, width: style.outlineWidth }
    })
    expect(outline.style).not.toBe('none')
    expect(outline.width).toBe('3px')

    const [popup] = await Promise.all([page.waitForEvent('popup'), page.keyboard.press('Enter')])
    await expect(popup).toHaveURL(ARTICLE_URL)
  })

  test('P-5 link is underlined and inherits the paragraph colour', async ({ page }) => {
    await page.goto('/')
    const link = tagline(page)
    const styles = await link.evaluate((el) => {
      const parent = el.parentElement
      if (!parent) throw new Error('Tagline link has no parent element')
      return {
        decoration: getComputedStyle(el).textDecorationLine,
        color: getComputedStyle(el).color,
        parentColor: getComputedStyle(parent).color,
      }
    })
    expect(styles.decoration).toContain('underline')
    expect(styles.color).toBe(styles.parentColor)
  })

  test('P-6 no horizontal overflow at 280px', async ({ page }) => {
    await page.setViewportSize({ width: 280, height: 800 })
    await page.goto('/')

    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }))
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth)

    const box = await tagline(page).boundingBox()
    if (!box) throw new Error('Tagline link has no bounding box')
    expect(box.x).toBeGreaterThanOrEqual(0)
    expect(box.x + box.width).toBeLessThanOrEqual(280)
  })
})
