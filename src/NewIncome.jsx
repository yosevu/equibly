import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NewIncome({ addParty }) {
  const navigate = useNavigate();

  const [party, setParty] = useState({
    income: '',
  });

  const handleChange = ({ target }) => {
    setParty((values) => ({
      ...values,
      [target.name]: target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const { income } = party;

    // TODO create document id on client
    addParty({
      split: { id: 'EJdis9jpjFu0lgqz4wB6' },
      party: { id: 'c' },
      income,
    })
    .then((result) => {
      console.error('debug', result);
    })
    .catch((error) => {
      console.error(error);
    });

    navigate('/split', {
      replace: true,
    });
  };

  return (
    <main className="flex flex-col items-center">
      <form onSubmit={handleSubmit}>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Income</span>
          </label>
          <label className="input-group">
            <input
              id="income"
              name="income"
              type="text"
              value={party.income}
              onChange={handleChange}
              placeholder="50,000"
              className="input input-bordered"
              required
            />
            <span>USD</span>
          </label>
        </div>
        <button className="btn btn-primary my-5">Submit</button>
        {/* <Link className="btn btn-primary my-5" to="/split">Next</Link> */}
      </form>
    </main>
  )
}
