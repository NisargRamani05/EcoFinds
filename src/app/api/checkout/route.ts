import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/User';
import Order from '@/lib/models/Order';
import Product from '@/lib/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// POST: Handles the checkout process
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  try {
    await dbConnect();

    // Find the user and populate the full product details in their cart
    const user = await User.findById(session.user.id).populate({
      path: 'cart',
      model: Product,
    });

    // Check if the cart is empty
    if (!user || !user.cart || user.cart.length === 0) {
      return NextResponse.json({ message: 'Cannot checkout with an empty cart.' }, { status: 400 });
    }

    // Create an array of new order documents from the cart items
    const ordersToCreate = user.cart.map((item: any) => ({
      product: item._id,
      buyer: user._id,
      seller: item.seller, // The seller ID is available on the populated product
    }));

    // Save all the new orders to the database in one operation
    await Order.insertMany(ordersToCreate);

    // Empty the user's cart
    user.cart = [];
    await user.save();

    return NextResponse.json({ message: 'Checkout successful! Your order has been placed.' }, { status: 200 });
  } catch (error) {
    console.error('CHECKOUT_ERROR', error);
    return NextResponse.json({ message: 'An error occurred during checkout.' }, { status: 500 });
  }
}