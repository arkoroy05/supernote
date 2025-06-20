import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  civicId: {
    type: String,
    required: true,
    unique: true,
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;