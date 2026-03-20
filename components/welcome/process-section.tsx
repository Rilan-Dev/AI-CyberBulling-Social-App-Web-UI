import { Database, Code, Brain, Zap, Shield } from "lucide-react"
import { ProcessStep } from "./process-step"

export function ProcessSection() {
  const steps = [
    {
      number: 1,
      title: "Data Collection & Preprocessing",
      description:
        "We collect and clean data from various social media platforms and messaging apps to train our models.",
      icon: Database,
    },
    {
      number: 2,
      title: "Feature Extraction",
      description:
        "Our NLP pipeline extracts meaningful features from text data, while our image processing pipeline identifies visual patterns.",
      icon: Code,
    },
    {
      number: 3,
      title: "Model Training",
      description:
        "We train our neural networks on labeled datasets to recognize patterns indicative of cyberbullying.",
      icon: Brain,
    },
    {
      number: 4,
      title: "Real-time Analysis",
      description: "Our system monitors communications in real-time, flagging potentially harmful content for review.",
      icon: Zap,
    },
    {
      number: 5,
      title: "Intervention & Prevention",
      description:
        "Based on detection results, appropriate interventions are suggested to prevent cyberbullying incidents.",
      icon: Shield,
    },
  ]

  return (
    <div className="mt-12 relative">
      {/* Connecting line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-blue-900/50 transform -translate-x-1/2 hidden md:block"></div>

      <div className="space-y-16">
        {steps.map((step) => (
          <ProcessStep
            key={step.number}
            number={step.number}
            title={step.title}
            description={step.description}
            icon={step.icon}
          />
        ))}
      </div>
    </div>
  )
}
