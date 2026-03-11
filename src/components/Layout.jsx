import Header from './Header'
import Footer from './Footer'

function Layout({ children }) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 px-4 py-8 max-w-6xl mx-auto w-full">
                {children}
            </main>
            <Footer />
        </div>
    )
}

export default Layout
