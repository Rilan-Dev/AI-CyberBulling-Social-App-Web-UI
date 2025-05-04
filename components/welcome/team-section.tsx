import { TeamMember } from "./team-member"

export function TeamSection() {
  const team = [
    {
      name: "Latha. S",
      id: "21TD0715",
      role: "Team Member",
      contribution: "NLP Implementation & Text Analysis",
    },
    {
      name: "Nandhini. S",
      id: "21TD0720",
      role: "Team Member",
      contribution: "Neural Network Architecture & Training",
    },
    {
      name: "Raafiya Tabassum. Z",
      id: "21TD0723",
      role: "Team Member",
      contribution: "Image Analysis & Frontend Development",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
      {team.map((member, index) => (
        <TeamMember
          key={index}
          name={member.name}
          id={member.id}
          role={member.role}
          contribution={member.contribution}
          delay={index}
        />
      ))}

      <div className="md:col-span-3 mt-8 text-center">
        <p className="text-gray-400">
          Under the guidance of <span className="text-blue-400 font-medium">Mrs. P. Chandini, M.Tech(DCS)</span>
          <br />
          <span className="text-sm">Assistant Professor, Department of Computer Science and Engineering</span>
        </p>
      </div>
    </div>
  )
}
