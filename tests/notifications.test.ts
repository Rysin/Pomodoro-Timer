import { afterEach, describe, expect, it, vi } from 'vitest'
import { notificationStatus, notifyPhaseComplete, requestNotifications } from '../src/notifications'

afterEach(() => vi.unstubAllGlobals())

describe('notifications', () => {
  it('handles browsers without notification support', async () => {
    vi.stubGlobal('window', {})
    expect(notificationStatus()).toContain('not supported')
    await expect(requestNotifications()).resolves.toBeUndefined()
    expect(() => notifyPhaseComplete('work')).not.toThrow()
  })

  it('does not notify when permission is denied', () => {
    const NotificationMock = Object.assign(vi.fn(), { permission: 'denied' })
    vi.stubGlobal('window', { Notification: NotificationMock })
    vi.stubGlobal('Notification', NotificationMock)
    expect(notificationStatus()).toContain('blocked')
    notifyPhaseComplete('work')
    expect(NotificationMock).not.toHaveBeenCalled()
  })

  it('requests permission and notifies when granted', async () => {
    const requestPermission = vi.fn().mockResolvedValue('granted')
    const NotificationMock = Object.assign(vi.fn(), { permission: 'granted', requestPermission })
    vi.stubGlobal('window', { Notification: NotificationMock })
    vi.stubGlobal('Notification', NotificationMock)
    await requestNotifications()
    notifyPhaseComplete('break')
    expect(requestPermission).toHaveBeenCalledOnce()
    expect(NotificationMock).toHaveBeenCalledWith('Break complete', expect.objectContaining({ body: expect.any(String) }))
  })
})
