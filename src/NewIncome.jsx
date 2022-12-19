
import { Link } from 'react-router-dom'

export default function NewIncome() {
  return (
    <main className="flex flex-col items-center">
     <div className="form-control">
        <label className="label">
          <span className="label-text">Income</span>
        </label>
        <label className="input-group">
          <input type="text" placeholder="50,000" className="input input-bordered" />
          <span>USD</span>
        </label>
      </div>
      <Link className="btn btn-primary my-5" to="/result">Next</Link>
    </main>
  )
}
