import { GetNearbyRidesResponse } from "src/types/graph";
import { Resolvers } from "src/types/resolvers";
import { Between } from "typeorm";
import Ride from "../../../entities/Ride";
import User from "../../../entities/User";
import { isAuthenticated } from "../../../utils/isAuthenticated";

const resolvers: Resolvers = {
  Query: {
    GetNearbyRides: async (_, __, { req }): Promise<GetNearbyRidesResponse> => {
      isAuthenticated(req);
      const user: User = req.user;
      if (user.isDriving) {
        const { lastLatitude, lastLongitude } = user;
        try {
          const rides = await Ride.find({
            status: "REQUESTING",
            pickUpLat: Between(lastLatitude - 0.05, lastLatitude - 0.05),
            pickUpLng: Between(lastLongitude - 0.05, lastLongitude + 0.05)
          });
          return {
            ok: true,
            error: null,
            rides
          };
        } catch (error) {
          return {
            ok: false,
            error: error.message,
            rides: null
          };
        }
      } else {
        return {
          ok: false,
          error: "You are not a driving",
          rides: null
        };
      }
    }
  }
};

export default resolvers;
