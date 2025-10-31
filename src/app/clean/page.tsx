// src/app/clean/page.tsx - Redirect to root
import { redirect } from 'next/navigation'

export default function CleanPage() {
  redirect('/')
}