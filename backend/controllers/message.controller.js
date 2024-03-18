import Conversation from '../models/conversation.model.js';
import Message from '../models/message.model.js';
import { getReceiverSocketId, io } from '../socket/socket.js';
export const sendMessage = async (req, res) => {
  try {
    //getting message from the usera as an input
    const { message } = req.body;

    //grabbing the receivers id from the url
    const { id: receiverId } = req.params; //renaming to receiverId

    //grabbing the senderId (which is currently loggedIn user)
    const senderId = req.user._id; //here "user" is coming from the protected route middleware

    //finding if converstation already exists between these two users
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    //In case of no previous conversation found, create a new one
    if (!conversation) {
      //no conversation means they are talking for the first time
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    //creating the new message by filling Message model
    const newMessage = new Message({ senderId, receiverId, message });

    //pushing that message in conversation model
    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    //saving data in database
    // await conversation.save();
    // await newMessage.save();

    //The below will run in parallel, resulting in optimizing the saving process.
    await Promise.all([conversation.save(), newMessage.save()]);

    // SOCKET IO FUNCTIONALITY WE WILL GO HERE
    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      // io.to(<socket_id).emit(); is used to send event to specific client
      io.to(receiverSocketId).emit('newMessage', newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log('error inside Message controller: ', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params; //actually its receiver id
    const senderId = req.user._id; //here "user" is coming from the protected route middleware
    //this senderId is basically the id of the user which is currently logged in. We are getting this id from the protected route
    // middleware

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate('messages');
    //As we know our conversation model do not contains the message content it only contains the message id
    //  and its referecne to the message model. Here populate method will grab the content of the message so that we do not have
    // an extra request to get the message content.

    if (!conversation) {
      return res.status(200).json([]);
    }

    const messages = conversation.messages;

    res.status(200).json(messages);
  } catch (error) {
    console.log('error inside the getMessage controller: ', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
