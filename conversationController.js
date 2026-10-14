 
const Conversation = require("../models/Conversation");
const User = require("../models/User");

// Get all conversations for the logged-in user.
const getConversations = async (req, res) => {
  try {
    const currentUserId = req.user.userId;

    const conversations = await Conversation.find({
      participants: currentUserId,
    })
      .populate("participants", "name email profileImage status lastSeen")
      .sort({ lastMessageAt: -1, updatedAt: -1 })
      .lean();

    // Include the current user's unread count in every conversation.
    const conversationsWithUnreadCounts = conversations.map(
      (conversation) => ({
        ...conversation,
        unreadCount:
          conversation.unreadCounts?.[currentUserId.toString()] || 0,
      })
    );

    return res.status(200).json({
      success: true,
      conversations: conversationsWithUnreadCounts,
    });
  } catch (error) {
    console.error("Get conversations error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to load conversations.",
    });
  }
};

// Create or get a one-to-one conversation.
const createConversation = async (req, res) => {
  try {
    const { userId } = req.body;
    const currentUserId = req.user.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }

    if (String(currentUserId) === String(userId)) {
      return res.status(400).json({
        success: false,
        message: "You cannot create a conversation with yourself.",
      });
    }

    const otherUser = await User.findById(userId);

    if (!otherUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [currentUserId, userId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [currentUserId, userId],
      });
    }

    const populatedConversation = await Conversation.findById(
      conversation._id
    ).populate("participants", "name email profileImage status lastSeen");

    const conversationObject = populatedConversation.toObject();

    conversationObject.unreadCount =
      conversationObject.unreadCounts?.get?.(String(currentUserId)) || 0;

    return res.status(200).json({
      success: true,
      conversation: conversationObject,
    });
  } catch (error) {
    console.error("Create conversation error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while creating conversation.",
    });
  }
};

module.exports = {
  getConversations,
  createConversation,
};
