// const User = require('../models/user'); // Use lowercase 'user' as you requested
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// // @desc    Register a new user
// // @route   POST /api/auth/register
// // @access  Public
// const registerUser = async (req, res) => {
//   const { name, email, password } = req.body;

//   try {
//     // 1. Check if user already exists
//     let user = await User.findOne({ email });

//     if (user) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // 2. Create a new user instance
//     user = new User({
//       name,
//       email,
//       password,
//     });

//     // 3. Hash the password before saving
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(password, salt);

//     // 4. Save the user to the database
//     await user.save();

//     // 5. Create and sign a JSON Web Token (JWT)
//     const payload = {
//       user: {
//         id: user.id,
//       },
//     };

//     jwt.sign(
//       payload,
//       process.env.JWT_SECRET,
//       { expiresIn: '5d' }, // Token expires in 5 days
//       (err, token) => {
//         if (err) throw err;
//         // 6. Send the token and user info back to the frontend
//         res.status(201).json({
//           token,
//           user: {
//             id: user.id,
//             name: user.name,
//             email: user.email,
//           }
//         });
//       }
//     );
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send('Server error');
//   }
// };


// // --- NEW LOGIN FUNCTION ---
// // @desc    Authenticate user & get token (Login)
// // @route   POST /api/auth/login
// // @access  Public
// const loginUser = async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         // 1. Check if user exists
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(400).json({ message: 'Invalid credentials' });
//         }

//         // 2. Check if password matches
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ message: 'Invalid credentials' });
//         }

//         // 3. If credentials are correct, create and sign a JWT
//         const payload = {
//             user: {
//                 id: user.id,
//             },
//         };

//         jwt.sign(
//             payload,
//             process.env.JWT_SECRET,
//             { expiresIn: '5d' },
//             (err, token) => {
//                 if (err) throw err;
//                 // 4. Send the token and user info back to the frontend
//                 res.json({
//                     token,
//                     user: {
//                         id: user.id,
//                         name: user.name,
//                         email: user.email,
//                     }
//                 });
//             }
//         );
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send('Server error');
//     }
// };


// module.exports = {
//   registerUser,
//   loginUser, // <-- Add loginUser to the export
// };
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// (The registerUser function is correct, no changes needed there)
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    user = new User({ name, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
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


// --- UPDATED LOGIN FUNCTION WITH DEBUGGING LOGS ---
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    console.log('--- Login attempt received ---');
    console.log('Email:', email);
    console.log('Password received from frontend:', password);

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log('DEBUG: User not found in database.');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        console.log('DEBUG: User found in database:', user.email);
        console.log('DEBUG: Hashed password from DB:', user.password);

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

