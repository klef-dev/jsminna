import mongoose, { Schema } from "mongoose";

const userSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: Number },
  address: { type: String },
  gender: { type: String },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

export default User;
