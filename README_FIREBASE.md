# MBAlytics Firebase import

The workbook is normalized into Firestore as follows:

- `colleges/{collegeCode}` — one document per college, with `rank`, `name`, `cutoffs`, `source`, `sourceDate`, and `seatType`.
- `datasets/mba_colleges_cutoffs` — dataset metadata and category list.

Generated files:

- `firebase_seed.json` — 290 college records.
- `import_firestore.js` — bulk Firestore importer.
- `prepare_firebase_data.py` — repeatable workbook-to-JSON converter.

## Finish the Firebase setup

The Google Cloud project ID `mbalytics` now exists, but it has no Firebase apps/resources yet. Open:

`https://console.firebase.google.com/project/mbalytics/overview`

and click **Add Firebase to your Google Cloud project** if prompted. Then create a Firestore database.

For a local authenticated import:

```powershell
npm install
$env:GOOGLE_APPLICATION_CREDENTIALS = 'C:\path\to\mbalytics-service-account.json'
npm run import
```

The service-account file should be kept outside source control. The importer is safe to rerun because it writes deterministic document IDs (`B252`, `B240`, etc.).
