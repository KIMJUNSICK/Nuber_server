import {
  SendChatMessageMutaitionArgs,
  SendChatMessageResponse
} from "src/types/graph";
import { Resolvers } from "src/types/resolvers";
import Chat from "../../../entities/Chat";
import Message from "../../../entities/Message";
import User from "../../../entities/User";
import { isAuthenticated } from "../../../utils/isAuthenticated";

const resolvers: Resolvers = {
  Mutation: {
    SendChatMessage: async (
      _,
      args: SendChatMessageMutaitionArgs,
      { req, pubSub }
    ): Promise<SendChatMessageResponse> => {
      isAuthenticated(req);
      const user: User = req.user;
      try {
        const chat = await Chat.findOne({ id: args.chatId });
        if (chat) {
          if (chat.driverId === user.id || chat.passengerId === user.id) {
            const message = await Message.create({
              text: args.text,
              user,
              chat
            }).save();
            pubSub.publish("newChatMessage", { MessageSubscription: message });
            return {
              ok: true,
              error: null,
              message
            };
          } else {
            return {
              ok: false,
              error: "Unauthorized",
              message: null
            };
          }
        } else {
          return {
            ok: false,
            error: "Chat not found",
            message: null
          };
        }
      } catch (error) {
        return {
          ok: false,
          error: error.message,
          message: null
        };
      }
    }
  }
};

export default resolvers;
