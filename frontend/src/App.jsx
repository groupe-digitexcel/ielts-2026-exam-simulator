import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

import Home        from './pages/Home'
import Login       from './pages/Login'
import Register    from './pages/Register'
import Dashboard   from './pages/Dashboard'
import Generate    from './pages/Generate'
import ExamPage    from './pages/ExamPage'
import Results     from './pages/Results'
import Pricing     from './pages/Pricing'
import Admin       from './pages/Admin'
import NotFound    from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"               element={<Home />} />
        <Route path="/login"          element={<Login />} />
        <Route path="/register"       element={<Register />} />
        <Route path="/pricing"        element={<Pricing />} />

        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/exam/generate" element={
          <ProtectedRoute><Generate /></ProtectedRoute>
        } />
        <Route path="/exam/:id" element={
          <ProtectedRoute><ExamPage /></ProtectedRoute>
        } />
        <Route path="/exam/:id/results" element={
          <ProtectedRoute><Results /></ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute adminOnly><Admin /></ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
