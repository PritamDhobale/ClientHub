// pages/api/users/create.ts

import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // service key here
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method not allowed')

  const { email, password, full_name, role } = req.body

  // 1. Create Supabase Auth user
  const { data: user, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  })

  if (createUserError || !user?.user?.id) {
    return res.status(400).json({ error: createUserError?.message })
  }

  // 2. Insert into `users` table with role
  const { error: insertError } = await supabaseAdmin.from('users').insert({
    id: user.user.id,
    email,
    full_name,
    role
  })

  if (insertError) {
    return res.status(400).json({ error: insertError.message })
  }

  return res.status(200).json({ message: 'User created successfully', userId: user.user.id })
}
