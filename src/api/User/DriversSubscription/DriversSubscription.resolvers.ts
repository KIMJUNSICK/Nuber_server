import { withFilter } from "graphql-yoga";
import User from "../../../entities/User";

const resolvers = {
  Subscription: {
    DriversSubscription: {
      subscribe: withFilter(
        (_, __, { pubSub }) => {
          return pubSub.asyncIterator("driverUpdate");
        }, // asyncIterator Ftn
        (payload, _, { context }) => {
          const user: User = context.currentUser;
          const {
            DriversSubscription: {
              lastLatitude: driverLastLat,
              lastLongitude: driverLastLng
            }
          } = payload;
          const {
            lastLatitude: userLastLat,
            lastLongitude: userLastLng
          } = user;
          return (
            driverLastLat >= userLastLat - 0.05 &&
            driverLastLat <= userLastLat + 0.05 &&
            driverLastLng >= userLastLng - 0.05 &&
            driverLastLng <= userLastLng + 0.05
          );
        } // filter Ftn
      )
    }
  }
};

export default resolvers;

// withFilter(asyncIteratorFtn, filterFtn)
// filter's return (T/F) is condition for updating data to subscription
