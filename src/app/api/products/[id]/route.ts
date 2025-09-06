import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/lib/models/Product';
import User from '@/lib/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

interface Params {
  id: string;
}

// GET function to fetch a single product by its ID
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

    return NextResponse.json({ data: product }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.name === 'CastError') {
      return NextResponse.json({ message: 'Invalid Product ID format.' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to fetch product' }, { status: 500 });
  }
}

// PUT function to update an existing product
export async function PUT(request: Request, context: { params: Params }) {
  const { id } = context.params;
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  try {
    await dbConnect();
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ message: 'Product not found.' }, { status: 404 });
    }

    // Security Check: Ensure the user owns the product before updating
    if (product.seller.toString() !== session.user.id) {
      return NextResponse.json({ message: 'Unauthorized action.' }, { status: 403 });
    }

    const body = await request.json();

    const updatedProduct = await Product.findByIdAndUpdate(id, body, {
      new: true, // Return the modified document
      runValidators: true, // Ensure the update follows schema rules
    });

    return NextResponse.json(
      {
        message: 'Product updated successfully!',
        data: updatedProduct,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('UPDATE_PRODUCT_ERROR', error);
    return NextResponse.json({ message: 'Failed to update product' }, { status: 500 });
  }
}


// DELETE function to remove a product
export async function DELETE(request: Request, context: { params: Params }) {
  const { id } = context.params;
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  try {
    await dbConnect();
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ message: 'Product not found.' }, { status: 404 });
    }

    if (product.seller.toString() !== session.user.id) {
      return NextResponse.json({ message: 'Unauthorized action.' }, { status: 403 });
    }

    await Product.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Product deleted successfully!' }, { status: 200 });
  } catch (error) {
    console.error('DELETE_PRODUCT_ERROR', error);
    return NextResponse.json({ message: 'Failed to delete product' }, { status: 500 });
  }
}