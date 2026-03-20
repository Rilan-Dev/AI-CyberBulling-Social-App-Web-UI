"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function TeamShowcase() {
  const team = [
    {
      name: "Latha S",
      role: "Team Member",
      id: "21TD0715",
      initials: "LS",
    },
    {
      name: "Nandhini S",
      role: "Team Member",
      id: "21TD0720",
      initials: "NS",
    },
    {
      name: "Raafiya Tabassum Z",
      role: "Team Member",
      id: "21TD0723",
      initials: "RT",
    },
    {
      name: "Mrs. P. Chandini",
      role: "Project Guide",
      id: "M.Tech(DCS) - AP/CSE",
      initials: "PC",
    },
  ]

  return (
    <div className="py-12 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight mb-2">Meet Our Team</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          The dedicated individuals behind the Cyberbullying Prediction AI project.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarFallback className="bg-primary text-primary-foreground">{member.initials}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                  <p className="text-muted-foreground text-sm mb-1">{member.role}</p>
                  <p className="text-xs text-muted-foreground">{member.id}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
