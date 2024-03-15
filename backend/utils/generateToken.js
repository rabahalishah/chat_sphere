import jwt from 'jsonwebtoken';

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '15d',
  });

  res.cookie('jwt', token, {
    maxAge: 15 * 24 * 60 * 60 * 100, //its in milliseconds
    httpOnly: true, //to prevent XSS attacks
    sameSite: 'strict', //to prevent CSRF attacks cross site request forgery Attacks
    secure: process.env.NODE_ENV !== 'development', //this will be true for production environment
  });
};

export default generateTokenAndSetCookie;
