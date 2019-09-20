import { withFilter } from "graphql-yoga";
import User from "../../../entities/User";

const resolvers = {
  Subscription: {
    NearbyRideSubscription: {
      subscribe: withFilter(
        (_, __, { pubSub }) => {
          return pubSub.asyncIterator("rideRequest");
        },
        (payload, _, { context }) => {
          const user: User = context.currentUser;
          const {
            NearbyRideSubscription: { pickUpLat, pickUpLng }
          } = payload;
          const { lastLatitude, lastLongitude } = user;
          return (
            lastLatitude >= pickUpLat - 0.05 &&
            lastLatitude <= pickUpLat + 0.05 &&
            lastLongitude >= pickUpLng - 0.05 &&
            lastLongitude <= pickUpLng + 0.05
          );
        }
      )
    }
  }
};

export default resolvers;
