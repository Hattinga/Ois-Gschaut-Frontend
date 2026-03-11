import { useEffect, useState } from 'react'
import Button from '../components/Button'

function Home() {
    const [message, setMessage] = useState('')

    useEffect(() => {
        setMessage('Welcome to Ois Gschaut')
    }, [])

    return (
        <div className="animate-fadeIn">
            <section className="text-center py-12 mb-12">
                <h1 className="text-5xl font-bold mb-4 text-indigo-600">{message}</h1>
                <p className="text-xl text-gray-600">This is your React frontend application</p>
            </section>

            <section className="bg-gray-50 p-8 rounded-lg mb-12">
                <h2 className="text-3xl font-bold mb-6 text-indigo-600">Features</h2>
                <ul className="list-none p-0 m-0 space-y-2">
                    <li className="pl-6 relative text-gray-700">
                        <span className="absolute left-0 text-emerald-600 font-bold text-xl">✓</span>
                        Modern React 18 setup
                    </li>
                    <li className="pl-6 relative text-gray-700">
                        <span className="absolute left-0 text-emerald-600 font-bold text-xl">✓</span>
                        Vite for fast development
                    </li>
                    <li className="pl-6 relative text-gray-700">
                        <span className="absolute left-0 text-emerald-600 font-bold text-xl">✓</span>
                        React Router for navigation
                    </li>
                    <li className="pl-6 relative text-gray-700">
                        <span className="absolute left-0 text-emerald-600 font-bold text-xl">✓</span>
                        Tailwind CSS for styling
                    </li>
                    <li className="pl-6 relative text-gray-700">
                        <span className="absolute left-0 text-emerald-600 font-bold text-xl">✓</span>
                        Professional project structure
                    </li>
                </ul>
            </section>

            <section className="text-center py-8">
                <Button variant="primary" size="large">
                    Get Started
                </Button>
            </section>
        </div>
    )
}

export default Home
