type LogLevel = "info" | "warn" | "error" | "debug"

interface LogOptions {
  level?: LogLevel
  includeTimestamp?: boolean
  includeEndpoint?: boolean
}

const defaultOptions: LogOptions = {
  level: "info",
  includeTimestamp: true,
  includeEndpoint: true,
}

export class ApiLogger {
  private static instance: ApiLogger
  private isEnabled: boolean = process.env.NODE_ENV !== "production"

  private constructor() {}

  public static getInstance(): ApiLogger {
    if (!ApiLogger.instance) {
      ApiLogger.instance = new ApiLogger()
    }
    return ApiLogger.instance
  }

  public enable(): void {
    this.isEnabled = true
  }

  public disable(): void {
    this.isEnabled = false
  }

  public logRequest(endpoint: string, method: string, params?: any, body?: any): void {
    if (!this.isEnabled) return

    console.group(`🚀 API Request: ${method} ${endpoint}`)
    console.log("Time:", new Date().toISOString())
    if (params) console.log("Params:", params)
    if (body) console.log("Body:", body)
    console.groupEnd()
  }

  public logResponse(
    endpoint: string,
    method: string,
    status: number,
    data: any,
    options: LogOptions = defaultOptions,
  ): void {
    if (!this.isEnabled) return

    const { level, includeTimestamp, includeEndpoint } = { ...defaultOptions, ...options }

    const timestamp = includeTimestamp ? new Date().toISOString() : undefined
    const endpointInfo = includeEndpoint ? `${method} ${endpoint}` : undefined

    console.group(`✅ API Response: ${status} ${endpointInfo}`)
    if (timestamp) console.log("Time:", timestamp)
    console.log("Status:", status)
    console.log("Data:", data)
    console.groupEnd()
  }

  public logError(
    endpoint: string,
    method: string,
    error: any,
    options: LogOptions = { ...defaultOptions, level: "error" },
  ): void {
    if (!this.isEnabled) return

    const { includeTimestamp, includeEndpoint } = { ...defaultOptions, ...options }

    const timestamp = includeTimestamp ? new Date().toISOString() : undefined
    const endpointInfo = includeEndpoint ? `${method} ${endpoint}` : undefined

    console.group(`❌ API Error: ${endpointInfo}`)
    if (timestamp) console.log("Time:", timestamp)
    console.error("Error:", error)
    if (error.response) {
      console.error("Response:", error.response)
    }
    console.groupEnd()
  }
}

export const apiLogger = ApiLogger.getInstance()
