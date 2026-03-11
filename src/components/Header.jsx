import { Link } from 'react-router-dom'

function Header() {
    return (
        <header className="sticky top-0 z-100 bg-indigo-600 text-white shadow-md">
            <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="hover:text-gray-100 transition-colors">
                    <h1 className="text-2xl font-bold m-0">Ois Gschaut</h1>
                </Link>
                <nav className="flex gap-8 items-center">
                    <Link to="/" className="font-medium hover:text-gray-100 transition-colors pb-1 border-b-2 border-transparent hover:border-gray-100">
                        Home
                    </Link>
                </nav>
            </div>
        </header>
    )
}

export default Header
