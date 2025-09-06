import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/lib/models/Product';
import User from '@/lib/models/User';

interface Params {
  id: string;
}

export async function GET(request: Request, context: { params: Params }) {
  const { id } = context.params;

  if (!id) {
    return NextResponse.json({ message: 'Product ID is required.' }, { status: 400 });
  }

  try {
    await dbConnect();

    const product = await Product.findById(id).populate({
      path: 'seller',
      model: User,
      select: 'username fullName',
    });

    if (!product) {
      return NextResponse.json({ message: 'Product not found.' }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: 'Product fetched successfully!',
        data: product,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET_PRODUCT_BY_ID_ERROR', error);
    // Handle cases where the ID is in an invalid format for MongoDB
    if (error instanceof Error && error.name === 'CastError') {
         return NextResponse.json({ message: 'Invalid Product ID format.' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to fetch product' }, { status: 500 });
  }
}