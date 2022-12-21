
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { customAlphabet } from 'nanoid'

export default function NewSplit({ addSplit }) { 
  const navigate = useNavigate();

  const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 6)

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
    const id = nanoid();

    addSplit({ id, amount, partyCount })
      .then((result) => {
      })
      .catch((error) => {
        console.error(error);
      });

    navigate('/link', {
      replace: true,
      state: { id }
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
