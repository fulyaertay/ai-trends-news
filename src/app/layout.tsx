import './globals.css';
import ThemeRegistry from '../ThemeRegistry';

export const metadata = {
  title: 'Wired: AI News',
  description: 'The latest stories on Artificial Intelligence from Wired',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}