const functions = require('firebase-functions')

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin')
admin.initializeApp()

// Take the text parameter passed to this HTTP endpoint and insert it into
// Firestore under the path /messages/:documentId/original
exports.addMessage = functions.https.onRequest(async (req, res) => {
  // Grab the text parameter.
  const original = req.query.text
  // Push the new message into Firestore using the Firebase Admin SDK.
  const writeResult = await admin
    .firestore()
    .collection('messages')
    .add({ original: original })
  // Send back a message that we've successfully written the message
  res.json({ result: `Message with ID: ${writeResult.id} added.` })
})

// Listens for new messages added to /messages/:documentId/original and creates an
// uppercase version of the message to /messages/:documentId/uppercase
exports.makeUppercase = functions.firestore
  .document('/messages/{documentId}')
  .onCreate((snap, context) => {
    // Grab the current value of what was written to Firestore.
    const original = snap.data().original

    // Access the parameter `{documentId}` with `context.params`
    functions.logger.log('Uppercasing', context.params.documentId, original)

    const uppercase = original.toUpperCase()

    // You must return a Promise when performing asynchronous tasks inside a Functions such as
    // writing to Firestore.
    // Setting an 'uppercase' field in Firestore document returns a Promise.
    return snap.ref.set({ uppercase }, { merge: true })
  })

exports.addSplit = functions.https.onRequest(async (req, res) => {
  const { amount, partyCount } = req.query;

  const writeResult = await admin
    .firestore()
    .collection('splits')
    .add({ amount, partyCount: parseInt(partyCount), parties: [] });

  res.json({ result: `Message with ID: ${writeResult.id} added.`});
});

exports.addParty = functions.https.onRequest(async (req, res) => {
  const { splitID, partyID, income } = req.query;

  functions.logger.log(income);

  const documentRef = await admin
    .firestore()
    .collection('splits')
    .doc('rbNrQXMue8ezGw5EWjAm');

  documentRef.get().then((snap) => {
    if (snap.exists) {
      const { parties, partyCount } = snap.data();

      parties.push({ id: partyID, income: parseInt(income) });
      documentRef.update({ parties });
    }
  });

  res.json({ result: 'Document updated.'});
});

// TODO: rename parties to incomes
function calculateSplit(amount, parties) {
  // functions.logger.log('debug', amount, incomes);
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
    const { amount, parties, partyCount } = change.after.data();

    if (parties.length === partyCount) {
      const result = calculateSplit(amount, parties);

      const documentRef = await admin
        .firestore()
        .collection('splits')
        .doc('rbNrQXMue8ezGw5EWjAm');
      
      documentRef.get().then((snap) => {
        if (snap.exists) {
          const { parties } = snap.data();

          documentRef.update({ parties: result });
        }
      });
    }

    return null;
  });
