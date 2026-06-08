import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { AuthProvider, useAuth } from './hooks/useAuth.jsx'
import { AppProvider } from './context/AppContext.jsx'

const Landing = lazy(() => import('./pages/Landing.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))
const Register = lazy(() => import('./pages/Register.jsx'))
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'))
const Settings = lazy(() => import('./pages/Settings.jsx'))
const Scan = lazy(() => import('./pages/Scan.jsx'))
const Records = lazy(() => import('./pages/Records.jsx'))
const Classes = lazy(() => import('./pages/Classes.jsx'))
const Students = lazy(() => import('./pages/Students.jsx'))
const Books = lazy(() => import('./pages/Books.jsx'))
const ClassDetail = lazy(() => import('./pages/ClassDetail.jsx'))
const QRPrint = lazy(() => import('./pages/QRPrint.jsx'))
const Privacy = lazy(() => import('./pages/Privacy.jsx'))
const Donate = lazy(() => import('./pages/Donate.jsx'))

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading-screen">Memuatkan...</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading-screen">Memuatkan...</div>
  if (user) return <Navigate to="/dashboard" replace />
  return children
}

function AppRoutes() {
  return (
    <Suspense fallback={<div className="loading-screen">Memuatkan...</div>}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/scan" element={<ProtectedRoute><Scan /></ProtectedRoute>} />
        <Route path="/records" element={<ProtectedRoute><Records /></ProtectedRoute>} />
        <Route path="/classes" element={<ProtectedRoute><Classes /></ProtectedRoute>} />
        <Route path="/students" element={<ProtectedRoute><Students /></ProtectedRoute>} />
        <Route path="/books" element={<ProtectedRoute><Books /></ProtectedRoute>} />
        <Route path="/class/:classId" element={<ProtectedRoute><ClassDetail /></ProtectedRoute>} />
        <Route path="/qr-print" element={<ProtectedRoute><QRPrint /></ProtectedRoute>} />
        <Route path="/settings/privacy" element={<ProtectedRoute><Privacy /></ProtectedRoute>} />
        <Route path="/settings/donate" element={<ProtectedRoute><Donate /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
