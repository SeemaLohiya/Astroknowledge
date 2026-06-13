/** Keep the current value visible in filtered <select> lists. */
export function withSelectedOption(options: string[], selected: string): string[] {
  if (!selected || options.includes(selected)) return options;
  return [selected, ...options];
}
