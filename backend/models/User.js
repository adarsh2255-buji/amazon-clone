import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: { 
    type: String ,
    required: [true, "Please add a name"]
},
  email: {
    type: String, 
    required: [true, "Please add an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email"
    ]
  },
    password: { 
    type: String, 
    required: false, // False because Google Auth users won't have one
    select: false // CRITICAL: Never return password by default in queries
  },
   role: {
    type: String,
    enum: ['customer', 'seller', 'admin'],
    default: 'customer'
  },
    googleId: { 
        type: String,
        select: false  
    },  
     addresses: [{
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
        isDefault: { type: Boolean, default: false }
  }]
    
}, { timestamps: true });

// Method to check password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate Token
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

const User = mongoose.model("User", userSchema);

export default User;
