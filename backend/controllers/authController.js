import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const verifyToken = async (req, res) => {
  const { civicToken } = req.body;
  if (!civicToken) {
    return res.status(400).json({ message: 'Civic token is required.' });
  }

  try {
    
    const mockCivicId = `verified-user-for-token-${civicToken}`;

    
    let user = await User.findOne({ civicId: mockCivicId });
    if (!user) {
      user = await User.create({ civicId: mockCivicId });
    }

    const sessionToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.status(200).json({
      sessionToken,
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};