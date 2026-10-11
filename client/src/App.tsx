import { Route, Routes } from 'react-router-dom'
import { Dashboard } from '@/pages/Dashboard'
import { Workspace } from '@/pages/Workspace'
import { NotFound } from '@/pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/practice/:problemId" element={<Workspace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
