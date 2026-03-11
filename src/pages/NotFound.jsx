import { Link } from 'react-router-dom'
import Button from '../components/Button'

function NotFound() {
    return (
        <div className="text-center py-12 flex flex-col items-center justify-center min-h-96">
            <h1 className="text-9xl font-black text-indigo-600">404</h1>
            <h2 className="text-4xl font-bold my-4 text-gray-900">Page Not Found</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-md">
                Sorry, the page you are looking for does not exist.
            </p>
            <Link to="/">
                <Button variant="primary" size="large">
                    Go Home
                </Button>
            </Link>
        </div>
    )
}

export default NotFound
