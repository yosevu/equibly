import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom';

function App() {
  return (
    <>
      <header className="flex flex-col items-center">
        <h1 className="text-xl">
          <Link to="/">equibly</Link>
        </h1>
      </header>
      <Outlet />
    </>
  )
}

export default App
