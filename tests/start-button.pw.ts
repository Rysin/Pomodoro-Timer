import { expect, test, type Page } from '@playwright/test'

interface NotificationCalls {
  requests: number
  constructions: string[]
}

declare global {
  interface Window {
    __notificationCalls: NotificationCalls
  }
}

async function openTimer(page: Page): Promise<void> {
  await page.clock.install({ time: new Date('2026-01-01T00:00:00') })
  await page.addInitScript(() => {
    const calls = { requests: 0, constructions: [] as string[] }
    class NotificationStub {
      static permission = 'default'

      static async requestPermission(): Promise<string> {
        calls.requests += 1
        NotificationStub.permission = 'denied'
        return 'denied'
      }

      constructor(title: string) {
        calls.constructions.push(title)
      }
    }

    Object.defineProperty(window, 'Notification', { configurable: true, value: NotificationStub })
    Object.defineProperty(window, '__notificationCalls', { configurable: true, value: calls })
  })
  await page.goto('/')
}

async function getNotificationCalls(page: Page): Promise<NotificationCalls> {
  return page.evaluate(() => window.__notificationCalls)
}

test('Start has the navy fill and border in the ready state', async ({ page }) => {
  await openTimer(page)

  const start = page.getByRole('button', { name: 'Start' })
  await expect(start).toBeEnabled()
  await expect(start).toHaveCSS('background-color', 'rgb(0, 0, 128)')
  await expect(start).toHaveCSS('border-top-color', 'rgb(0, 0, 128)')
})

test('Resume retains the navy style and resumes the timer', async ({ page }) => {
  await openTimer(page)

  await page.getByRole('button', { name: 'Start' }).click()
  await page.getByRole('button', { name: 'Pause' }).click()

  const resume = page.getByRole('button', { name: 'Resume' })
  await expect(resume).toBeEnabled()
  await expect(resume).toHaveCSS('background-color', 'rgb(0, 0, 128)')
  await expect(resume).toHaveCSS('border-top-color', 'rgb(0, 0, 128)')
  await resume.click()
  await expect(page.getByRole('button', { name: 'Start' })).toBeDisabled()
  await expect(page.getByRole('button', { name: 'Pause' })).toBeEnabled()
})

test('timer controls, countdown, phases, count, manual starts, and reload remain unchanged', async ({ page }) => {
  await openTimer(page)

  const start = page.getByRole('button', { name: 'Start' })
  const pause = page.getByRole('button', { name: 'Pause' })
  const reset = page.getByRole('button', { name: 'Reset' })
  const clock = page.locator('#clock')
  const phase = page.locator('#phase')
  const count = page.locator('#count')

  await expect(clock).toHaveText('25:00')
  await expect(count).toHaveText('0')
  await start.click()
  await expect(start).toBeDisabled()
  await expect(pause).toBeEnabled()
  await page.clock.fastForward(10_000)
  await expect(clock).toHaveText('24:50')

  await pause.click()
  await expect(page.getByRole('button', { name: 'Resume' })).toBeEnabled()
  await page.clock.fastForward(20_000)
  await expect(clock).toHaveText('24:50')
  await page.getByRole('button', { name: 'Resume' }).click()
  await expect(page.getByRole('button', { name: 'Start' })).toBeDisabled()
  await page.clock.fastForward(5_000)
  await expect(clock).toHaveText('24:45')

  await reset.click()
  await expect(clock).toHaveText('25:00')
  await expect(count).toHaveText('0')
  await expect(page.getByRole('button', { name: 'Start' })).toBeEnabled()

  await page.getByRole('button', { name: 'Start' }).click()
  await page.clock.fastForward(25 * 60 * 1000)
  await expect(phase).toHaveText('Break time')
  await expect(clock).toHaveText('05:00')
  await expect(count).toHaveText('1')
  await expect(page.getByRole('button', { name: 'Start' })).toBeEnabled()
  await expect(page.getByRole('button', { name: 'Pause' })).toBeDisabled()

  await page.getByRole('button', { name: 'Start' }).click()
  await page.clock.fastForward(5 * 60 * 1000)
  await expect(phase).toHaveText('Work session')
  await expect(clock).toHaveText('25:00')
  await expect(count).toHaveText('1')
  await expect(page.getByRole('button', { name: 'Start' })).toBeEnabled()
  await expect(page.getByRole('button', { name: 'Pause' })).toBeDisabled()

  await page.reload()
  await expect(page.locator('#phase')).toHaveText('Work session')
  await expect(page.locator('#clock')).toHaveText('25:00')
  await expect(page.locator('#count')).toHaveText('0')
})

test('notifications remain opt-in and use only the pre-navigation stub', async ({ page }) => {
  await openTimer(page)
  expect(await getNotificationCalls(page)).toEqual({ requests: 0, constructions: [] })

  await page.getByRole('button', { name: 'Start' }).click()
  await page.clock.fastForward(25 * 60 * 1000)
  await expect(page.locator('#phase')).toHaveText('Break time')
  expect(await getNotificationCalls(page)).toEqual({ requests: 0, constructions: [] })

  await page.getByRole('button', { name: 'Enable notifications' }).click()
  await expect(page.locator('#notification-status')).toContainText('Notifications are blocked')
  expect(await getNotificationCalls(page)).toEqual({ requests: 1, constructions: [] })
})

test('keyboard focus stays visible and narrow layout has no horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 })
  await openTimer(page)

  const start = page.getByRole('button', { name: 'Start' })
  await page.keyboard.press('Tab')
  await expect(start).toBeFocused()
  await expect(start).toHaveCSS('outline-style', 'solid')
  await expect(start).toHaveCSS('outline-width', '3px')

  const layout = await page.evaluate(() => {
    const controls = document.querySelector<HTMLElement>('.controls')
    if (!controls) throw new Error('Controls container is missing')

    return {
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      controlsFlexWrap: getComputedStyle(controls).flexWrap,
    }
  })
  expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth)
  expect(layout.controlsFlexWrap).toBe('wrap')

  await page.keyboard.press('Enter')
  await expect(start).toBeDisabled()
})
