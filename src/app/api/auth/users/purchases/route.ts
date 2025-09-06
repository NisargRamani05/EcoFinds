import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/lib/models/Order';
import Product from '@/lib/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET: Fetches the purchase history for the current user
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  try {
    await dbConnect();

    // Find all orders where the 'buyer' field matches the user's ID
    const purchaseHistory = await Order.find({ buyer: session.user.id })
      .populate({
        path: 'product', // For each order, fetch the full product details
        model: Product,
      })
      .sort({ createdAt: -1 }); // Show most recent purchases first

    return NextResponse.json({ data: purchaseHistory }, { status: 200 });
  } catch (error) {
    console.error('GET_PURCHASE_HISTORY_ERROR', error);
    return NextResponse.json({ message: 'Failed to fetch purchase history.' }, { status: 500 });
  }
}