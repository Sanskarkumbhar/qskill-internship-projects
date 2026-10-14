 
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;
    const userId = req.user.userId;

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID is required.",
      });
    }

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message text is required.",
      });
    }

    if (text.trim().length > 5000) {
      return res.status(400).json({
        success: false,
        message: "Message cannot exceed 5000 characters.",
      });
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: userId,
      text: text.trim(),
      readBy: [userId],
    });

    // Update the conversation preview and unread counts.
    conversation.lastMessage = message.text;
    conversation.lastMessageAt = message.createdAt;

    if (!conversation.unreadCounts) {
      conversation.unreadCounts = new Map();
    }

    conversation.participants.forEach((participantId) => {
      const participant = String(participantId);

      if (participant !== String(userId)) {
        const currentCount =
          conversation.unreadCounts.get(participant) || 0;

        conversation.unreadCounts.set(participant, currentCount + 1);
      }
    });

    await conversation.save();

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name email");

    return res.status(201).json({
      success: true,
      message: populatedMessage,
    });
  } catch (error) {
    console.error("Send message error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to send message.",
    });
  }
};

// Get message history and mark incoming messages as read.
const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.userId;

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID is required.",
      });
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    if (!conversation.unreadCounts) {
      conversation.unreadCounts = new Map();
    }

    conversation.unreadCounts.set(String(userId), 0);
    await conversation.save();

    await Message.updateMany(
      {
        conversation: conversationId,
        sender: { $ne: userId },
        readBy: { $ne: userId },
      },
      {
        $addToSet: { readBy: userId },
      }
    );

    const messages = await Message.find({
      conversation: conversationId,
    })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("Get messages error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to load messages.",
    });
  }
};

// Export both controller functions.
module.exports = {
  sendMessage,
  getMessages,
};
