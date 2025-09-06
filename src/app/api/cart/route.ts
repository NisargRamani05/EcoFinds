import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/User';
import Product from '@/lib/models/Product'; // CRITICAL: Import the Product model
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET: Fetches all items in the user's cart with full details
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

  try {
    await dbConnect();
    // Find the user and .populate() the 'cart' field.
    // This tells Mongoose to look up each ID in the cart array in the Product collection
    // and replace it with the full product document.
    const user = await User.findById(session.user.id).populate({
        path: 'cart',
        model: Product // Specify the model to use for populating
    });

    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

    // Now, user.cart will be an array of full product objects, not just IDs.
    return NextResponse.json({ data: user.cart }, { status: 200 });
  } catch (error) {
    console.error('CART_GET_ERROR', error);
    return NextResponse.json({ message: 'Failed to fetch cart' }, { status: 500 });
  }
}

// POST: Adds a single item to the user's cart
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

  try {
    const { productId } = await request.json();
    if (!productId) return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });

    await dbConnect();
    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $addToSet: { cart: productId } }, // Use $addToSet to prevent duplicates
      { new: true }
    );
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

    return NextResponse.json({ message: 'Item added to cart', data: user.cart }, { status: 200 });
  } catch (error) {
    console.error('CART_POST_ERROR', error);
    return NextResponse.json({ message: 'Failed to add item to cart' }, { status: 500 });
  }
}

// DELETE: Removes a single item from the user's cart
export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  
    try {
      const { productId } = await request.json();
      if (!productId) return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
  
      await dbConnect();
      const user = await User.findByIdAndUpdate(
        session.user.id,
        { $pull: { cart: productId } }, // Use $pull to remove the item
        { new: true }
      );
      if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });
  
      return NextResponse.json({ message: 'Item removed from cart', data: user.cart }, { status: 200 });
    } catch (error) {
      console.error('CART_DELETE_ERROR', error);
      return NextResponse.json({ message: 'Failed to remove item from cart' }, { status: 500 });
    }
}