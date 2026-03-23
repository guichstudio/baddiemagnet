// Shared className constants — DRY across question components
export const optionBase =
  "border transition-all duration-200";

export const optionSelected =
  "border-pink-500/70 bg-pink-500/15 text-white shadow-[0_0_16px_rgba(236,72,153,0.15)]";

export const optionDefault =
  "border-white/[0.08] bg-white/[0.04] text-white/50 hover:border-white/20 hover:bg-white/[0.07] hover:text-white/70";

export function optionClass(isSelected) {
  return `${optionBase} ${isSelected ? optionSelected : optionDefault}`;
}