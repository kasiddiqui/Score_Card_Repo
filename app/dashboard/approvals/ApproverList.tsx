'use client';

import { useState, useEffect } from 'react';
import { calculateScore, isDropZone } from '../../../lib/scoring';
import Link from 'next/link';

export default function ApproverList() {
  const [users, setUsers] = useState<any[]>([]);
  const [activeUser, setActiveUser] = useState<any>(null);
  const [pendingOpps, setPendingOpps] = useState<any[]>([]);
  
  const [selectedOpp, setSelectedOpp] = useState<any>(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setUsers(data);
          if (data.length > 0) setActiveUser(data.find((u: any) => u.role === 'SBU_Manager') || data[0]);
        } else {
          console.error("Users API error:", data);
        }
      });
  }, []);

  useEffect(() => {
    if (activeUser) {
      fetch(`/api/opportunities/pending?role=${activeUser.role}&sbu=${activeUser.sbu}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setPendingOpps(data);
          } else {
            console.error("Pending API error:", data);
            setPendingOpps([]);
          }
        });
    }
  }, [activeUser]);

  const handleAction = async (action: 'Approve' | 'Reject') => {
    if (!selectedOpp || !activeUser) return;
    try {
      await fetch(`/api/opportunities/${selectedOpp.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, comments: comment, approverId: activeUser.id })
      });
      setSelectedOpp(null);
      setComment('');
      // Refresh list
      const res = await fetch(`/api/opportunities/pending?role=${activeUser.role}&sbu=${activeUser.sbu}`);
      setPendingOpps(await res.json());
    } catch (e) {
      console.error("Action error", e);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <strong>Simulate Role:</strong>
        {users.map(u => (
          <button 
            key={u.id} 
            onClick={() => setActiveUser(u)}
            style={{ 
              backgroundColor: activeUser?.id === u.id ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)',
              color: 'white'
            }}
          >
            {u.name} ({u.role})
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
        <div className="glass-panel">
          <h3>Pending ({activeUser?.role})</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Opportunities waiting for your review.
          </p>
          
          {pendingOpps.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No pending items.</p>
          ) : (
            pendingOpps.map(opp => {
              const drops = isDropZone(opp);
              return (
                <div 
                  key={opp.id} 
                  onClick={() => setSelectedOpp(opp)}
                  style={{ 
                    padding: '1rem', 
                    borderRadius: '8px', 
                    backgroundColor: selectedOpp?.id === opp.id ? 'rgba(59, 130, 246, 0.2)' : 'rgba(0,0,0,0.2)',
                    cursor: 'pointer',
                    marginBottom: '1rem',
                    border: drops.length > 0 ? '1px solid var(--danger-color)' : '1px solid transparent'
                  }}
                >
                  <h4 style={{ margin: 0 }}>{opp.title}</h4>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    Score: <strong>{opp.calculatedScore.toFixed(2)}</strong> | SBU: {opp.sbu}
                  </div>
                  {drops.length > 0 && <span style={{ color: 'var(--danger-color)', fontSize: '0.8rem' }}>⚠️ Hazards Detected</span>}
                </div>
              );
            })
          )}
        </div>

        {selectedOpp ? (
          <div className="glass-panel flex flex-col">
            <h2 style={{ marginBottom: '0.5rem', color: 'var(--accent-color)' }}>{selectedOpp.title}</h2>
            <p style={{ color: 'var(--text-muted)' }}>{selectedOpp.description}</p>
            
            <div style={{ margin: '2rem 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px' }}>
                <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Calculated Score</h4>
                <div style={{ fontSize: '2rem', fontWeight: 600 }}>{selectedOpp.calculatedScore.toFixed(2)} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 5</span></div>
              </div>
              <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Decision Parameters</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem' }}>
                  <li>Gross Margin: {selectedOpp.grossMarginRating}</li>
                  <li>Tender Feasibility: {selectedOpp.tenderFeasibility}</li>
                  <li>Target Growth: {selectedOpp.targetGrowthRating}</li>
                </ul>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <Link href={`/opportunities/${selectedOpp.id}`}>
                <button className="btn-primary" style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid var(--border-color)' }}>
                  View Full Opportunity Scorecard
                </button>
              </Link>
            </div>

            <textarea 
              placeholder="Add comments or justification..." 
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows={4}
              style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'white', marginBottom: '1.5rem' }}
            />

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={() => handleAction('Approve')} 
                style={{ backgroundColor: 'var(--success-color)', color: 'white', flex: 1 }}
              >
                Approve & Forward
              </button>
              <button 
                onClick={() => handleAction('Reject')} 
                style={{ backgroundColor: 'var(--danger-color)', color: 'white', flex: 1 }}
              >
                Reject 
              </button>
            </div>
          </div>
        ) : (
          <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: 'var(--text-muted)' }}>Select an opportunity to review.</p>
          </div>
        )}
      </div>
    </div>
  );
}
