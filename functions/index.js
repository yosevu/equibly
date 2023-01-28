const functions = require('firebase-functions')
const CryptoJS = require('crypto-js');

function decrypt(ciphertext, key) {
  const bytes  = CryptoJS.AES.decrypt(ciphertext, key);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);

  return originalText;
}

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp()

exports.addSplit = functions.https.onCall(async (data, context) => {
  const { id, amount, partyCount } = data;

  await admin
    .firestore()
    .collection('splits')
    .doc(id)
    .set({ amount, partyCount: parseInt(partyCount), parties: {} });

  return id;
});

// TODO rename to createSplit
exports.addParty = functions.https.onCall(async (data, context) => {
  const { splitId, partyId, income } = data; 

  const documentRef = await admin
    .firestore()
    .collection('splits')
    .doc(splitId)

  documentRef.get().then((snap) => {
    if (snap.exists) {
      const { parties } = snap.data();

      documentRef.update({
        parties: {
          ...parties,
          [partyId]: { id: partyId, income }
        }
      });
    }
  });

  return 'Added party.';
});

// TODO rename parties to incomes
function calculateSplit(total, parties) {
  const incomesTotal = Object.values(parties)
    .reduce((partial, party) => {
      const income = decrypt(party.income, party.id);

      functions.logger.log('debug income', income)

      return partial + parseInt(income, 10);
    }, 0);
  
 
  // Omit income
  const result = Object.entries(parties).reduce((result, [key, value]) => {    
    const amount = total * (value.income / incomesTotal);

    // Encrypt

    return {
      ...result,
      [key]: {
        id: value.id,
        amount,
      }
    };
  }, {});

  return result;
};

exports.updateSplit = functions.firestore
  .document('/splits/{documentId}')
  .onUpdate(async (change, context) => {
    const documentId = context.params.documentId;
    const { amount, parties, partyCount } = change.after.data();

    if (Object.keys(parties).length === partyCount) {
      const result = calculateSplit(amount, parties);

      const documentRef = await admin
        .firestore()
        .collection('splits')
        .doc(documentId);
      
      documentRef.get().then((snap) => {
        // Use complete to prevent further updates
        if (snap.exists && !snap.data().complete) {
          documentRef.update({
            parties: result,
            complete: true,
          });
        }
      });
    }

    return null;
  });

// exports.removeSplit = functions.https.onCall(async (data, context) => {
//   const { id } = data;

//   const res = await admin
//     .firestore()
//     .collection('splits')
//     .doc(id)
//     // .delete()
  
//   functions.logger.log('debug', res)

//   return id;
// });

