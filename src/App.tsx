import { LoginPage } from './pages/auth/LoginPage'

function App() {

  return (
    <div className="flex flex-col cols-1 gap-4 p-4">
      <h1 className="text-3xl font-bold">Hello, Vite + React!</h1>

      <div className='p-4'>
        <LoginPage />
      </div>

    </div>
  )
}

export default App
