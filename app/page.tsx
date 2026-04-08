import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <div className="nav-header">
        <h2>Innovation Board</h2>
        <div className="nav-links">
          <Link href="/" className="nav-item active">Home</Link>
          <Link href="/dashboard/approvals" className="nav-item">Approver Dashboard</Link>
          <Link href="/dashboard/progress" className="nav-item">Progress Dashboard</Link>
        </div>
      </div>

      <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Ignite Corporate Innovation
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
          Evaluate, score, and track your strategic opportunities using our standard Opportunity Scoring Model framework.
        </p>
        <Link href="/submit">
          <button className="btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
            Submit an Idea
          </button>
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3>Multi-layer Scoring</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Automated evaluation across market, financial, and regulatory metrics.</p>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3>Workflow Integration</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Smooth transitions from Initial draft to Top Management approval.</p>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3>Execution Tracking</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Progress dashboard to hold owners accountable upon approval.</p>
        </div>
      </div>
    </div>
  );
}
