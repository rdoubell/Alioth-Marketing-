import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './AppRoutes'
import SplashScreen from './components/SplashScreen'

export default function App() {
  return (
    <BrowserRouter>
      <SplashScreen />
      <AppRoutes />
    </BrowserRouter>
  )
}
