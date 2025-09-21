import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import Appointments from './pages/Appointments'
import Messages from './pages/Messages'
import Forum from './pages/Forum'
import Resources from './pages/Resources'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'
import PrivateRoute from './pages/PrivateRoute'
import Signup from './pages/Signup'
import Login from './pages/Login'

const queryClient = new QueryClient()

function AppRoutes () {
  const location = useLocation()

  // Hide sidebar/layout for these routes
  const authPaths = ['/signup', '/login']
  const isAuthPage = authPaths.includes(location.pathname)

  if (isAuthPage) {
    return (
      <Routes>
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    )
  }

  return (
    <Layout>
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/appointments' element={<Appointments />} />
        <Route path='/messages' element={<Messages />} />
        <Route path='/forum' element={<Forum />} />
        <Route path='/resources' element={<Resources />} />
        <Route path='/settings' element={<Settings />} />

        {/* Admin Dashboard - Protected */}
        <Route
          path='/admin'
          element={
            <PrivateRoute role='admin'>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        {/* Catch-all 404 route */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Layout>
  )
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
