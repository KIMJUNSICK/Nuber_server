import { Resolvers } from "src/types/resolvers";
import { isAuthenticated } from "../../../utils/isAuthenticated";

const resolvers: Resolvers = {
  Query: {
    GetMyProfile: async (_, __, { req }) => {
      isAuthenticated(req);
      const { user } = req;
      return {
        ok: true,
        error: null,
        user
      };
    }
  }
};

export default resolvers;
