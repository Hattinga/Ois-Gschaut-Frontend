function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-gray-800 text-white py-8 px-4 border-t border-gray-700 mt-auto">
            <div className="max-w-6xl mx-auto flex justify-between items-center gap-8 flex-col md:flex-row">
                <p className="text-gray-300 m-0">
                    &copy; {currentYear} Ois Gschaut. All rights reserved.
                </p>
                <nav className="flex gap-8">
                    <a href="#" className="text-gray-300 font-medium hover:text-white transition-colors">
                        Privacy
                    </a>
                    <a href="#" className="text-gray-300 font-medium hover:text-white transition-colors">
                        Terms
                    </a>
                    <a href="#" className="text-gray-300 font-medium hover:text-white transition-colors">
                        Contact
                    </a>
                </nav>
            </div>
        </footer>
    )
}

export default Footer
