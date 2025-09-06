import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/User';

export async function POST(request: Request) {
  try {
    // 1. Connect to the database
    await dbConnect();

    // 2. Parse the request body
    const { fullName, username, email, password } = await request.json();

    // 3. Validate the incoming data
    if (!fullName || !username || !email || !password) {
      return NextResponse.json(
        { message: 'All fields are required.' },
        { status: 400 }
      );
    }

    // 4. Check if a user with the same email or username already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    }).lean(); // .lean() makes the query faster as it returns a plain JS object

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email or username already exists.' },
        { status: 409 } // 409 Conflict
      );
    }

    // 5. Create the new user
    // The password will be automatically hashed by the pre-save hook in the User model
    const newUser = new User({
      fullName,
      username,
      email,
      password,
    });

    await newUser.save();

    // Remove password from the returned object
    const userObject = newUser.toObject();
    delete userObject.password;


    // 6. Return a success response
    return NextResponse.json(
      {
        message: 'User registered successfully!',
        user: userObject,
      },
      { status: 201 } // 201 Created
    );

  } catch (error) {
    console.error('REGISTRATION_ERROR', error);
    return NextResponse.json(
      { message: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}