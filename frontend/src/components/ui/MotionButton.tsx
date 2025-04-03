import {
  AnimationControls,
  motion,
  TargetAndTransition,
  Transition,
  VariantLabels,
} from "motion/react";
import { MouseEventHandler } from "react";

type MotionButtonProps = {
  id?: string;
  className?: string;
  title?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  initial?: boolean | VariantLabels | TargetAndTransition;
  exit?: VariantLabels | TargetAndTransition;
  animate?: boolean | VariantLabels | TargetAndTransition | AnimationControls;
  transition?: Transition;
  disableAnimation?: boolean;
  layout?: boolean | "position" | "size" | "preserve-aspect";
};

function MotionButton({
  id,
  className,
  title,
  onClick,
  children,
  type = "button",
  initial,
  exit,
  animate,
  transition,
  disableAnimation,
  layout,
}: MotionButtonProps) {
  if (disableAnimation) {
    return (
      <button
        id={id}
        className={className}
        title={title}
        onClick={onClick}
        type={type}
      >
        {children}
      </button>
    );
  } else {
    return (
      <motion.button
        id={id}
        className={className}
        title={title}
        onClick={onClick}
        type={type}
        whileHover={{
          scale: 1.08,
          transition: { duration: 0.15 },
        }}
        whileTap={{
          scale: 0.92,
          transition: { duration: 0.15 },
        }}
        initial={initial}
        exit={exit}
        animate={animate}
        transition={transition}
        layout={layout}
      >
        {children}
      </motion.button>
    );
  }
}

export default MotionButton;
