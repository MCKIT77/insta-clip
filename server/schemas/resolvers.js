const { Video, User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    videos: async () => {
      return await Video.find();
    },
    video: async (parent, { _id }) => {
      return await Video.findById(_id);
    },
    user: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id).populate(
          'videos'
        );

        user.videos.sort((a, b) => b.uploadDate - a.uploadDate);

        return user;
      }

      throw AuthenticationError;
    }
  },
  Mutation: {
    uploadVideo: async (parent, { title, path }, context) => {
      if (context.user) {
        const video = await Video.create({ path, uploadDate: new Date() });
        await User.findByIdAndUpdate(context.user._id, { $push: { videos: video._id } });
        return video;
      }
      throw new AuthenticationError('Not logged in');
    },
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    updateUser: async (parent, args, context) => {
      if (context.user) {
        return await User.findByIdAndUpdate(context.user._id, args, { new: true });
      }

      throw AuthenticationError;
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw AuthenticationError;
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(user);

      return { token, user };
    }
  }
};

module.exports = resolvers;
