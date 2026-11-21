# Pomodoro Timer

A small TypeScript timer for 25-minute work sessions and 5-minute breaks.

## Getting started

Use a Node.js version supported by Vite, then run:

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite. Run `npm test` for the timer tests and `npm run build` for a type-checked production build.

## How it works

Start and pause preserve the current phase's remaining time. Reset restores the current phase's full duration without clearing the completed work-session count. A completed work session increments the count and prepares a break; a completed break prepares a work session. Start each new phase manually. The count resets when the page is reloaded.

Notifications are optional and require browser permission, typically in a secure context such as localhost or HTTPS. They are only sent while the page is open and able to run. The countdown uses a wall-clock deadline to catch up after tab throttling or sleep; changes to the system clock can affect the remaining time.
