import mongoose from "mongoose";

const { Schema, model } = mongoose;

// Product Schema
const productSchema = new Schema({
  productName: {
    type: String,
    required: true,
  },
  price: {
    type: Number, 
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
});

// Address Schema
const addressSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  default: {
    type: Boolean,
    default: false,
  },
});

// User Schema
const userSchema = new Schema({
  phoneNo: {
    type: String, 
    required: true,
    unique: true,
  },
  userName:{
    type: String,
    required: false,
    
  },
  wishlist: [{type:productSchema, required: false}], 
  cart: [{type:productSchema, required: false}], 
  address: [{type:addressSchema, required: false}], 
  otp:{
    type: String,
    required: false
  }
});

// User Model
const User = model("User", userSchema);

export default User;
