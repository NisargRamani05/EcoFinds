import { Schema, model, models } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema({
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
    select: false,
  },
  profileImage: {
    type: String,
    default: '',
  },
  // --- THIS IS THE NEW FIELD FOR THE CART ---
  cart: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product', // This references the Product model
    },
  ],
}, {
  timestamps: true
});

// This function runs right before a user document is saved
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
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