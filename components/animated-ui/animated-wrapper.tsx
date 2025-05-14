import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

export interface AnimatedWrapperProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
}

const AnimatedWrapper: React.FC<AnimatedWrapperProps> = ({
  children,
  className,
  ...motionProps
}) => {
  return (
    <motion.div className={className} {...motionProps}>
      {children}
    </motion.div>
  );
};

export default AnimatedWrapper;
