'use client';

import { useState } from 'react';
import { calculateScore, isDropZone } from '../../lib/scoring';
import { useRouter } from 'next/navigation';

export default function SubmitForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    awarenessRating: '',
    targetGrowthRating: '',
    privateMarketRating: '',
    grossMarginRating: '',
    supplierRating: '',
    entryBarriersRating: '',
    tenderFeasibility: '',
    businessDevRating: '',
    regulatoryRating: '',
    productComplexity: '',
    operationalComplex: '',
    timeToMarketRating: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    {
      title: 'General Info',
      fields: [
        { name: 'title', label: 'Opportunity Title', type: 'text' },
        { name: 'description', label: 'Brief Description', type: 'textarea' },
      ],
    },
    {
      title: 'Market',
      fields: [
        { name: 'awarenessRating', label: 'Market Awareness', options: ['Very High', 'High', 'Medium', 'Low', 'Minimal', 'To Be Assessed'] },
        { name: 'targetGrowthRating', label: 'JMI Target Growth', options: ['Very High', 'High', 'Medium', 'Low', 'Minimal', 'To Be Assessed'] },
        { name: 'privateMarketRating', label: 'Private Market Adoptability', options: ['Very Easy', 'Easy', 'Moderate', 'Difficult', 'Very Difficult', 'To Be Assessed'] },
      ],
    },
    {
      title: 'Financial',
      fields: [
        { name: 'grossMarginRating', label: 'Gross Margin Potential', options: ['Very High Margin', 'High Margin', 'Moderate Margin', 'Low Margin', 'Very Low Margin', 'To Be Assessed'] },
        { name: 'supplierRating', label: 'Supplier / Commercial Readiness', options: ['Fully Ready', 'Ready', 'Partially Ready', 'Limited Readiness', 'Not Ready', 'To Be Assessed'] },
      ],
    },
    {
      title: 'Ease of Entry',
      fields: [
        { name: 'entryBarriersRating', label: 'Entry Barriers', options: ['Very Low Barriers', 'Low Barriers', 'Medium Barriers', 'High Barriers', 'Very High Barriers', 'To Be Assessed'] },
        { name: 'tenderFeasibility', label: 'Tender Feasibility', options: ['Very High', 'High', 'Medium', 'Low', 'Minimal', 'To Be Assessed'] },
        { name: 'businessDevRating', label: 'Business Development Effort', options: ['Very Easy', 'Easy', 'Moderate', 'Difficult', 'Very Difficult', 'To Be Assessed'] },
        { name: 'regulatoryRating', label: 'Regulatory Complexity', options: ['Very Easy', 'Easy', 'Moderate', 'Difficult', 'Very Difficult', 'To Be Assessed'] },
        { name: 'productComplexity', label: 'Product Complexity', options: ['Very Easy', 'Easy', 'Moderate', 'Difficult', 'Very Difficult', 'To Be Assessed'] },
        { name: 'operationalComplex', label: 'Operational Complexity', options: ['No Complex', 'Low Complex', 'Moderate', 'Complex', 'Very Complex', 'To Be Assessed'] },
        { name: 'timeToMarketRating', label: 'Time To Market', options: ['Very Fast', 'Fast', 'Medium', 'Slow', 'Very Slow', 'To Be Assessed'] },
      ],
    }
  ];

  const handleChange = (name: string, val: string) => {
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const submitProject = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        router.push('/dashboard/approvals');
      } else {
        alert("Failed to submit.");
      }
    } catch (e) {
      console.error(e);
    }
    setIsSubmitting(false);
  };

  const currentCategory = categories[step];
  const liveScore = calculateScore(formData);
  const drops = isDropZone(formData);

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        {categories.map((cat, idx) => (
          <div key={idx} style={{ flex: 1, padding: '0.5rem', textAlign: 'center', backgroundColor: step === idx ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)', borderRadius: '8px', color: step === idx ? 'white' : 'var(--text-muted)' }}>
            {cat.title}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {currentCategory.fields.map((field) => (
          <div key={field.name}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--accent-color)' }}>
              {field.label}
            </label>
            {('type' in field && field.type === 'text') ? (
              <input
                type="text"
                value={formData[field.name as keyof typeof formData]}
                onChange={e => handleChange(field.name, e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.2)', color: 'white' }}
              />
            ) : ('type' in field && field.type === 'textarea') ? (
              <textarea
                value={formData[field.name as keyof typeof formData]}
                onChange={e => handleChange(field.name, e.target.value)}
                rows={3}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.2)', color: 'white' }}
              />
            ) : (
              <select
                value={formData[field.name as keyof typeof formData]}
                onChange={e => handleChange(field.name, e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: '#151a28', color: 'white' }}
              >
                <option value="">Select an option</option>
                {('options' in field) && field.options?.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', border: '1px solid var(--accent-color)' }}>
        <h3 style={{ marginBottom: '0.5rem' }}>Live Score Preview: <span style={{ color: 'var(--accent-color)' }}>{liveScore.toFixed(2)} / 5</span></h3>
        {drops.length > 0 && (
          <div style={{ color: 'var(--danger-color)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            ⚠️ <strong>Critical Drop Zones triggered:</strong> {drops.join(', ')}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
        <button
          onClick={() => setStep(s => Math.max(0, s - 1))}
          style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }}
          disabled={step === 0}
        >
          Previous
        </button>
        
        {step < categories.length - 1 ? (
          <button className="btn-primary" onClick={() => setStep(s => s + 1)}>
            Next Step
          </button>
        ) : (
          <button className="btn-primary" onClick={submitProject} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Opportunity'}
          </button>
        )}
      </div>
    </div>
  );
}
