import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function NotFound() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist.</p>
      <Button asChild className="mt-6">
        <Link to="/">Back to all problems</Link>
      </Button>
    </div>
  )
}
