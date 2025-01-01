const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/userModel');

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password)
            return res.status(200).json({ status: false, message: 'Name, Email and password are required' });
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(200).json({ status: false, message: 'User already exists' });
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Create user
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        
        res.status(201).json({ status: true, message: 'User registered successfully' });
    } 
    catch (error) {
        res.status(500).json({ status: false, message: 'Server error', error });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password)
            return res.status(200).json({ status: false, message: 'Email and password are required' });
        
        // Find user
        const user = await User.findOne({ email });
        if (!user)
            return res.status(200).json({ status: false, message: 'Invalid credentials' });
        
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(200).json({ status: false, message: 'Invalid credentials' });
        
        // Generate token
        const token = jwt.sign({ name: user.name, email: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

        res.status(200).json({ status: true, message: 'Logged in successfully', token });
    } 
    catch (error) {
        res.status(500).json({ status: false, message: 'Server error', error });
    }
};

module.exports = { registerUser, loginUser };
