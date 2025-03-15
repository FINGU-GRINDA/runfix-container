import { redirect } from "next/navigation"

export default function HomePage() {
  // In a real app, you would:
  // 1. Check if user is authenticated
  // 2. Get the user's default organization or first organization
  // 3. Redirect to that organization's dashboard

  // For now, we'll just redirect to a mock organization
  const defaultOrganizationId = "acme-corp"
  redirect(`/organizations/${defaultOrganizationId}`)
}

