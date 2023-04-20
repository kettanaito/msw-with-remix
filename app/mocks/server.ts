import { type RequestHandler } from 'msw'
import { type SetupServer, setupServer } from 'msw/node'

declare global {
  var __MSW_SERVER: SetupServer | undefined
}

export function startApiMocks(handlers: Array<RequestHandler>) {
  const persistedServer = globalThis.__MSW_SERVER

  if (typeof persistedServer !== 'undefined') {
    restart(persistedServer, handlers)
  } else {
    start(setup(handlers))
  }
}

function setup(handlers: Array<RequestHandler>) {
  const server = setupServer(...handlers)
  globalThis.__MSW_SERVER = server
  return server
}

function start(server: SetupServer) {
  server.listen()

  process.once('SIGTERM', () => server.close())
  process.once('SIGINT', () => server.close())
}

function restart(server: SetupServer, handlers: Array<RequestHandler>) {
  server.close()
  const nextServer = setup(handlers)
  start(nextServer)
}
