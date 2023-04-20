import { useEffect, useState } from 'react'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { Form, useLoaderData, type V2_MetaFunction } from '@remix-run/react'

export const meta: V2_MetaFunction = () => {
  return [{ title: 'Remix + MSW' }]
}

export const loader: LoaderFunction = async () => {
  // Example of the server-side request.
  const user = await fetch('https://example.com/user').then((res) => res.json())

  return {
    user,
  }
}

export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData()
  console.log('Remix: Action', data.get('email'))
  return null
}

export default function Index() {
  const { user } = useLoaderData()
  const [data, setData] = useState<string>()

  useEffect(() => {
    // Example of a client-side request.
    fetch('/greeting')
      .then((res) => res.text())
      .then(setData)
  }, [])

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
      <h1>Welcome, {user?.name}</h1>
      <p>Fetched on the client: {data}</p>
      <Form method="post">
        <input name="email" defaultValue="user@domain.com" />
        <button type="submit">Submit</button>
      </Form>
    </div>
  )
}
