import './style.css'
import { PomodoroTimer } from './timer'
import { notificationStatus, notifyPhaseComplete, requestNotifications } from './notifications'

function element<T extends HTMLElement>(selector: string): T {
  const found = document.querySelector<T>(selector)
  if (!found) throw new Error(`Missing element: ${selector}`)
  return found
}

const phase = element<HTMLElement>('#phase')
const clock = element<HTMLElement>('#clock')
const status = element<HTMLElement>('#status')
const count = element<HTMLElement>('#count')
const start = element<HTMLButtonElement>('#start')
const pause = element<HTMLButtonElement>('#pause')
const reset = element<HTMLButtonElement>('#reset')
const notificationMessage = element<HTMLElement>('#notification-status')
const enableNotifications = element<HTMLButtonElement>('#enable-notifications')

function updateNotificationStatus(): void {
  notificationMessage.textContent = notificationStatus()
  enableNotifications.disabled = !('Notification' in window) || Notification.permission !== 'default'
}

const timer = new PomodoroTimer({
  onPhaseComplete(completedPhase) {
    try {
      notifyPhaseComplete(completedPhase)
    } catch (error) {
      console.error('Unable to show notification:', error)
      notificationMessage.textContent = 'Could not show the notification. Check your browser settings.'
    }
  },
})

timer.subscribe((state) => {
  const seconds = Math.ceil(state.remainingMs / 1000)
  clock.textContent = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`
  phase.textContent = state.phase === 'work' ? 'Work session' : 'Break time'
  count.textContent = String(state.completedWorkSessions)
  status.textContent = state.status === 'running'
    ? state.phase === 'work' ? 'Stay focused. You’ve got this.' : 'Take a moment to recharge.'
    : state.status === 'paused' ? 'Paused. Take your time.' : 'Ready when you are.'
  start.textContent = state.status === 'paused' ? 'Resume' : 'Start'
  start.disabled = state.status === 'running'
  pause.disabled = state.status !== 'running'
  document.title = `${clock.textContent} · ${state.phase === 'work' ? 'Work' : 'Break'} | Pomodoro Timer`
})

start.addEventListener('click', () => timer.start())
pause.addEventListener('click', () => timer.pause())
reset.addEventListener('click', () => timer.reset())
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    timer.refresh()
    updateNotificationStatus()
  }
})
enableNotifications.addEventListener('click', async () => {
  try {
    await requestNotifications()
    updateNotificationStatus()
  } catch (error) {
    console.error('Unable to request notification permission:', error)
    notificationMessage.textContent = 'Could not request notification permission. Check your browser settings.'
  }
})
updateNotificationStatus()
