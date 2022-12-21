const functions = require('firebase-functions')

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
  const { amount, partyCount } = data;

  const writeResult = await admin
    .firestore()
    .collection('splits')
    .add({ amount, partyCount: parseInt(partyCount), parties: [] });

  return { split: { id: writeResult._path.segments[1] } }; 
});

// TODO rename to createSplit
exports.addParty = functions.https.onCall(async (data, context) => {
  const { split, party, income } = data; 

  const documentRef = await admin
    .firestore()
    .collection('splits')
    .doc(split.id)

  documentRef.get().then((snap) => {
    if (snap.exists) {
      const { parties } = snap.data();

      parties.push({ id: party.id, income: parseInt(income) });
      documentRef.update({ parties });
    }
  });

  return 'Added party.';
});

// TODO rename parties to incomes
function calculateSplit(amount, parties) {
  const incomesTotal = parties.reduce((total, party) => total + party.income, 0);
  functions.logger.log(incomesTotal)
  
  functions.logger.log('debug incomesTotal', incomesTotal);
  
  const result = parties.map((party) => ({
    ...party,
    amount: amount * (party.income / incomesTotal)
  }));

  functions.logger.log('debug result', result);

  return result;
};

exports.updateSplit = functions.firestore
  .document('/splits/{documentId}')
  .onUpdate(async (change, context) => {
    const documentId = context.params.documentId;
    const { amount, parties, partyCount } = change.after.data();

    if (parties.length === partyCount) {
      const result = calculateSplit(amount, parties);

      const documentRef = await admin
        .firestore()
        .collection('splits')
        .doc(documentId);
      
      documentRef.get().then((snap) => {
        if (snap.exists) {
          documentRef.update({ parties: result });
        }
      });
    }

    return null;
  });
