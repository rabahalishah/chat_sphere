import User from '../models/user.model.js';
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUser = await User.find({
      _id: { $ne: loggedInUserId },
    }).select('-password'); //$ne means not equal to...we want all user expect the
    // logged in one, which is we. Cause we do not want to send messages to ourselves.

    res.status(200).json(filteredUser);
  } catch (error) {
    console.log('Error inside the getUsersForSidebar: ', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};
