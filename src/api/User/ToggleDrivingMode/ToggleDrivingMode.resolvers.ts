import { ToggleDrivingModeResponse } from "src/types/graph";
import { Resolvers } from "src/types/resolvers";
import User from "../../../entities/User";
import { isAuthenticated } from "src/utils/isAuthenticated";

const resolvers: Resolvers = {
  Mutation: {
    ToggleDrivingMode: async (
      _,
      __,
      { req }
    ): Promise<ToggleDrivingModeResponse> => {
      isAuthenticated(req);
      const user: User = req.user;
      user.isDriving = !user.isDriving;
      user.save();
      return {
        ok: true,
        error: null
      };
    }
  }
};

export default resolvers;
