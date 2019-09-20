import { RequestRideMutationArgs, RequestRideResponse } from "src/types/graph";
import { Resolvers } from "src/types/resolvers";
import Ride from "../../../entities/Ride";
import User from "../../../entities/User";
import { isAuthenticated } from "../../../utils/isAuthenticated";

const resolvers: Resolvers = {
  Mutation: {
    RequestRide: async (
      _,
      args: RequestRideMutationArgs,
      { req, pubSub }
    ): Promise<RequestRideResponse> => {
      isAuthenticated(req);
      const user: User = req.user;
      if (!user.isRiding) {
        try {
          const ride = await Ride.create({ ...args, passenger: user }).save();
          pubSub.publish("rideRequest", { NearbyRideSubscription: ride });
          return {
            ok: true,
            error: null,
            ride
          };
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
          error: "Your are already riding!",
          ride: null
        };
      }
    }
  }
};

export default resolvers;
