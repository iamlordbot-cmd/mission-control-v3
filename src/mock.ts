export type Skill = { name: string; status: 'ok' | 'warn' | 'off'; version?: string }
export type Connection = { name: string; status: 'connected' | 'degraded' | 'offline'; note: string }
export type Project = { name: string; status: 'in-progress' | 'done' | 'blocked'; updated: string }
export type SubAgentLog = { id: string; task: string; result: string; when: string }
export type CronJob = { name: string; schedule: string; next: string }

export const skills: Skill[] = [
  { name: 'grok-search', status: 'ok', version: '1.3.0' },
  { name: 'elevenlabs-tts', status: 'ok', version: '0.9.2' },
  { name: 'whisper', status: 'ok', version: '2.1.1' },
  { name: 'vercel-deploy', status: 'warn', version: '0.4.0' },
  { name: 'github-sync', status: 'ok', version: '0.8.7' },
  { name: 'system-health', status: 'ok', version: '1.0.0' },
]

export const connections: Connection[] = [
  { name: 'GitHub', status: 'connected', note: 'Token OK • iamlordbot-cmd' },
  { name: 'Vercel', status: 'connected', note: 'Deploy pipeline ready' },
  { name: 'OpenAI', status: 'degraded', note: 'Rate-limit spikes (last 24h)' },
  { name: 'Grok', status: 'connected', note: 'Web + X search enabled' },
  { name: 'ElevenLabs', status: 'connected', note: 'Voice synthesis online' },
]

export const missingTools = [
  { name: 'Sentry', why: 'Error traces & release health' },
  { name: 'Grafana', why: 'Time-series & alerting' },
  { name: 'PostHog', why: 'Product analytics' },
  { name: 'Supabase', why: 'Auth + DB + RLS' },
]

export const projects: Project[] = [
  { name: 'Mission Control — v1', status: 'in-progress', updated: '2 min ago' },
  { name: 'Ops: nightly work window', status: 'done', updated: 'yesterday' },
  { name: 'API connectors', status: 'blocked', updated: 'awaiting keys' },
]

export const subAgents: SubAgentLog[] = [
  { id: 'A-102', task: 'Design 5 dashboard variants', result: 'v1 shipped', when: 'today' },
  { id: 'A-097', task: 'Draft cron schedule proposal', result: '8h briefing + 23h deep work', when: 'yesterday' },
]

export const systemHealth = {
  uptime: '12h 42m',
  recentErrors: 2,
  apiStatus: [
    { name: 'GitHub', status: 'ok' },
    { name: 'Vercel', status: 'ok' },
    { name: 'OpenAI', status: 'warn' },
    { name: 'Grok', status: 'ok' },
  ] as const,
}

export const crons: CronJob[] = [
  { name: 'Briefing', schedule: '0 8 * * *', next: 'tomorrow 08:00' },
  { name: 'Night Work', schedule: '0 23 * * *', next: 'today 23:00' },
  { name: 'Health ping', schedule: '*/30 * * * *', next: 'in 14 min' },
]

export const usage = {
  tokens24h: 183_240,
  cost24h: 7.92,
  topModels: [
    { name: 'Claude Opus 4.5', share: 48 },
    { name: 'GPT-5.2', share: 32 },
    { name: 'Grok', share: 20 },
  ],
}

export const security = {
  score: 78,
  apiKeys: [
    { name: 'GITHUB_TOKEN', status: 'ok', note: 'Not exposed • scoped token' },
    { name: 'VERCEL_TOKEN', status: 'warn', note: 'Rotate quarterly' },
    { name: 'OPENAI_API_KEY', status: 'warn', note: 'Check org permissions' },
    { name: 'ELEVENLABS_API_KEY', status: 'ok', note: 'Not detected in logs' },
  ] as const,
  access: [
    { when: 'today 19:58', ip: '192.0.2.44', action: 'login', result: 'success' },
    { when: 'today 19:41', ip: '203.0.113.9', action: 'login', result: 'failed' },
    { when: 'yesterday 23:12', ip: '192.0.2.10', action: 'token', result: 'success' },
  ] as const,
  alerts: [
    { severity: 'high', title: 'Potential secret exposure', note: 'Verify no tokens printed in tool logs' },
    { severity: 'med', title: 'Rotation needed soon', note: 'VERCEL_TOKEN policy window' },
  ] as const,
  recommendations: [
    'Rotate VERCEL_TOKEN and invalidate old token',
    'Verify GitHub token scopes: repo, workflow only',
    'Add anomaly detection (Sentry / audit logs)',
    'Enable 2FA + enforce SSO on org projects',
  ] as const,
}
