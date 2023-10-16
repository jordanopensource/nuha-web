export default function(): number {
  if (typeof window === 'object') {
    return window.outerWidth;
  }
  return 0
}
