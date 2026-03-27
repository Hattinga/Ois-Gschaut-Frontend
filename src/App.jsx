import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { UserProvider } from './contexts/UserContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Films from './pages/Films'
import FilmDetail from './pages/FilmDetail'
import Lists from './pages/Lists'
import ListDetail from './pages/ListDetail'
import Profile from './pages/Profile'
import AccountSettings from './pages/AccountSettings'
import NotFound from './pages/NotFound'

function App() {
  return (
    <UserProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Layout>
          <Routes>
            <Route path="/"          element={<Home />} />
            <Route path="/films"     element={<Films />} />
            <Route path="/films/:id" element={<FilmDetail />} />
            <Route path="/lists"     element={<Lists />} />
            <Route path="/lists/:id"  element={<ListDetail />} />
            <Route path="/users/:id" element={<Profile />} />
            <Route path="/settings"  element={<AccountSettings />} />
            <Route path="*"          element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </UserProvider>
  )
}

export default App
