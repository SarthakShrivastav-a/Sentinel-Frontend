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
