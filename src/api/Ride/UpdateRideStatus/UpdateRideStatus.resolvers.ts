import User from "src/entities/User";
import {
  UpdateRideStatusMutationArgs,
  UpdateRideStatusResponse
} from "src/types/graph";
import { Resolvers } from "src/types/resolvers";
import Chat from "../../../entities/Chat";
import Ride from "../../../entities/Ride";
import { isAuthenticated } from "../../../utils/isAuthenticated";

const resolvers: Resolvers = {
  Mutation: {
    UpdateRideStatus: async (
      _,
      args: UpdateRideStatusMutationArgs,
      { req, pubSub }
    ): Promise<UpdateRideStatusResponse> => {
      isAuthenticated(req);
      const user: User = req.user;
      if (user.isDriving) {
        try {
          let ride: Ride | undefined; // share the variable
          // first 'if'
          if (args.status === "ACCEPTED") {
            ride = await Ride.findOne(
              {
                id: args.rideId,
                status: "REQUESTING"
              },
              { relations: ["passenger"] }
            );
            if (ride) {
              ride.driver = user;
              user.isTaken = true;
              user.save();
              const chat = await Chat.create({
                driver: user,
                passenger: ride.passenger // relation => no error
              }).save();
              ride.chat = chat;
              ride.save();
            }
          } else {
            ride = await Ride.findOne({
              id: args.rideId,
              driver: user
            });
          }
          // second 'if'
          if (ride) {
            ride.status = args.status;
            ride.save();
            pubSub.publish("rideUpdate", { RideStatusSubscription: ride });
            return {
              ok: true,
              error: null
            };
          } else {
            return {
              ok: false,
              error: "Can't update ride"
            };
          }
        } catch (error) {
          return {
            ok: false,
            error: error.message
          };
        }
      } else {
        return {
          ok: false,
          error: "You are not driving now"
        };
      }
    }
  }
};

export default resolvers;

// make it small, module
