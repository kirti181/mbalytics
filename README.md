# MBAlytics

MBAlytics is a simple web app that helps students find MBA colleges using their KEA PGCET rank and category.

The app shows colleges whose published cutoff rank is within the entered rank.

## What it uses

- Next.js and React for the website
- Firebase Firestore for college data
- Firebase Admin SDK for the server-side API

## Run the app on your computer

You need Node.js 20 or newer and a Firebase project with Firestore enabled.

1. Install the packages:

   ```powershell
   npm install
   ```

2. Create your local environment file:

   ```powershell
   Copy-Item .env.example .env.local
   ```

3. Open `.env.local` and add your Firebase service-account details:

   ```text
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=your-service-account-email
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

4. Start the website:

   ```powershell
   npm run dev
   ```

5. Open http://localhost:3000 in your browser.

Never upload `.env.local`, `service-account.json`, or private keys to GitHub.

## Add the college data to Firestore

The project includes a prepared file called `firebase_seed.json` with 290 colleges.

To rebuild that file from the Excel workbook, run:

```powershell
npm run prepare-data
```

To upload the data to Firestore, set the path to your service-account JSON file and run:

```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS = 'C:\path\to\your-service-account.json'
npm run import
```

You can run the import again if needed. It uses the same document IDs each time.

## Check the project

Run a production build before deploying:

```powershell
npm run build
```

## Data source

KEA PGCET 2025 First Round Allotment Cut-Off Ranks (RoK), dated October 4, 2025.

Lower cutoff numbers are more competitive. A college is shown when its cutoff rank is greater than or equal to the student’s rank.
