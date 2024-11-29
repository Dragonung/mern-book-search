const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args) => {
            if (context.user) {
                data = await User.findOne({ _id: context.user.id })
                    .select('-__v -password');
                return data;
            }
            return ('Please log in with username & password.');
        },
    },

    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { user, token };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if(!user) {
                return('User not found. Please create account.');
            }

            const correctPW = await user.isCorrectPassword(password);

            if(!correctPW) {
                return('Wrong password.');
            }

            const token = signToken(user);

            return { token, user };
        },
        saveBook: async (parent, { newBook }, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: {savedBooks: newBook }},
                    { new: true }
                );
                return updatedUser;
            }
            return('Please log in with username & password.');
        },
        removeBook: async(parent, { bookId }, context) => {
            if (context.user){
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: {bookId }}},
                    { new: true }
                );
                return updatedUser;
            };
            return ('Please log in with username & password.');
        }, 
    },
};

module.exports = resolvers;
