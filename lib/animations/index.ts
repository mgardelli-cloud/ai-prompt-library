/**
 * Ultra-modern animation system with Framer Motion
 * Smooth, minimal, and sophisticated animations
 */

import { Variants } from 'framer-motion'

// Easing curves for ultra-smooth animations
export const easings = {
  // Apple-inspired easing
  apple: [0.25, 0.1, 0.25, 1],
  // Google Material easing
  material: [0.4, 0, 0.2, 1],
  // Custom smooth easing
  smooth: [0.25, 0.46, 0.45, 0.94],
  // Bounce easing
  bounce: [0.68, -0.55, 0.265, 1.55],
  // Anticipate easing
  anticipate: [0.175, 0.885, 0.32, 1.275],
} as const

// Duration constants for consistent timing
export const durations = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  slower: 0.8,
} as const

// Stagger configurations
export const stagger = {
  fast: 0.05,
  normal: 0.1,
  slow: 0.15,
} as const

/**
 * Fade animations with smooth transitions
 */
export const fadeVariants: Variants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: durations.fast,
      ease: easings.smooth,
    },
  },
  visible: {
    opacity: 1,
    transition: {
      duration: durations.normal,
      ease: easings.smooth,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: durations.fast,
      ease: easings.smooth,
    },
  },
}

/**
 * Slide animations with momentum
 */
export const slideVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    transition: {
      duration: durations.fast,
      ease: easings.material,
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.normal,
      ease: easings.material,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: durations.fast,
      ease: easings.material,
    },
  },
}

/**
 * Scale animations with bounce
 */
export const scaleVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: durations.fast,
      ease: easings.smooth,
    },
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: durations.normal,
      ease: easings.smooth,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: durations.fast,
      ease: easings.smooth,
    },
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: durations.fast,
      ease: easings.smooth,
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
      ease: easings.smooth,
    },
  },
}

/**
 * Staggered container for child animations
 */
export const staggerContainer: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: stagger.normal,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: stagger.fast,
      staggerDirection: -1,
    },
  },
}

/**
 * Card hover animations with subtle lift
 */
export const cardVariants: Variants = {
  rest: {
    scale: 1,
    y: 0,
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    transition: {
      duration: durations.normal,
      ease: easings.smooth,
    },
  },
  hover: {
    scale: 1.02,
    y: -4,
    boxShadow: '0 10px 25px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    transition: {
      duration: durations.normal,
      ease: easings.smooth,
    },
  },
  tap: {
    scale: 0.98,
    y: 0,
    transition: {
      duration: 0.1,
      ease: easings.smooth,
    },
  },
}

/**
 * Button animations with micro-interactions
 */
export const buttonVariants: Variants = {
  rest: {
    scale: 1,
    transition: {
      duration: durations.fast,
      ease: easings.smooth,
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: durations.fast,
      ease: easings.smooth,
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
      ease: easings.smooth,
    },
  },
}

/**
 * Modal/Dialog animations with backdrop
 */
export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: durations.fast,
      ease: easings.material,
    },
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: durations.normal,
      ease: easings.material,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: {
      duration: durations.fast,
      ease: easings.material,
    },
  },
}

/**
 * Backdrop animations
 */
export const backdropVariants: Variants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: durations.fast,
    },
  },
  visible: {
    opacity: 1,
    transition: {
      duration: durations.normal,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: durations.fast,
    },
  },
}

/**
 * Loading animations
 */
export const loadingVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
}

/**
 * Pulse animation for loading states
 */
export const pulseVariants: Variants = {
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: easings.smooth,
    },
  },
}

/**
 * Text reveal animations
 */
export const textVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.normal,
      ease: easings.smooth,
    },
  },
}

/**
 * Menu animations with smooth reveal
 */
export const menuVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: {
      duration: durations.fast,
      ease: easings.material,
    },
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: durations.normal,
      ease: easings.material,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -5,
    transition: {
      duration: durations.fast,
      ease: easings.material,
    },
  },
}
