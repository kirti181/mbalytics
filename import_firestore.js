const admin = require('firebase-admin');
const fs = require('fs');

// Set GOOGLE_APPLICATION_CREDENTIALS to the Firebase service-account JSON path.
admin.initializeApp();
const db = admin.firestore();
const data = JSON.parse(fs.readFileSync('firebase_seed.json', 'utf8'));

async function main() {
  const writer = db.bulkWriter();
  writer.onWriteError(error => {
    if (error.failedAttempts < 3) return true;
    console.error(error);
    return false;
  });
  writer.set(db.collection('datasets').doc(data.metadata.dataset), data.metadata);
  for (const college of data.colleges) {
    writer.set(db.collection('colleges').doc(college.code), college);
  }
  await writer.close();
  console.log(`Imported ${data.colleges.length} colleges.`);
}

main().catch(error => { console.error(error); process.exit(1); });
