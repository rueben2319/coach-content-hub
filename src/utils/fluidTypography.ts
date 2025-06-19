
// Fluid typography utilities for desktop-first design
export const calculateFluidSize = (
  minSize: number,
  maxSize: number,
  minViewport: number = 1024,
  maxViewport: number = 1920
): string => {
  const slope = (maxSize - minSize) / (maxViewport - minViewport);
  const intersection = minSize - slope * minViewport;
  
  return `clamp(${minSize}px, ${intersection}px + ${slope * 100}vw, ${maxSize}px)`;
};

export const fluidScale = {
  xs: calculateFluidSize(12, 14),
  sm: calculateFluidSize(14, 16),
  base: calculateFluidSize(16, 18),
  lg: calculateFluidSize(18, 22),
  xl: calculateFluidSize(20, 26),
  '2xl': calculateFluidSize(24, 32),
  '3xl': calculateFluidSize(30, 42),
  '4xl': calculateFluidSize(36, 56),
  '5xl': calculateFluidSize(48, 72),
};

export const fluidSpacing = {
  xs: calculateFluidSize(4, 6),
  sm: calculateFluidSize(8, 12),
  md: calculateFluidSize(16, 24),
  lg: calculateFluidSize(24, 36),
  xl: calculateFluidSize(32, 48),
  '2xl': calculateFluidSize(48, 72),
  '3xl': calculateFluidSize(64, 96),
};
