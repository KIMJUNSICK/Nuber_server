import { Resolvers } from "src/types/resolvers";
import { Between } from "typeorm";
import User from "../../../entities/User";
import { GetNearbyDriversResponse } from "../../../types/graph";
import { isAuthenticated } from "../../../utils/isAuthenticated";

const resolvers: Resolvers = {
  Query: {
    GetNearbyDrivers: async (
      _,
      __,
      { req }
    ): Promise<GetNearbyDriversResponse> => {
      isAuthenticated(req);
      const user: User = req.user;
      const { lastLatitude, lastLongitude } = user;
      try {
        const drivers: User[] = await User.find({
          isDriving: true,
          lastLatitude: Between(lastLatitude - 0.05, lastLatitude + 0.05),
          lastLongitude: Between(lastLongitude - 0.05, lastLongitude + 0.05)
        });
        return {
          ok: true,
          error: null,
          drivers
        };
      } catch (e) {
        return {
          ok: false,
          error: e.message,
          drivers: null
        };
      }
    }
  }
};

export default resolvers;
