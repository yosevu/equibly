
import { Link } from 'react-router-dom';

export default function NewSplit() {
  return (
    <main className="flex flex-col items-center">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Number of People</span>
        </label>
        <label className="input-group">
          <input type="text" placeholder="3" className="input input-bordered" />
          <span>People</span>
        </label>
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Amount</span>
        </label>
        <label className="input-group">
          <input type="text" placeholder="100" className="input input-bordered" />
          <span>USD</span>
        </label>
      </div>
      <Link className="btn btn-primary my-5" to="/link">Next</Link>

    </main>
  )
}
