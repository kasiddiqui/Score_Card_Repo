import { NextResponse } from 'next/server';
import { db } from '../../../../../lib/db';

const NEXT_STAGE: Record<string, string> = {
  'Pending_SBU': 'Pending_PMO',
  'Pending_PMO': 'Pending_Top_Management',
  'Pending_Top_Management': 'Approved',
};

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { action, comments, approverId } = await req.json();

    const opp = await db.opportunity.findUnique({ where: { id } });
    if (!opp) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const approver = await db.user.findUnique({ where: { id: approverId } });
    if (!approver) return NextResponse.json({ error: 'Approver not found' }, { status: 404 });

    let newStatus = opp.workflowStatus;

    if (action === 'Approve') {
      newStatus = NEXT_STAGE[opp.workflowStatus] || opp.workflowStatus;
    } else if (action === 'Reject') {
      newStatus = 'Rejected';
    }

    // Update opportunity status
    const updatedOpp = await db.opportunity.update({
      where: { id },
      data: { workflowStatus: newStatus }
    });

    // Record the log
    await db.approvalLog.create({
      data: {
        opportunityId: id,
        approverId: approver.id,
        action,
        comments,
      }
    });

    return NextResponse.json(updatedOpp, { status: 200 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const logs = await db.approvalLog.findMany({
      where: { opportunityId: id },
      include: { approver: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(logs);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
