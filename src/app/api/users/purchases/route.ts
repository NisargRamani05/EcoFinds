import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/lib/models/Order';
import Product from '@/lib/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    console.log("Purchase History API: User not authenticated.");
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  // --- DEBUG LOG 1 ---
  // This will show us the user ID we are searching for.
  console.log(`Purchase History API: Fetching orders for user ID: ${session.user.id}`);

  try {
    await dbConnect();

    const purchaseHistory = await Order.find({ buyer: session.user.id })
      .populate({
        path: 'product',
        model: Product,
      })
      .sort({ createdAt: -1 })
      .lean(); // Use .lean() for faster, plain JavaScript objects

    // --- DEBUG LOG 2 ---
    // This will tell us how many orders were found for that user.
    console.log(`Purchase History API: Found ${purchaseHistory.length} orders.`);

    return NextResponse.json({ data: purchaseHistory }, { status: 200 });
  } catch (error) {
    console.error('GET_PURCHASE_HISTORY_ERROR', error);
    return NextResponse.json({ message: 'Failed to fetch purchase history.' }, { status: 500 });
  }
}