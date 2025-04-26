import { ApiDataDisplay } from "@/components/api-data-display"

export default function ApiDataPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">API Data</h1>
      <p className="mb-6 text-muted-foreground">
        This page demonstrates fetching and displaying data from the API with proper error handling and validation.
      </p>

      <ApiDataDisplay />
    </div>
  )
}
