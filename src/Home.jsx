import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      <Link className="btn btn-primary" to="/new">New Split</Link>
    </main>
  )
}
