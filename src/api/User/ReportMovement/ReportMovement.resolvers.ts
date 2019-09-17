import {
  ReportMovementMutationArgs,
  ReportMovementResponse
} from "src/types/graph";
import { Resolvers } from "src/types/resolvers";
import cleanNullArgs from "../../../utils/cleanNullArgs";
import { isAuthenticated } from "../../../utils/isAuthenticated";
import User from "src/entities/User";

const resolvers: Resolvers = {
  Mutation: {
    ReportMovementResponse: async (
      _,
      args: ReportMovementMutationArgs,
      { req }
    ): Promise<ReportMovementResponse> => {
      isAuthenticated(req);
      const user = req.user;
      // It's been repeated more than twice.
      // so make Ftn for this situation
      const notNull = cleanNullArgs(args);
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
