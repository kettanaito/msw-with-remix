import { rest } from 'msw'

export const handlers = [
  rest.get('/greeting', (req, res, ctx) => {
    return res(ctx.text('Hello world!'))
  }),
  rest.get('https://example.com/user', (req, res, ctx) => {
    return res(ctx.json({ name: 'John' }))
  }),
]
