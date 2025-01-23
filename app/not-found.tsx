import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="hero min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h2 className="text-2xl font-semibold mt-2">Page Not Found</h2>
          <p className="py-4 text-gray-600">
            Sorry, we couldn't find the page you're looking for.
          </p>
          <Link href="/" className="btn btn-primary">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  )
}
