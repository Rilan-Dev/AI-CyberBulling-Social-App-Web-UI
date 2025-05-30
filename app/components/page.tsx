"use client"

import Link from "next/link"
import { ArrowRight, Code, Component, Layout, Palette, Settings, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"


export default function Components() {

  return (
    <>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Next.js UI Component Library
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  A comprehensive collection of reusable UI components built with Next.js, Tailwind CSS, and shadcn/ui.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild>
                  <Link href="/components">
                    Explore Components <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/dashboard">View Dashboard</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Explore Our Features</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Discover the powerful features and components available in our UI library.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 pt-8">
                <FeatureCard
                  icon={<Component className="h-10 w-10" />}
                  title="UI Components"
                  description="Explore our extensive collection of reusable UI components."
                  href="/components"
                />
                <FeatureCard
                  icon={<Layout className="h-10 w-10" />}
                  title="Page Layouts"
                  description="Pre-built page layouts for common application patterns."
                  href="/dashboard"
                />
                <FeatureCard
                  icon={<Users className="h-10 w-10" />}
                  title="User Management"
                  description="Complete user management system with authentication."
                  href="/users"
                />
                <FeatureCard
                  icon={<Palette className="h-10 w-10" />}
                  title="Theming"
                  description="Customizable themes with light and dark mode support."
                  href="/components"
                />
                <FeatureCard
                  icon={<Code className="h-10 w-10" />}
                  title="Developer Tools"
                  description="Utilities and hooks for faster development."
                  href="/components"
                />
                <FeatureCard
                  icon={<Settings className="h-10 w-10" />}
                  title="Configuration"
                  description="Easy configuration options for your application."
                  href="/dashboard"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Get Started?</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Explore our components, layouts, and examples to build your next project.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild>
                  <Link href="/components">Explore Components</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/auth/login">Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Next.js UI Component Library. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
          </div>
        </div>
      </footer> */}
    </>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  href: string
}

function FeatureCard({ icon, title, description, href }: FeatureCardProps) {
  return (
    <Card className="flex flex-col items-center text-center">
      <CardHeader>
        <div className="p-2 bg-primary/10 rounded-full mb-2 text-primary">{icon}</div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button variant="outline" asChild>
          <Link href={href}>
            Learn More <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
