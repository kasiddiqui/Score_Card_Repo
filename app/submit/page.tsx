import SubmitForm from './SubmitForm';
import Link from 'next/link';

export default function SubmitPage() {
  return (
    <div>
      <div className="nav-header">
        <h2>Submit an Opportunity</h2>
        <Link href="/" className="nav-item">← Back to Home</Link>
      </div>

      <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Fill in the qualitative ratings based on the Opportunity Scoring Model. The system will auto-calculate a comprehensive score.
        </p>
        
        <SubmitForm />
      </div>
    </div>
  );
}
