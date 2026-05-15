export interface ErrorCondition {
  triggerOn: string
  threshold: number
}

export interface Monitor {
  id: string
  userId: string
  url: string
  errorCondition: ErrorCondition
  createdAt: string
  updatedAt: string
}

export interface MonitorCheckHistory {
  id: string
  monitorId: string
  timestamp: string
  statusCode: number
  responseTime: number
  contentMatch: boolean
  status: string
}

export interface DomainInfo {
  id: string
  name: string
  ipAddress: string
}

export interface SSLInfo {
  id: string
  domainInfo: DomainInfo
  monitorId: string
  validFrom: string
  validTo: string
}

export interface MonitorDetails {
  monitorId: string
  userId: string
  url: string
  errorCondition: ErrorCondition
  createdAt: Date
  checkHistory: MonitorCheckHistory[]
  sslInfo: SSLInfo
  domainInfo: DomainInfo
  currentStatus: string
  uptimePercentage: number
  totalChecks: number
  downChecks: number
  cumulativeDowntime: number
  consecutiveDowntimeCount: number
  cumulativeResponse: number
  averageResponseTime: number
  lastChecked: Date
  upChecks: number
}

export interface TeamMember {
  firstName: string
  lastName: string
  email: string
  active: boolean
}

export interface Team {
  teamId: string
  userId: string
  teamMembers: TeamMember[]
}

export interface StatusComponent {
  name: string
  type: string
  linkedResourceId: string
  state: string
}

export interface StatusPage {
  id: string
  userId: string
  name: string
  slug: string
  description: string
  published: boolean
  components: StatusComponent[]
  createdAt: string
}

export interface IncidentUpdate {
  state: string
  message: string
  createdAt: string
}

export interface Incident {
  id: string
  userId: string
  title: string
  severity: string
  state: string
  affectedComponentIds: string[]
  assignedToEmail?: string
  acknowledgedAt?: string
  resolvedAt?: string
  updates: IncidentUpdate[]
  createdAt: string
}

export interface MaintenanceWindow {
  id: string
  userId: string
  title: string
  description: string
  startsAt: string
  endsAt: string
  affectedResourceIds: string[]
  createdAt: string
}

export interface IncidentSummary {
  summary: string
  likely_cause: string
  recommended_actions: string[]
  fallback: boolean
}

export interface RootCauseHints {
  hints: string[]
  confidence: string
  fallback: boolean
}

export interface PostmortemDraft {
  executive_summary: string
  impact: string
  timeline: string[]
  root_cause_hypothesis: string
  resolution: string
  prevention_tasks: string[]
  fallback: boolean
}
