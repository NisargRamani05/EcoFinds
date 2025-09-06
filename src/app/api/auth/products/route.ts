import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/lib/models/Product';
import User from '@/lib/models/User'; // Make sure User model is imported

export async function GET(request: Request) {
  try {
    await dbConnect();

    // Find all products and populate the 'seller' field with their username.
    // .populate() is a powerful Mongoose feature that lets you reference documents in other collections.
    const products = await Product.find({})
      .populate({
        path: 'seller',
        model: User,
        select: 'username fullName', // We only want to get the username and fullName
      })
      .sort({ createdAt: -1 }); // Sort by newest first

    return NextResponse.json(
      {
        message: 'Products fetched successfully!',
        data: products,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET_PRODUCTS_ERROR', error);
    return NextResponse.json(
      { message: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// We will add the POST function for creating products in the next step.