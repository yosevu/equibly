
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NewSplit({ addSplit }) { 
  const navigate = useNavigate();

  const [split, setSplit] = useState({
    amount: '',
    partyCount: '',
  });

  const handleChange = ({ target }) => {
    setSplit((values) => ({
      ...values,
      [target.name]: target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const { amount, partyCount } = split;

    // TODO create document id on client
    addSplit({ amount, partyCount })
      .then((result) => {
        navigate('/link', {
          replace: true,
          state: { split: { id: 'id' }},
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <main className="flex flex-col items-center">
      <form onSubmit={handleSubmit}>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Number of Parties</span>
          </label>
          <label className="input-group">
            <input
              id="partyCount"
              className="input input-bordered"
              type="text"
              name="partyCount"
              value={split.partyCount}
              onChange={handleChange}
              placeholder="3"
              required
            />
            <span>Parties</span>
          </label>
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Amount</span>
          </label>
          <label className="input-group">
            <input
              id="amount"
              className="input input-bordered"
              type="text"
              name="amount"
              value={split.amount}
              onChange={handleChange}
              placeholder="100"
              required
            />
            <span>USD</span>
          </label>
        </div>
        <button className="btn btn-primary my-5 w-full" type="submit">Create split</button>
      </form>
    </main>
  )
}
