import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { PomodoroTimer } from '../src/timer'

describe('PomodoroTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(0)
  })
  afterEach(() => vi.useRealTimers())

  it('pauses, resumes, and resets the current phase without losing the count', () => {
    const timer = new PomodoroTimer()
    timer.start()
    vi.advanceTimersByTime(10_000)
    timer.pause()
    expect(timer.getState()).toMatchObject({ status: 'paused', remainingMs: 1_490_000 })
    vi.advanceTimersByTime(20_000)
    timer.start()
    vi.advanceTimersByTime(1_490_000)
    expect(timer.getState()).toEqual({ status: 'idle', phase: 'break', remainingMs: 300_000, completedWorkSessions: 1 })
    timer.start()
    vi.advanceTimersByTime(5_000)
    timer.reset()
    expect(timer.getState()).toEqual({ status: 'idle', phase: 'break', remainingMs: 300_000, completedWorkSessions: 1 })
  })

  it('completes phases once and does not count breaks', () => {
    const onPhaseComplete = vi.fn()
    const timer = new PomodoroTimer({ onPhaseComplete })
    timer.start()
    timer.start()
    vi.advanceTimersByTime(1_500_000)
    expect(timer.getState()).toMatchObject({ phase: 'break', status: 'idle', completedWorkSessions: 1 })
    vi.advanceTimersByTime(1_000_000)
    expect(onPhaseComplete).toHaveBeenCalledTimes(1)
    timer.start()
    vi.advanceTimersByTime(300_000)
    expect(timer.getState()).toEqual({ phase: 'work', status: 'idle', remainingMs: 1_500_000, completedWorkSessions: 1 })
    expect(onPhaseComplete.mock.calls).toEqual([['work'], ['break']])
  })

  it('catches up after a delayed tick and completes instead of pausing at zero', () => {
    const onPhaseComplete = vi.fn()
    const timer = new PomodoroTimer({ onPhaseComplete })
    timer.start()
    vi.setSystemTime(1_500_001)
    timer.pause()
    timer.refresh()
    expect(timer.getState()).toMatchObject({ phase: 'break', status: 'idle', completedWorkSessions: 1 })
    expect(onPhaseComplete).toHaveBeenCalledTimes(1)
  })

  it('publishes snapshots and supports unsubscribing', () => {
    const timer = new PomodoroTimer()
    const listener = vi.fn()
    const unsubscribe = timer.subscribe(listener)
    const snapshot = timer.getState()
    timer.start()
    expect(snapshot.status).toBe('idle')
    expect(listener).toHaveBeenCalledTimes(2)
    unsubscribe()
    timer.reset()
    expect(listener).toHaveBeenCalledTimes(2)
  })
})
