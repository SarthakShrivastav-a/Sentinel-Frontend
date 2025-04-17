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
  createdAt: string
  // ... other fields
  checkHistory: MonitorCheckHistory[]
  sslInfo: SSLInfo
  domainInfo: DomainInfo
}
