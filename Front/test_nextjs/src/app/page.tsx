'use client'
import { Main } from '@/Components/Home';
import { ProtectedRoute } from '@/Components/ProtectedRoute';
import { signIn, useSession } from 'next-auth/react';

export default async function Home() {
  return (
    <ProtectedRoute>
      <Main />
    </ProtectedRoute>
  )
}

// Dashboard.auth = true;
// agora, o nextjs sabe que essa página precisa de autenticação