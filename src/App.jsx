import { RouterProvider } from 'react-router-dom'
import router from './Routes.jsx'  // Make sure this path matches where your Routes.jsx file is located
import './App.css'

function App() {
  return <RouterProvider router={router} />
}

export default App