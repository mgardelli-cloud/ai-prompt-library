/**
 * Animated UI components with Framer Motion
 * Ultra-smooth, minimal, and modern animations
 */

'use client'

import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion'
import { forwardRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import {
  fadeVariants,
  slideVariants,
  scaleVariants,
  cardVariants,
  buttonVariants,
  modalVariants,
  backdropVariants,
  staggerContainer,
  menuVariants,
} from '@/lib/animations'

// Base animated components
export const MotionDiv = motion.div
export const MotionButton = motion.button
export const MotionSpan = motion.span
export const MotionSection = motion.section
export const MotionArticle = motion.article

/**
 * Animated Container with stagger children
 */
interface AnimatedContainerProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  stagger?: boolean
  delay?: number
}

export const AnimatedContainer = forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({ children, stagger = false, delay = 0, className, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={className}
        variants={stagger ? staggerContainer : fadeVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ delay }}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)
AnimatedContainer.displayName = 'AnimatedContainer'

/**
 * Animated Card with hover effects
 */
interface AnimatedCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  hover?: boolean
}

export const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ children, hover = true, className, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn('cursor-pointer', className)}
        variants={cardVariants}
        initial="rest"
        animate="rest"
        whileHover={hover ? 'hover' : undefined}
        whileTap={hover ? 'tap' : undefined}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)
AnimatedCard.displayName = 'AnimatedCard'

/**
 * Animated Button with micro-interactions
 */
interface AnimatedButtonProps extends HTMLMotionProps<'button'> {
  children: ReactNode
  variant?: 'default' | 'subtle'
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ children, variant = 'default', className, ...props }, ref) => {
    const scaleAmount = variant === 'subtle' ? 1.02 : 1.05

    return (
      <motion.button
        ref={ref}
        className={className}
        variants={buttonVariants}
        initial="rest"
        animate="rest"
        whileHover={{ scale: scaleAmount }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
        {...props}
      >
        {children}
      </motion.button>
    )
  }
)
AnimatedButton.displayName = 'AnimatedButton'

/**
 * Animated Modal/Dialog
 */
interface AnimatedModalProps {
  children: ReactNode
  isOpen: boolean
  onClose?: () => void
  className?: string
}

export const AnimatedModal = ({ children, isOpen, onClose, className }: AnimatedModalProps) => {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              className={cn(
                'bg-background border border-border rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-auto',
                className
              )}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

/**
 * Animated Menu/Dropdown
 */
interface AnimatedMenuProps {
  children: ReactNode
  isOpen: boolean
  className?: string
}

export const AnimatedMenu = ({ children, isOpen, className }: AnimatedMenuProps) => {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className={cn(
            'absolute z-50 bg-background border border-border rounded-lg shadow-xl',
            className
          )}
          variants={menuVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Animated List Item with slide-in
 */
interface AnimatedListItemProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  index?: number
}

export const AnimatedListItem = forwardRef<HTMLDivElement, AnimatedListItemProps>(
  ({ children, index = 0, className, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={className}
        variants={slideVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ delay: index * 0.1 }}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)
AnimatedListItem.displayName = 'AnimatedListItem'

/**
 * Animated Text with reveal effect
 */
interface AnimatedTextProps extends HTMLMotionProps<'span'> {
  children: ReactNode
  delay?: number
}

export const AnimatedText = forwardRef<HTMLSpanElement, AnimatedTextProps>(
  ({ children, delay = 0, className, ...props }, ref) => {
    return (
      <motion.span
        ref={ref}
        className={className}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        {...props}
      >
        {children}
      </motion.span>
    )
  }
)
AnimatedText.displayName = 'AnimatedText'

/**
 * Animated Loading Spinner
 */
interface AnimatedSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const AnimatedSpinner = ({ size = 'md', className }: AnimatedSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  return (
    <motion.div
      className={cn(
        'border-2 border-muted border-t-primary rounded-full',
        sizeClasses[size],
        className
      )}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  )
}

/**
 * Animated Progress Bar
 */
interface AnimatedProgressProps {
  progress: number
  className?: string
}

export const AnimatedProgress = ({ progress, className }: AnimatedProgressProps) => {
  return (
    <div className={cn('w-full bg-muted rounded-full h-2', className)}>
      <motion.div
        className="bg-primary h-2 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
    </div>
  )
}

/**
 * Animated Badge with scale effect
 */
interface AnimatedBadgeProps extends HTMLMotionProps<'span'> {
  children: ReactNode
  variant?: 'default' | 'secondary' | 'outline'
}

export const AnimatedBadge = forwardRef<HTMLSpanElement, AnimatedBadgeProps>(
  ({ children, variant = 'default', className, ...props }, ref) => {
    return (
      <motion.span
        ref={ref}
        className={className}
        variants={scaleVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        whileTap="tap"
        {...props}
      >
        {children}
      </motion.span>
    )
  }
)
AnimatedBadge.displayName = 'AnimatedBadge'
