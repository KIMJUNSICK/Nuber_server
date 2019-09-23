import { GetRideQueryArgs, GetRideResponse } from "src/types/graph";
import { Resolvers } from "src/types/resolvers";
import Ride from "../../../entities/Ride";
import User from "../../../entities/User";
import { isAuthenticated } from "../../../utils/isAuthenticated";

const resolvers: Resolvers = {
  Query: {
    GetRide: async (
      _,
      args: GetRideQueryArgs,
      { req }
    ): Promise<GetRideResponse> => {
      isAuthenticated(req);
      const user: User = req.user;

      try {
        const ride = await Ride.findOne(
          { id: args.rideId },
          { relations: ["passenger", "driver"] }
        ); // relationship which is in prisma to 'computed'

        if (ride) {
          // ride.driver.id === user.id
          // database seem to have a hard time dealing with this expression
          if (ride.driverId === user.id || ride.passengerId === user.id) {
            return {
              ok: true,
              error: null,
              ride
            };
          } else {
            return {
              ok: false,
              error: "Not Authorized",
              ride: null
            };
          }
        } else {
          return {
            ok: false,
            error: "Ride not found",
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
    }
  }
};

export default resolvers;
