import { GetNearbyRideResponse } from "src/types/graph";
import { Resolvers } from "src/types/resolvers";
import { Between } from "typeorm";
import Ride from "../../../entities/Ride";
import User from "../../../entities/User";
import { isAuthenticated } from "../../../utils/isAuthenticated";

const resolvers: Resolvers = {
  Query: {
    GetNearbyRide: async (_, __, { req }): Promise<GetNearbyRideResponse> => {
      isAuthenticated(req);
      const user: User = req.user;
      if (user.isDriving) {
        const { lastLatitude, lastLongitude } = user;
        try {
          const ride = await Ride.findOne({
            status: "REQUESTING",
            pickUpLat: Between(lastLatitude - 0.05, lastLatitude + 0.05),
            pickUpLng: Between(lastLongitude - 0.05, lastLongitude + 0.05)
          });
          if (ride) {
            return {
              ok: true,
              error: null,
              ride
            };
          } else {
            return {
              ok: true,
              error: null,
              ride: null
            };
          }
        } catch (error) {
          return {
            ok: false,
            error: error.message,
            ride: null
          };
        }
      } else {
        return {
          ok: false,
          error: "You are not a driving",
          ride: null
        };
      }
    }
  }
};

export default resolvers;
