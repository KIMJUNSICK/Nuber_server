import {
  CompleteEmailVerificationResponse,
  CompletePhoneVerificationMutationArgs
} from "../../..//types/graph";
import { Resolvers } from "../../..//types/resolvers";
import { isAuthenticated } from "../../..//utils/isAuthenticated";
import User from "../../../entities/User";
import Verification from "../../../entities/Verification";

const resolvers: Resolvers = {
  Mutation: {
    CompleteEmailVerification: async (
      _,
      args: CompletePhoneVerificationMutationArgs,
      { req }
    ): Promise<CompleteEmailVerificationResponse> => {
      isAuthenticated(req);
      const user: User = req.user;
      const { key } = args;
      if (user.email) {
        try {
          const verification = await Verification.findOne({
            key,
            payload: user.email
          });
          if (verification) {
            user.verifiedEmail = true;
            user.save();
            return {
              ok: true,
              error: null
            };
          } else {
            return {
              ok: false,
              error: "Can't verify email"
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
          error: "No email to verify"
        };
      }
    }
  }
};

export default resolvers;
