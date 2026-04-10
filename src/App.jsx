import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { UserProvider } from './contexts/UserContext'
import { ToastProvider } from './contexts/ToastContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Films from './pages/Films'
import FilmDetail from './pages/FilmDetail'
import Lists from './pages/Lists'
import ListDetail from './pages/ListDetail'
import Profile from './pages/Profile'
import Users from './pages/Users'
import AccountSettings from './pages/AccountSettings'
import AuthCallback from './pages/AuthCallback'
import NotFound from './pages/NotFound'

function App() {
  return (
    <UserProvider>
      <ToastProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Layout>
            <Routes>
              <Route path="/"          element={<Home />} />
              <Route path="/films"     element={<Films />} />
              <Route path="/films/:id" element={<FilmDetail />} />
              <Route path="/lists"     element={<Lists />} />
              <Route path="/lists/:id" element={<ListDetail />} />
              <Route path="/users"     element={<Users />} />
              <Route path="/users/:id" element={<Profile />} />
              <Route path="/settings"      element={<AccountSettings />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="*"              element={<NotFound />} />
            </Routes>
          </Layout>
        </Router>
      </ToastProvider>
    </UserProvider>
  )
}

export default App
