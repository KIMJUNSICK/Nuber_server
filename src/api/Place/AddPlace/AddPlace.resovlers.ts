import Place from "../../../entities/Place";
import User from "../../../entities/User";
import { AddPlaceMutationArgs, AddPlaceResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import { isAuthenticated } from "../../../utils/isAuthenticated";

const resolvers: Resolvers = {
  Mutation: {
    AddPlace: async (
      _,
      args: AddPlaceMutationArgs,
      { req }
    ): Promise<AddPlaceResponse> => {
      isAuthenticated(req);
      const user: User = req.user;
      try {
        await Place.create({ ...args, user }).save();
        return {
          ok: true,
          error: null
        };
      } catch (error) {
        return {
          ok: false,
          error: error.message
        };
      }
    }
  }
};

export default resolvers;
