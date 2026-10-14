import './styles.css';

export const metadata = {
  title: 'VELO — Built for the long way home',
  description: 'Thoughtfully designed bikes for the roads ahead.'
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
