import { Badge } from "../ui/badge";
import AnimatedWrapper from "./animated-wrapper";

type Status = "all" | "clean" | "flagged" | "blocked";

interface AnimatedBadgeProps {
  status: Status;
  statusFilter: Status;
  setStatusFilter: (status: Status) => void;
  label: string;
  activeClass: string;
  inactiveClass: string;
}


export const AnimatedBadge: React.FC<AnimatedBadgeProps> = ({
  status,
  statusFilter,
  setStatusFilter,
  label,
  activeClass,
  inactiveClass,
}) => {
  return (
    <AnimatedWrapper whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Badge
        onClick={() => setStatusFilter(status)}
        className={`cursor-pointer ${
          statusFilter === status ? activeClass : inactiveClass
        }`}
      >
        {label}
      </Badge>
    </AnimatedWrapper>
  );
};
