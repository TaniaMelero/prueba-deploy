import { NextRequest } from 'next/server';
import { getCol } from '@/lib/mongo';
import { requireUser } from '@/lib/auth';
import { Review, Vote } from '@/types/db';

export async function DELETE(_req: NextRequest, { params }: { params: { id: string }}) {
  const me = await requireUser();
  if (!me) return Response.json({ error: 'No autenticado' }, { status: 401 });

  const reviews = await getCol<Review>('reviews');
  const r = await reviews.findOne({ _id: params.id });
  if (!r) return Response.json({ error: 'No encontrada' }, { status: 404 });
  if (r.userId !== me.uid) return Response.json({ error: 'Prohibido' }, { status: 403 });

  await reviews.deleteOne({ _id: params.id });
  const votes = await getCol<Vote>('votes');
  await votes.deleteMany({ reviewId: params.id });

  return Response.json({ ok: true });
}
