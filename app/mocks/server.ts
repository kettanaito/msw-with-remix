/**
 * Absolutely phenomenal setup from @cliffordfajardo.
 * @see https://github.com/cliffordfajardo/remix-msw-node-with-playwright/blob/33d97bdaf40d091dcece53cc4a4fd7cb43c4a94a/app/msw-server.ts
 */
import { type RequestHandler } from 'msw'
import { type SetupServer, setupServer } from 'msw/node'

declare global {
  var __MSW_SERVER: SetupServer | undefined
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
  start(setup(handlers))
}

export function startApiMocks(handlers: Array<RequestHandler>) {
  const persistedServer = globalThis.__MSW_SERVER

  if (typeof persistedServer !== 'undefined') {
    restart(persistedServer, handlers)
  } else {
    start(setup(handlers))
  }
}
