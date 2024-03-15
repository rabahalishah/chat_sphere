import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import generateTokenAndSetCookie from '../utils/generateToken.js';

export const signup = async (req, res) => {
  try {
    //getting data from the user
    const { fullName, username, password, confirmPassword, gender } = req.body;

    //checking password
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match!" });
    }

    //checking if user already exists
    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    //if user doesn't exist then creating one
    //Hashing password first
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      gender,
      profilePic: gender === 'male' ? boyProfilePic : girlProfilePic,
    });

    if (newUser) {
      // generating JWT and storing it into the cookie
      generateTokenAndSetCookie(newUser._id, res);

      //saving user into the DB
      await newUser.save();

      //sending back the response once the user has successfully created

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ error: 'Invalid user data' });
    }
  } catch (error) {
    console.log('Error in signup controller: ', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ''
    );

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log('Error in login controller: ', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie('jwt', '', { maxAge: 0 }); //resetting token from cookie
    res.status(200).json({
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.log('Error in logout controller: ', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
