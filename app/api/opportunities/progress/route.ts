import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function GET() {
  try {
    const opps = await db.opportunity.findMany({
      include: { submitter: true },
      orderBy: { calculatedScore: 'desc' }
    });

    return NextResponse.json(opps);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
