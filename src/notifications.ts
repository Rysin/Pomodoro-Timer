import type { Phase } from './timer'

export function notificationStatus(): string {
  if (!('Notification' in window)) return 'Notifications are not supported in this browser.'
  switch (Notification.permission) {
    case 'granted': return 'Notifications are enabled.'
    case 'denied': return 'Notifications are blocked. Change this in your browser settings.'
    default: return 'Get a notification when your session ends.'
  }
}

export async function requestNotifications(): Promise<void> {
  if (!('Notification' in window)) return
  await Notification.requestPermission()
}

export function notifyPhaseComplete(phase: Phase): void {
  if (!('Notification' in window) || Notification.permission !== 'granted') return
  new Notification(phase === 'work' ? 'Work session complete' : 'Break complete', {
    body: phase === 'work' ? 'Time for a well-earned break.' : 'Ready for another focus session?',
  })
}
