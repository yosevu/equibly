import { useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';

export default function SplitProportion({ db }) {
  const [amount, setAmount] = useState('');

  const partySub = (id) => {
    const unsub = onSnapshot(doc(db, 'splits', id), (doc) => {
      const party = doc.data().parties[0];

      if (party.amount) {
        setAmount(party.amount.toFixed(2))
      }
    });
  
    return unsub;
  };
  // story party data separately to only get relevant party data
  partySub('EJdis9jpjFu0lgqz4wB6');

  return (
    <main className="flex flex-col items-center">
      <span>Split:</span>
      <span className="font-bold text-2xl">{amount} {amount && 'USD'}</span>
    </main>
  )
}
