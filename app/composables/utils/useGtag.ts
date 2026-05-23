type GtagCommand = 'event' | 'config' | 'set' | 'js'

export function useGtag() {
  function gtag(command: GtagCommand, ...args: unknown[]): void {
    if (typeof window === 'undefined') return
    if (typeof (window as any).gtag !== 'function') return
    ;(window as any).gtag(command, ...args)
  }
  return { gtag }
}
