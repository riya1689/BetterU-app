const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user instance (hashing will happen automatically)
    user = new User({
      name,
      email,
      password,
    });

    // Save the user to the database
    await user.save();

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5d' }, (err, token) => {
      if (err) throw err;
      res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    // --- RE-ADDED DEBUGGING LOGS ---
    console.log('--- Login attempt received ---');
    console.log('Email:', email);
    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log('DEBUG: User not found in database.');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        console.log('DEBUG: User found in database:', user.email);
        
        const isMatch = await bcrypt.compare(password, user.password);

        console.log('DEBUG: bcrypt.compare result (isMatch):', isMatch);

        if (!isMatch) {
            console.log('DEBUG: Password comparison failed.');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        console.log('DEBUG: Password comparison successful!');
        
        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5d' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
        });
    } catch (error) {
        console.error('SERVER ERROR:', error.message);
        res.status(500).send('Server error');
    }
};

module.exports = {
  registerUser,
  loginUser,
};
