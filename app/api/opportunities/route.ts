import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { calculateScore } from '../../../lib/scoring';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const score = calculateScore(body);

    // We fetch a mock Submitter ID to associate with the project
    // Note: In real app, we'd use session/auth context
    const submitter = await db.user.findFirst({
      where: { role: 'Submitter' }
    });

    if (!submitter) {
      return NextResponse.json({ error: 'Mock submitter not found' }, { status: 400 });
    }

    const startStatus = 'Pending_SBU'; // The initial workflow state

    const newOpp = await db.opportunity.create({
      data: {
        title: body.title,
        description: body.description || '',
        sbu: submitter.sbu,
        submitterId: submitter.id,

        awarenessRating: body.awarenessRating,
        entryBarriersRating: body.entryBarriersRating,
        supplierRating: body.supplierRating,
        grossMarginRating: body.grossMarginRating,
        tenderFeasibility: body.tenderFeasibility,
        privateMarketRating: body.privateMarketRating,
        businessDevRating: body.businessDevRating,
        regulatoryRating: body.regulatoryRating,
        productComplexity: body.productComplexity,
        operationalComplex: body.operationalComplex,
        targetGrowthRating: body.targetGrowthRating,
        timeToMarketRating: body.timeToMarketRating,

        calculatedScore: score,
        workflowStatus: startStatus,
      }
    });

    return NextResponse.json(newOpp, { status: 201 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
