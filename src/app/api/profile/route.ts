import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  try {
    await dbConnect();
    const body = await request.json();
    
    const { fullName, username } = body;

    const updateFields: { fullName?: string; username?: string } = {};

    if (fullName) {
      updateFields.fullName = fullName;
    }
    if (username) {
      if (username.includes(' ')) {
        return NextResponse.json({ message: 'Username cannot contain spaces.' }, { status: 400 });
      }
      updateFields.username = username.toLowerCase();
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Profile updated successfully!', user: updatedUser },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('PROFILE_UPDATE_ERROR', error);
    if (error.code === 11000) {
        return NextResponse.json(
            { message: 'This username is already taken.' }, 
            { status: 409 }
        );
    }
    return NextResponse.json({ message: 'Failed to update profile' }, { status: 500 });
  }
}