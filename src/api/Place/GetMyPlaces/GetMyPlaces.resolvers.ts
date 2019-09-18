import { GetMyPlacesResponse } from "src/types/graph";
import { Resolvers } from "src/types/resolvers";
import User from "../../../entities/User";
import { isAuthenticated } from "../../../utils/isAuthenticated";

const resolvers: Resolvers = {
  Query: {
    GetMyPlaces: async (_, __, { req }): Promise<GetMyPlacesResponse> => {
      isAuthenticated(req);
      try {
        const user = await User.findOne(
          { id: req.user.id },
          { relations: ["places"] }
        );
        if (user) {
          return {
            ok: true,
            error: null,
            places: user.places
          };
        } else {
          return {
            ok: false,
            error: "User Not Found",
            places: null
          };
        }
      } catch (error) {
        return {
          ok: false,
          error: error.message,
          places: null
        };
      }
    }
  }
};

export default resolvers;
