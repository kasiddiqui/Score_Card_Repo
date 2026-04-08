import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');
    const sbu = searchParams.get('sbu');

    let statusFilter = '';
    
    if (role === 'SBU_Manager') statusFilter = 'Pending_SBU';
    else if (role === 'PMO') statusFilter = 'Pending_PMO';
    else if (role === 'Top_Management') statusFilter = 'Pending_Top_Management';
    else if (role === 'Submitter') return NextResponse.json(await db.opportunity.findMany()); // For submitter to see all

    const whereClause: any = {
      workflowStatus: statusFilter
    };

    if (role === 'SBU_Manager' && sbu && sbu !== 'All') {
      whereClause.sbu = sbu;
    }

    const opps = await db.opportunity.findMany({
      where: whereClause,
      include: { submitter: true }
    });

    return NextResponse.json(opps);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
