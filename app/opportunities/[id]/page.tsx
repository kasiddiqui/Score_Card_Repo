import { db } from '@/lib/db';
import { isDropZone } from '@/lib/scoring';
import Link from 'next/link';

export default async function OpportunityDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params; 
  const opp = await db.opportunity.findUnique({
    where: { id: resolvedParams.id },
    include: { submitter: true }
  });

  if (!opp) return <div className="app-container">Opportunity not found</div>;

  const drops = isDropZone(opp);
  const statusColors: any = {
    'Draft': 'var(--text-muted)',
    'Pending_SBU': 'var(--accent-color)',
    'Pending_PMO': 'var(--purple-accent)',
    'Approved': 'var(--success-color)',
    'Rejected': 'var(--danger-color)',
    'Returned': 'var(--danger-color)'
  };
  const color = statusColors[opp.workflowStatus] || 'var(--accent-color)';

  return (
    <div>
      <div className="nav-header">
        <h2>Opportunity Scorecard</h2>
        <div className="nav-links">
          <Link href="/dashboard/approvals" className="nav-item active">← Back to Approver</Link>
          <Link href="/" className="nav-item">Home</Link>
        </div>
      </div>

      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{opp.title}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '800px' }}>{opp.description}</p>
            <div style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
              Submitted by: <strong>{opp.submitter.name}</strong> | SBU: {opp.sbu}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ 
              display: 'inline-block', 
              padding: '0.5rem 1rem', 
              borderRadius: '20px', 
              backgroundColor: `${color}20`, 
              color: color,
              fontWeight: 600,
              border: `1px solid ${color}`
            }}>
              {opp.workflowStatus.replace('_', ' ')}
            </span>
            {(opp.workflowStatus === 'Draft' || opp.workflowStatus === 'Returned') && (
              <div style={{ marginTop: '1rem' }}>
                <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Edit Opportunity</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 3fr', gap: '2rem' }}>
        <div className="glass-panel" style={{ textAlign: 'center', height: 'fit-content' }}>
           <h3 style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Overall Score</h3>
           <div style={{ fontSize: '4rem', fontWeight: 700, color: 'var(--accent-color)', lineHeight: 1 }}>
             {opp.calculatedScore.toFixed(2)}
           </div>
           <div style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>out of 5.00</div>

           {drops.length > 0 && (
            <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', border: '1px solid var(--danger-color)' }}>
              <h4 style={{ color: 'var(--danger-color)', marginBottom: '0.5rem' }}>Critical Drops</h4>
              <ul style={{ textAlign: 'left', margin: 0, paddingLeft: '1.2rem', color: 'var(--danger-color)', fontSize: '0.9rem' }}>
                {drops.map((d: string, i: number) => <li key={i}>{d}</li>)}
              </ul>
            </div>
           )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-panel">
            <h3 style={{ marginBottom: '1rem', color: 'var(--accent-color)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Market Fit</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div><strong>Market Awareness:</strong> <span style={{ color: 'var(--text-muted)' }}>{opp.awarenessRating || 'N/A'}</span></div>
              <div><strong>Target Growth:</strong> <span style={{ color: 'var(--text-muted)' }}>{opp.targetGrowthRating || 'N/A'}</span></div>
              <div><strong>Private Market:</strong> <span style={{ color: 'var(--text-muted)' }}>{opp.privateMarketRating || 'N/A'}</span></div>
            </div>
          </div>

          <div className="glass-panel">
            <h3 style={{ marginBottom: '1rem', color: 'var(--accent-color)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Financial & Commercial</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div><strong>Gross Margin:</strong> <span style={{ color: 'var(--text-muted)' }}>{opp.grossMarginRating || 'N/A'}</span></div>
              <div><strong>Supplier Readiness:</strong> <span style={{ color: 'var(--text-muted)' }}>{opp.supplierRating || 'N/A'}</span></div>
            </div>
          </div>

          <div className="glass-panel">
            <h3 style={{ marginBottom: '1rem', color: 'var(--accent-color)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Execution & Complexity</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div><strong>Entry Barriers:</strong> <span style={{ color: 'var(--text-muted)' }}>{opp.entryBarriersRating || 'N/A'}</span></div>
              <div><strong>Tender Feasibility:</strong> <span style={{ color: 'var(--text-muted)' }}>{opp.tenderFeasibility || 'N/A'}</span></div>
              <div><strong>Business Dev:</strong> <span style={{ color: 'var(--text-muted)' }}>{opp.businessDevRating || 'N/A'}</span></div>
              <div><strong>Regulatory:</strong> <span style={{ color: 'var(--text-muted)' }}>{opp.regulatoryRating || 'N/A'}</span></div>
              <div><strong>Product Complexity:</strong> <span style={{ color: 'var(--text-muted)' }}>{opp.productComplexity || 'N/A'}</span></div>
              <div><strong>Operational:</strong> <span style={{ color: 'var(--text-muted)' }}>{opp.operationalComplex || 'N/A'}</span></div>
              <div><strong>Time To Market:</strong> <span style={{ color: 'var(--text-muted)' }}>{opp.timeToMarketRating || 'N/A'}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
