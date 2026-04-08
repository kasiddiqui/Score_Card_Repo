import './globals.css';

export const metadata = {
  title: 'Innovation Board - Idea Scoring',
  description: 'Submit, score, and approve ideas.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="app-container">
          {children}
        </main>
      </body>
    </html>
  );
}
