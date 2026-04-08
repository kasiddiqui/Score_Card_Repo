'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ProgressPage() {
  const [opps, setOpps] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/opportunities/progress').then(r => r.json()).then(data => setOpps(data || []));
  }, []);

  return (
    <div>
      <div className="nav-header">
        <h2>Progress Tracker</h2>
        <div className="nav-links">
          <Link href="/" className="nav-item">Home</Link>
          <Link href="/dashboard/approvals" className="nav-item">Approver Dashboard</Link>
        </div>
      </div>

      <div className="glass-panel">
        <h3 style={{ marginBottom: '1rem' }}>Active Execution Portfolio</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          All opportunities mapped by their cumulative calculated score based on our Opportunity Scoring Model.
        </p>

        <div style={{ width: '100%', overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
          <table style={{ minWidth: '1800px', width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
              <tr>
                {/* Sticky Start */}
                <th style={{ position: 'sticky', left: 0, backgroundColor: 'var(--panel-bg)', zIndex: 10, padding: '1rem', borderBottom: '2px solid var(--border-color)', borderRight: '2px solid var(--border-color)', minWidth: '250px' }}>Opportunity</th>
                
                {/* General Info */}
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--border-color)', color: 'var(--accent-color)' }}>Score</th>
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--border-color)' }}>Status</th>
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--border-color)' }}>SBU</th>
                
                {/* Market Fit */}
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--border-color)' }}>Market Awareness</th>
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--border-color)' }}>Target Growth</th>
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--border-color)' }}>Private Market</th>
                
                {/* Financial */}
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--border-color)' }}>Gross Margin</th>
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--border-color)' }}>Supplier Readiness</th>

                {/* Execution & Complexity */}
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--border-color)' }}>Entry Barriers</th>
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--border-color)' }}>Tender Feasibility</th>
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--border-color)' }}>Business Dev</th>
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--border-color)' }}>Regulatory</th>
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--border-color)' }}>Product Complex</th>
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--border-color)' }}>Ops Complex</th>
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--border-color)' }}>Time To Market</th>
              </tr>
            </thead>
            <tbody>
              {opps.map(opp => {
                const getStatusColor = (status: string) => {
                  switch(status) {
                    case 'Approved': return { bg: 'rgba(16, 185, 129, 0.2)', text: 'var(--success-color)' };
                    case 'Rejected': 
                    case 'Returned': return { bg: 'rgba(239, 68, 68, 0.2)', text: 'var(--danger-color)' };
                    case 'Draft': return { bg: 'rgba(255,255,255, 0.1)', text: 'var(--text-muted)' };
                    case 'Pending_PMO': return { bg: 'rgba(139, 92, 246, 0.2)', text: 'var(--purple-accent)' };
                    default: return { bg: 'rgba(59, 130, 246, 0.2)', text: 'var(--accent-color)' }; // Pending_SBU etc
                  }
                };
                const colors = getStatusColor(opp.workflowStatus);
                return (
                <tr key={opp.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  {/* Sticky Start */}
                  <td style={{ position: 'sticky', left: 0, backgroundColor: 'var(--panel-bg)', zIndex: 5, padding: '1rem', color: 'var(--text-main)', fontWeight: 500, borderRight: '2px solid var(--border-color)' }}>
                    <Link href={`/opportunities/${opp.id}`} style={{ color: 'var(--text-main)', textDecoration: 'underline' }}>
                      {opp.title}
                    </Link>
                  </td>
                  
                  {/* General Info */}
                  <td style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>{opp.calculatedScore.toFixed(2)}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.2rem 0.5rem', 
                      borderRadius: '4px', 
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      backgroundColor: colors.bg,
                      color: colors.text
                    }}>
                      {opp.workflowStatus.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{opp.sbu}</td>

                  {/* Market Fit */}
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{opp.awarenessRating || '-'}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{opp.targetGrowthRating || '-'}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{opp.privateMarketRating || '-'}</td>

                  {/* Financial */}
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{opp.grossMarginRating || '-'}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{opp.supplierRating || '-'}</td>

                  {/* Execution & Complexity */}
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{opp.entryBarriersRating || '-'}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{opp.tenderFeasibility || '-'}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{opp.businessDevRating || '-'}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{opp.regulatoryRating || '-'}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{opp.productComplexity || '-'}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{opp.operationalComplex || '-'}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{opp.timeToMarketRating || '-'}</td>
                </tr>
              )})}
              {opps.length === 0 && (
                <tr>
                  <td colSpan={17} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No opportunities yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
