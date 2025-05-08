"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { useTheme } from "next-themes"

// Import components
import { HeroSection } from "@/components/welcome/hero-section"
import { NavigationBar } from "@/components/welcome/navigation-bar"
import { SectionContainer } from "@/components/welcome/section-container"
import { FeaturesSection } from "@/components/welcome/features-section"
import { DemoSection } from "@/components/welcome/demo-section"
import { TechnologySection } from "@/components/welcome/technology-section"
import { ProcessSection } from "@/components/welcome/process-section"
import { TeamSection } from "@/components/welcome/team-section"
import { CTASection } from "@/components/welcome/cta-section"
import { Footer } from "@/components/welcome/footer"
import { ModelArchitecture } from "@/components/welcome/model-architecture"

export default function WelcomePage() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState("intro")
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Set mounted state when component mounts
  useEffect(() => {
    setMounted(true)
  }, [])

  // Set visited cookie when the welcome page is viewed
  useEffect(() => {
    if (!Cookies.get("visited")) {
      Cookies.set("visited", "true", { expires: 365 }) // Expires in 1 year
    }
  }, [])

  const handleGetStarted = () => {
    router.push("/login")
  }

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
      setActiveSection(sectionId)
    }
  }

  // Navigation items
  const navItems = [
    { id: "intro", label: "Overview" },
    { id: "features", label: "Features" },
    { id: "demo", label: "Demo" },
    { id: "technology", label: "Technology" },
    { id: "team", label: "Team" },
  ]

  // Only render the content after mounting to avoid hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <div
      className={`min-h-screen overflow-x-hidden ${
        theme === "dark"
          ? "bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 text-white"
          : "bg-gradient-to-b from-gray-50 via-blue-50 to-gray-50 text-gray-900"
      }`}
    >
      {/* Hero Section */}
      <div id="intro">
        <HeroSection onGetStarted={handleGetStarted} onExploreFeatures={() => scrollToSection("features")} />
      </div>

      {/* Navigation Bar */}
      <NavigationBar
        items={navItems}
        activeSection={activeSection}
        onSectionChange={scrollToSection}
        onLogin={handleGetStarted}
      />

      {/* Features Section */}
      <SectionContainer
        id="features"
        title="Key Features"
        subtitle="Comprehensive tools to detect and prevent cyberbullying"
      >
        <FeaturesSection />
      </SectionContainer>

      {/* Demo Section */}
      <SectionContainer
        id="demo"
        title="See It In Action"
        subtitle="How our AI detects cyberbullying content"
        className={
          theme === "dark" ? "bg-gradient-to-b from-gray-900 to-gray-950" : "bg-gradient-to-b from-gray-100 to-gray-200"
        }
      >
        <DemoSection />
      </SectionContainer>

      {/* Model Architecture Section */}
      <ModelArchitecture />

      {/* Technology Section */}
      <SectionContainer
        id="technology"
        title="Technology Stack"
        subtitle="Cutting-edge technologies powering our platform"
      >
        <TechnologySection />
      </SectionContainer>

      {/* Process Section */}
      <SectionContainer
        id="process"
        title="How It Works"
        subtitle="Our comprehensive approach to cyberbullying detection"
        className={
          theme === "dark" ? "bg-gradient-to-b from-gray-900 to-gray-950" : "bg-gradient-to-b from-gray-100 to-gray-200"
        }
      >
        <ProcessSection />
      </SectionContainer>

      {/* Team Section */}
      <SectionContainer id="team" title="Meet Our Team" subtitle="The minds behind the Cyberbullying Prediction AI">
        <TeamSection />
      </SectionContainer>

      {/* Call to Action */}
      <CTASection onGetStarted={handleGetStarted} />

      {/* Footer */}
      <Footer />
    </div>
  )
}
