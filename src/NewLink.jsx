import { Link, useLocation } from 'react-router-dom'

export default function NewLink() {
  const location = useLocation();

  const id = location.state?.id;

  const code = id ? id : searchParams.get('code');

  return (
    <main className="flex flex-col items-center">
      Share this link:
      <br/>
      <Link
        to={`/income?code=${code}`}
        className="text-2xl font-bold underline hover:no-underline"
        target="_blank"
      >
        {id}
      </Link>
      <Link className="btn btn-primary my-5" to={`/income?code=${code}`}>Next</Link>
    </main>
  )
}
