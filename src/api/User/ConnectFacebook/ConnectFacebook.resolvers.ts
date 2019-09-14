import User from "../../../entities/User";
import {
  ConnectFacebookMutationArgs,
  connectFacebookResponse
} from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import generateToken from "../../../utils/generateToken";

const resolvers: Resolvers = {
  Mutation: {
    ConnectFacebook: async (
      _,
      args: ConnectFacebookMutationArgs
    ): Promise<connectFacebookResponse> => {
      const { fbId } = args;
      try {
        const existingUser = await User.findOne({ fbId });
        if (existingUser) {
          const token = generateToken(existingUser.id);
          return {
            ok: true,
            error: null,
            token
          };
        }
      } catch (error) {
        return {
          ok: false,
          error: error.message,
          token: null
        };
      }
      try {
        const newUser = await User.create({
          ...args,
          profilePhoto: `http://graph.facebook.com/${fbId}/picture?type=squre`
        }).save();
        const token = generateToken(newUser.id);
        return {
          ok: true,
          error: null,
          token
        };
      } catch (error) {
        return {
          ok: false,
          error: error.message,
          token: null
        };
      }
    }
  }
};

export default resolvers;
