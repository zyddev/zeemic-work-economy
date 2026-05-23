export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const noop = { on: () => {}, off: () => {}, emit: () => {}, connect: () => {}, disconnect: () => {} }
  let socket: any = noop

  async function connect() {
    const baseUrl = config.public.appUrl || window.location.origin
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      const mod = await import('socket.io-client')
      const io = mod.io ?? mod.default
      if (typeof io === 'function') {
        socket = io(baseUrl, { autoConnect: true, withCredentials: true, transports: ['websocket', 'polling'] })
      }
    } catch {
      // socket.io-client not installed — messaging degrades to REST polling
    }
  }

  return {
    provide: {
      socket: { get: () => socket, connect },
    },
  }
})
