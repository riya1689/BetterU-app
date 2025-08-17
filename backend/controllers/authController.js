const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- UPDATED: The registerUser function now handles the 'role' ---
const registerUser = async (req, res) => {
  // Destructure 'role' from the request body
  const { name, email, password, role } = req.body; 
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password,
      role // <-- Assign the role from the request body here
    });

    await user.save();

    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5d' }, (err, token) => {
      if (err) throw err;
      res.status(201).json({ 
        token, 
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          role: user.role
        } 
      });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
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
        
        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5d' }, (err, token) => {
            if (err) throw err;
            res.json({ 
              token, 
              user: { 
                id: user.id, 
                name: user.name, 
                email: user.email, 
                role: user.role
              } 
            });
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
