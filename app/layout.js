import './styles.css';

export const metadata = {
  title: 'MBAlytics | College Predictor',
  description: 'Find MBA colleges from your PGCET rank and category.'
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
