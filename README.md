# MBAlytics

MBAlytics helps students find MBA colleges from a KEA PGCET rank, category, and city. It is a Next.js app backed by Firebase Admin SDK and Firestore.

## Local development

Requirements: Node.js 20+ and a Firebase project with a Firestore database.

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Fill in `.env.local` with a Firebase service account's project ID, client email, and private key. Never commit service-account JSON files or private keys.

Open http://localhost:3000.

## Firestore import

The checked-in `firebase_seed.json` contains the normalized 290-college dataset. To regenerate it from the workbook:

```powershell
npm run prepare-data
```

For a one-time authenticated import, either set `GOOGLE_APPLICATION_CREDENTIALS` to a service-account JSON path or use the local `service-account.json` fallback:

```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS = 'C:\path\to\mbalytics-service-account.json'
npm run import
```

The importer writes deterministic document IDs to `colleges/{collegeCode}` and can be safely rerun.

## Verification

```powershell
npm run build
```

## Data source

KEA PGCET 2025 First Round Allotment Cut-Off Ranks (RoK), dated 2025-10-04. Lower cutoff rank numbers are more competitive; a null category cutoff means no seat was available in the source data.
