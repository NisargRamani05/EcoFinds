import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/lib/models/Product';
import { getServerSession } from 'next-auth';
// We use the @/ alias for a stable, non-relative path
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: Request) {
  // Get the current user's session from the server
  const session = await getServerSession(authOptions);

  // If the user is not logged in, return an error
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  try {
    await dbConnect();

    // Find all products where the 'seller' field matches the logged-in user's ID
    const products = await Product.find({ seller: session.user.id }).sort({ createdAt: -1 });

    return NextResponse.json(
      {
        message: 'User listings fetched successfully!',
        data: products,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET_USER_LISTINGS_ERROR', error);
    return NextResponse.json({ message: 'Failed to fetch user listings' }, { status: 500 });
  }
}