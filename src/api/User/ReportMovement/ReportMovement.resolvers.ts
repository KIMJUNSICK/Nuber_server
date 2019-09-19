import {
  ReportMovementMutationArgs,
  ReportMovementResponse
} from "src/types/graph";
import { Resolvers } from "src/types/resolvers";
import User from "../../../entities/User";
import cleanNullArgs from "../../../utils/cleanNullArgs";
import { isAuthenticated } from "../../../utils/isAuthenticated";

const resolvers: Resolvers = {
  Mutation: {
    ReportMovement: async (
      _,
      args: ReportMovementMutationArgs,
      { req, pubSub }
    ): Promise<ReportMovementResponse> => {
      isAuthenticated(req);
      const user: User = req.user;
      // It's been repeated more than twice.
      // so make Ftn for this situation
      const notNull = cleanNullArgs(args);
      try {
        await User.update({ id: user.id }, { ...notNull });
        pubSub.publish("driverUpdate", { DriversSubscription: user });
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
