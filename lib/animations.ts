// Reusable Framer Motion animation variants for Follicia Admin Panel

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export const fadeInLeft = {
  hidden: { opacity: 0, x: -50 },
  show: { opacity: 1, x: 0 },
};

export const fadeInRight = {
  hidden: { opacity: 0, x: 50 },
  show: { opacity: 1, x: 0 },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1 },
};

export const magneticHover = {
  scale: 1.05,
  transition: { type: "spring", stiffness: 400, damping: 25 },
};

export const hapticTap = {
  scale: 0.95,
  transition: { duration: 0.1 },
};

export const pulseAnimation = {
  boxShadow: [
    "0 0 0 0 rgba(42, 157, 143, 0.4)",
    "0 0 0 8px rgba(42, 157, 143, 0)",
  ],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

export const slideUpStagger = (index: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: index * 0.05, duration: 0.3 },
});
