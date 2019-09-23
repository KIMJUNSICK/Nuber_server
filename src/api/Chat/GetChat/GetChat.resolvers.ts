import User from "src/entities/User";
import { GetChatQueryArgs, GetChatResponse } from "src/types/graph";
import { Resolvers } from "src/types/resolvers";
import Chat from "../../../entities/Chat";
import { isAuthenticated } from "../../../utils/isAuthenticated";

const resolvers: Resolvers = {
  Query: {
    GetChat: async (
      _,
      args: GetChatQueryArgs,
      { req }
    ): Promise<GetChatResponse> => {
      isAuthenticated(req);
      const user: User = req.user;
      try {
        const chat = await Chat.findOne(
          {
            id: args.chatId
          },
          { relations: ["passenger", "driver"] }
        );
        if (chat) {
          if (chat.passengerId === user.id || chat.driverId === user.id) {
            return {
              ok: true,
              error: null,
              chat
            };
          } else {
            return {
              ok: false,
              error: "Not authorized to see this chat",
              chat: null
            };
          }
        } else {
          return {
            ok: false,
            error: "Chat not found",
            chat: null
          };
        }
      } catch (error) {
        return {
          ok: false,
          error: error.message,
          chat: null
        };
      }
    }
  }
};

export default resolvers;
