import Header from './Header'
import Footer from './Footer'

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-lb-bg">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout
