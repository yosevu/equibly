import { Link, useLocation } from 'react-router-dom'
// import { customAlphabet } from 'nanoid'

const baseURL = import.meta.env['BASE_URL']
// const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 6)

export default function NewLink() {
  const { state } = useLocation();
  const { split } = state

  return (
    <main className="flex flex-col items-center">
      Share this code:
      <br/>
      <span className="text-2xl font-bold">{split.id}</span>
      {/* <span className="text-2xl font-bold">{`${nanoid()}`}</span> */}
      <Link className="btn btn-primary my-5" to="/income">Next</Link>
    </main>
  )
}
