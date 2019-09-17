import User from "../../../entities/User";
import {
  UpdateMyProfileMutationArgs,
  UpdateMyProfileResponse
} from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import { isAuthenticated } from "../../../utils/isAuthenticated";

const resolvers: Resolvers = {
  Mutation: {
    UpdateMyProfile: async (
      _,
      args: UpdateMyProfileMutationArgs,
      { req }
    ): Promise<UpdateMyProfileResponse> => {
      isAuthenticated(req);
      const user: User = req.user;
      const notNull = {};
      Object.keys(args).forEach(key => {
        if (args[key] !== null) {
          notNull[key] = args[key];
        }
      });
      try {
        await User.update({ id: user.id }, { ...notNull });
        return {
          ok: true,
          error: null
        };
      } catch (error) {
        return {
          ok: false,
          error: error.message
        };
      }
    }
  }
};

export default resolvers;
