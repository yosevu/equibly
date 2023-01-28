import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { customAlphabet } from 'nanoid'
import CryptoJS from 'crypto-js';

function encrypt(text, key) {
  const ciphertext = CryptoJS.AES.encrypt(text, key).toString();

  return ciphertext;
}

// TODO rename to NewParty
export default function NewIncome({ addParty }) {
  const navigate = useNavigate();
  const [ searchParams ] = useSearchParams();
  const code = searchParams.get('code');

  const [party, setParty] = useState({
    code,
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

    const { code, income } = party;
    const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 6)
    const partyId = nanoid();

    const encryptedIncome = encrypt(income, partyId);
    console.log('debug enc', encryptedIncome)
    
    addParty({
      splitId: code,
      partyId,
      income: encryptedIncome,
    })
    .then((result) => {
    })
    .catch((error) => {
      console.error(error);
    });

    navigate('/split', {
      replace: true,
      state: { splitId: code, partyId },
    });
  };

  return (
    <main className="flex flex-col items-center">
      <form onSubmit={handleSubmit}>
        {/* TODO remove, no need for this field if code is passed in url
                 grab code form the url in shared link and next button cases
         */}
        {/* <div className="form-control">
          <label className="label">
            <span className="label-text">Split code</span>
          </label>
          <label className="input-group">
            <input
              id="code"
              name="code"
              type="text"
              value={code}
              onChange={handleChange}
              className="input input-bordered"
              required
            />
          </label>
        </div> */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Annual income</span>
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
