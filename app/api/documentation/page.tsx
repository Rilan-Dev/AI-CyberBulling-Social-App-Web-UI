import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ApiDocumentation } from "@/lib/Api-tool/api-documentation"
import { ApiTestingTools } from "@/lib/Api-tool/api-testing-tools"

export default function ApiDocumentationPage() {
  return (
    <div className="container p-8">
      <h1 className="text-3xl font-bold mb-2">API Documentation & Testing</h1>
      <p className="mb-6 text-muted-foreground">
        Comprehensive documentation and testing tools for the Cyberbullying Prediction API.
      </p>

      <Tabs defaultValue="documentation">
        <TabsList className="mb-4">
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
          <TabsTrigger value="testing">Testing Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="documentation">
          <ApiDocumentation />
        </TabsContent>

        <TabsContent value="testing">
          <ApiTestingTools />
        </TabsContent>
      </Tabs>
    </div>
  )
}
