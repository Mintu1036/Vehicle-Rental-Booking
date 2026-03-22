const { query } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authController = {
  async register(req, res) {
    try {
      const { firstName, lastName, email, password, phoneNumber, dateOfBirth } = req.body;

      if (!firstName || !lastName || !email || !password || !phoneNumber || !dateOfBirth) {
        return res.status(400).json({ 
          success: false, 
          message: 'Please provide all required fields' 
        });
      }

      const emailCheck = await query('SELECT * FROM USER WHERE Email = ?', [email]);
      if (emailCheck.length > 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email already exists' 
        });
      }

      const phoneCheck = await query('SELECT * FROM USER WHERE PhoneNumber = ?', [phoneNumber]);
      if (phoneCheck.length > 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'Phone number already exists' 
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await query(
        `INSERT INTO USER (FirstName, LastName, Email, Password, PhoneNumber, DateOfBirth) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [firstName, lastName, email, hashedPassword, phoneNumber, dateOfBirth]
      );

      // Generate JWT token
      const token = jwt.sign(
        { id: result.insertId, email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          userId: result.insertId,
          firstName,
          lastName,
          email,
          phoneNumber,
          token
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ 
          success: false, 
          message: 'Please provide email and password' 
        });
      }

      const users = await query('SELECT * FROM USER WHERE Email = ?', [email]);
      if (users.length === 0) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid credentials' 
        });
      }

      const user = users[0];
      const isPasswordValid = await bcrypt.compare(password, user.Password);

      if (!isPasswordValid) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid credentials' 
        });
      }

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          userId: user.UserID,
          firstName: user.FirstName,
          lastName: user.LastName,
          email: user.Email,
          token: jwt.sign(
            { id: user.UserID, email: user.Email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
          )
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }
};

module.exports = authController;
