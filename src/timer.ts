export type TimerStatus = 'idle' | 'running' | 'paused'
export type Phase = 'work' | 'break'

export interface TimerState {
  status: TimerStatus
  phase: Phase
  remainingMs: number
  completedWorkSessions: number
}

const DURATIONS: Record<Phase, number> = {
  work: 25 * 60 * 1000,
  break: 5 * 60 * 1000,
}

type Listener = (state: Readonly<TimerState>) => void

export class PomodoroTimer {
  private state: TimerState = {
    status: 'idle',
    phase: 'work',
    remainingMs: DURATIONS.work,
    completedWorkSessions: 0,
  }
  private intervalId: ReturnType<typeof setInterval> | null = null
  private deadlineMs: number | null = null
  private listeners = new Set<Listener>()
  private now: () => number
  private onPhaseComplete: (phase: Phase) => void

  constructor(options: { now?: () => number; onPhaseComplete?: (phase: Phase) => void } = {}) {
    this.now = options.now ?? Date.now
    this.onPhaseComplete = options.onPhaseComplete ?? (() => {})
  }

  getState(): Readonly<TimerState> {
    return { ...this.state }
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener)
    listener(this.getState())
    return () => this.listeners.delete(listener)
  }

  start(): void {
    if (this.state.status === 'running') return
    this.deadlineMs = this.now() + this.state.remainingMs
    this.state.status = 'running'
    this.intervalId = setInterval(() => this.refresh(), 250)
    this.emit()
  }

  pause(): void {
    if (this.state.status !== 'running') return
    this.refresh()
    if (this.state.status !== 'running') return
    this.clearTimer()
    this.state.status = 'paused'
    this.emit()
  }

  reset(): void {
    this.clearTimer()
    this.state.status = 'idle'
    this.state.remainingMs = DURATIONS[this.state.phase]
    this.emit()
  }

  refresh(): void {
    if (this.state.status !== 'running' || this.deadlineMs === null) return
    const remainingMs = Math.max(0, this.deadlineMs - this.now())
    if (remainingMs === 0) {
      const completedPhase = this.state.phase
      this.clearTimer()
      if (completedPhase === 'work') this.state.completedWorkSessions += 1
      this.state.phase = completedPhase === 'work' ? 'break' : 'work'
      this.state.remainingMs = DURATIONS[this.state.phase]
      this.state.status = 'idle'
      this.emit()
      this.onPhaseComplete(completedPhase)
      return
    }
    this.state.remainingMs = remainingMs
    this.emit()
  }

  private clearTimer(): void {
    if (this.intervalId !== null) clearInterval(this.intervalId)
    this.intervalId = null
    this.deadlineMs = null
  }

  private emit(): void {
    for (const listener of this.listeners) listener(this.getState())
  }
}
