import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebase-admin';

export async function GET(request) {
  const params = request.nextUrl.searchParams;
  const rank = Number(params.get('rank'));
  const category = params.get('category');
  if (!Number.isInteger(rank) || rank < 1 || !/^[A-Z0-9]+$/.test(category || '')) return NextResponse.json({ error: 'Enter a valid rank and category.' }, { status: 400 });
  const snapshot = await db.collection('colleges').get();
  const colleges = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(c => Number.isInteger(c.cutoffs?.[category]) && rank <= c.cutoffs[category]).map(c => ({ ...c, cutoffRank: c.cutoffs[category] })).sort((a,b) => a.cutoffRank - b.cutoffRank);
  return NextResponse.json({ colleges });
}
