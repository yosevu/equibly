
import { useState } from 'react';
import { useLocation } from 'react-router-dom'
import { doc, onSnapshot } from 'firebase/firestore';

export default function SplitProportion({ db }) {
  const [amount, setAmount] = useState('');
  const location = useLocation();
  const { splitId, partyId } = location.state;

  // TODO Look into using custom party id for retrieving amount
  const partySub = (splitId) => {
    const unsub = onSnapshot(doc(db, 'splits', splitId), (doc) => {
      console.log('debug', doc.data())
      
      const party = doc.data().parties[partyId];

      if (party?.amount) {
        // Decrypt

        setAmount(party?.amount.toFixed(2))
        // removeSplit(splitId);
        // unsub();
      }
    });
  
    return unsub;
  };

  partySub(splitId);  

  return (
    <main className="flex flex-col items-center">
      <span>Split:</span>
      <span className="font-bold text-2xl">{amount}</span>
    </main>
  )
}
