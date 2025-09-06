import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/lib/models/Product';
import User from '@/lib/models/User';
import { getServerSession } from 'next-auth';
// CORRECTED IMPORT PATH BELOW
import { authOptions } from '../../api/auth/[...nextauth]/route';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const products = await Product.find({})
      .populate({
        path: 'seller',
        model: User,
        select: 'username fullName',
      })
      .sort({ createdAt: -1 });

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

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { message: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    await dbConnect();
    const { title, description, category, price, images } = await request.json();

    if (!title || !description || !category || !price || !images || images.length === 0) {
        return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
    }

    const newProduct = new Product({
      title,
      description,
      category,
      price,
      images,
      seller: session.user.id,
    });

    await newProduct.save();

    return NextResponse.json(
      {
        message: 'Product listed successfully!',
        data: newProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST_PRODUCT_ERROR', error);
    return NextResponse.json(
      { message: 'Failed to create product' },
      { status: 500 }
    );
  }
}