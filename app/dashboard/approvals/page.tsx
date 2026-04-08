import ApproverList from './ApproverList';
import Link from 'next/link';

export default function ApprovalsPage() {
  return (
    <div>
      <div className="nav-header">
        <h2>Approver Dashboard</h2>
        <div className="nav-links">
          <Link href="/" className="nav-item">Home</Link>
          <Link href="/dashboard/progress" className="nav-item">Progress Tracker</Link>
        </div>
      </div>
      <ApproverList />
    </div>
  );
}
