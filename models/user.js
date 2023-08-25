import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, 'Username is required'],
    },
    email: {
      type: String,
      unique: [true, 'Email already exits!'],
      required: [true, 'Email is required!'],
    },
    password: String,
    image: String,
    qtnIds: {
      type: Array,
    },
    Provider: {
      type: String,
      default: 'Credentials',
    },
  },
  { timestamps: true }
);

const User = models.User || model('User', UserSchema);

export default User;
