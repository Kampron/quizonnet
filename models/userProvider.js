import { Schema, model, models } from "mongoose";

const UserProviderSchema = new Schema({
  email: {
    type: String,
    unique: [true, 'Email already exits!'],
    required: [true, 'Email is required!'],
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
  },
  image: {
    type: String,
  }
})

const UserProvider = models.UserProvider || model("UserProvider", UserProviderSchema)

export default UserProvider;