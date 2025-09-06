import { Schema, model, models } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema({
  // NEW FIELD ADDED HERE
  fullName: {
    type: String,
    required: [true, 'Please provide your full name.'],
    trim: true,
  },
  username: {
    type: String,
    required: [true, 'Please provide a username.'],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email.'],
    unique: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email address.'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    select: false, // This ensures the password isn't sent back in queries by default
  },
  profileImage: {
    type: String,
    default: '', // URL to the profile image
  },
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// This function runs right before a user document is saved
UserSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }
  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with the hashed password in the database
UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// This prevents Mongoose from redefining the model every time in development
const User = models.User || model('User', UserSchema);
export default User;