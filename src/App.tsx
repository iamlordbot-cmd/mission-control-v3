import { useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import {
  Cpu,
  Link2,
  Shield,
  Activity,
  Timer,
  Moon,
  Sun,
} from 'lucide-react'
import {
  connections,
  crons,
  missingTools,
  projects,
  skills,
  subAgents,
  systemHealth,
  usage,
} from './mock'

const PASSWORD = 'IWThalassa4!'

type Theme = 'dark' | 'light'

function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const saved = (localStorage.getItem('mc_theme') as Theme | null) ?? 'dark'
    setTheme(saved)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('mc_theme', theme)
  }, [theme])

  return { theme, setTheme }
}

function ThemeToggle({ theme, setTheme }: { theme: Theme; setTheme: (t: Theme) => void }) {
  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="inline-flex items-center gap-2 rounded-xl border border-border/20 bg-card/40 px-3 py-2 font-mono text-xs text-fg hover:bg-card/60 transition"
    >
      {isDark ? <Sun size={14} /> : <Moon size={14} />}
      <span>{isDark ? 'light' : 'dark'}</span>
    </button>
  )
}

function statusColor(s: string) {
  if (s === 'ok' || s === 'connected' || s === 'done') return 'text-good'
  if (s === 'warn' || s === 'degraded' || s === 'in-progress') return 'text-warn'
  return 'text-bad'
}

function Pane({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="terminal rounded-2xl border border-border/20 bg-card/20 p-4 backdrop-blur-xl">
      <header className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono text-xs text-muted/70">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-border/20 bg-card/30">
            {icon}
          </span>
          <span className="tracking-[0.22em]">{title.toUpperCase()}</span>
        </div>
        <span className="kbd">mock</span>
      </header>
      {children}
    </section>
  )
}

function Login({ onOk }: { onOk: () => void }) {
  const { theme, setTheme } = useTheme()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div className="pointer-events-none absolute inset-0 scanlines opacity-60" />

      <div className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="font-mono">
            <div className="text-xs text-muted/70">mission-control@node:~</div>
            <div className="mt-1 text-2xl font-semibold text-fg">auth</div>
          </div>
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>

        <div className="terminal rounded-2xl border border-border/20 bg-card/20 p-5 backdrop-blur-xl">
          <div className="font-mono text-xs text-muted/70">$ enter-passphrase</div>
          <form
            className="mt-4 space-y-3"
            onSubmit={(e) => {
              e.preventDefault()
              if (password === PASSWORD) {
                localStorage.setItem('mc_auth', '1')
                onOk()
              } else {
                setError('ACCESS DENIED')
              }
            }}
          >
            <input
              className="w-full rounded-xl border border-border/20 bg-black/10 px-4 py-3 font-mono text-sm text-fg outline-none focus:ring-2 focus:ring-accent/40"
              placeholder="***************"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError(null)
              }}
              autoFocus
            />
            {error ? (
              <div className="rounded-xl border border-bad/30 bg-bad/10 px-3 py-2 font-mono text-xs text-bad">
                {error}
              </div>
            ) : null}
            <button className="w-full rounded-xl bg-accent/20 px-4 py-3 font-mono text-sm text-fg ring-1 ring-accent/30 hover:bg-accent/25">
              unlock
            </button>
          </form>
          <div className="mt-4 font-mono text-[11px] text-muted/60">
            hint: replace local auth with SSO later.
          </div>
        </div>
      </div>
    </div>
  )
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const { theme, setTheme } = useTheme()

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div className="pointer-events-none absolute inset-0 scanlines opacity-55" />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
        <header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="font-mono">
            <div className="text-xs text-muted/70">mission-control@node:~</div>
            <div className="mt-1 text-2xl font-semibold text-fg">dashboard</div>
            <div className="mt-2 text-xs text-muted/70">
              Press <span className="kbd">⌘K</span> for command palette (stub)
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle theme={theme} setTheme={setTheme} />
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-border/20 bg-card/40 px-3 py-2 font-mono text-xs text-fg hover:bg-card/60"
            >
              <span>logout</span>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-4">
            <Pane title="Skills" icon={<Cpu size={16} />}>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {skills.map((s) => (
                  <div key={s.name} className="rounded-xl border border-border/15 bg-card/20 px-3 py-2 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-fg">{s.name}</span>
                      <span className={clsx('font-semibold', statusColor(s.status))}>{s.status}</span>
                    </div>
                    <div className="mt-1 text-[11px] text-muted/60">version: {s.version ?? '—'}</div>
                  </div>
                ))}
              </div>
            </Pane>

            <Pane title="Connections" icon={<Link2 size={16} />}>
              <div className="space-y-2 font-mono text-xs">
                {connections.map((c) => (
                  <div key={c.name} className="rounded-xl border border-border/15 bg-card/20 px-3 py-2">
                    <div className="flex items-center justify-between">
                      <span className="text-fg">{c.name}</span>
                      <span className={clsx('font-semibold', statusColor(c.status))}>{c.status}</span>
                    </div>
                    <div className="mt-1 text-[11px] text-muted/60">{c.note}</div>
                  </div>
                ))}
              </div>
            </Pane>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <Pane title="System" icon={<Activity size={16} />}>
              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                <div className="rounded-xl border border-border/15 bg-card/20 px-3 py-2">
                  <div className="text-muted/60">uptime</div>
                  <div className="mt-1 text-fg">{systemHealth.uptime}</div>
                </div>
                <div className="rounded-xl border border-border/15 bg-card/20 px-3 py-2">
                  <div className="text-muted/60">errors</div>
                  <div className="mt-1 text-fg">{systemHealth.recentErrors}</div>
                </div>
                {systemHealth.apiStatus.map((a) => (
                  <div key={a.name} className="rounded-xl border border-border/15 bg-card/20 px-3 py-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted/70">{a.name}</span>
                      <span className={clsx('font-semibold', statusColor(a.status))}>{a.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Pane>

            <Pane title="Ops" icon={<Shield size={16} />}>
              <div className="space-y-2 font-mono text-xs">
                {projects.map((p) => (
                  <div key={p.name} className="rounded-xl border border-border/15 bg-card/20 px-3 py-2">
                    <div className="flex items-center justify-between">
                      <span className="text-fg">{p.name}</span>
                      <span className={clsx('font-semibold', statusColor(p.status))}>{p.status}</span>
                    </div>
                    <div className="mt-1 text-[11px] text-muted/60">updated: {p.updated}</div>
                  </div>
                ))}
              </div>

              <div className="mt-3 rounded-xl border border-border/15 bg-card/20 px-3 py-2 font-mono text-xs">
                <div className="text-muted/60">sub-agents</div>
                <div className="mt-2 space-y-2">
                  {subAgents.map((a) => (
                    <div key={a.id} className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-fg">{a.id}: {a.task}</div>
                        <div className="text-[11px] text-muted/60">{a.result}</div>
                      </div>
                      <span className="text-[11px] text-muted/60">{a.when}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Pane>

            <Pane title="Crons & Usage" icon={<Timer size={16} />}>
              <div className="grid grid-cols-1 gap-2 font-mono text-xs">
                <div className="rounded-xl border border-border/15 bg-card/20 px-3 py-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted/60">tokens_24h</span>
                    <span className="text-fg">{usage.tokens24h.toLocaleString()}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-muted/60">cost_24h</span>
                    <span className="text-fg">${usage.cost24h.toFixed(2)}</span>
                  </div>
                </div>

                <div className="rounded-xl border border-border/15 bg-card/20 px-3 py-2">
                  <div className="text-muted/60">cron.next</div>
                  <div className="mt-2 space-y-1">
                    {crons.map((c) => (
                      <div key={c.name} className="flex items-center justify-between">
                        <span className="text-fg">{c.name}</span>
                        <span className="text-[11px] text-muted/60">{c.next}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-border/15 bg-card/20 px-3 py-2">
                  <div className="text-muted/60">missing.tools</div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {missingTools.map((m) => (
                      <div key={m.name} className="rounded-lg border border-border/15 bg-black/5 px-2 py-2">
                        <div className="text-fg">{m.name}</div>
                        <div className="mt-1 text-[11px] text-muted/60">{m.why}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Pane>
          </div>
        </div>

        <div className="mt-6 font-mono text-[11px] text-muted/60">v3 • terminal / CRT neon</div>
      </div>
    </div>
  )
}

function App() {
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    setAuthed(localStorage.getItem('mc_auth') === '1')
  }, [])

  const view = useMemo(() => {
    if (!authed) return <Login onOk={() => setAuthed(true)} />
    return (
      <Dashboard
        onLogout={() => {
          localStorage.removeItem('mc_auth')
          setAuthed(false)
        }}
      />
    )
  }, [authed])

  return view
}

export default App
