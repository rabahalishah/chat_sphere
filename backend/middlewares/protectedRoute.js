import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      res.status(401).json({ error: 'Unauthorized - No Token Provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: 'Unauthorized - Invalid Token' });
    }

    const user = await User.findById(decoded.userId).select('-password');
    //here userId is the id which we had passed to generateJwtAndSetCookies while signup and login

    if (!user) {
      return res.status(404).json({ error: 'user not found' });
    }
    req.user = user; //here req.user is the "user" variable which we had created in our login controller
    next();
  } catch (error) {
    console.log('error inside the protect route: ', error.message);
    res.status(500).json({ error: error });
  }
};
export default protectedRoute;
