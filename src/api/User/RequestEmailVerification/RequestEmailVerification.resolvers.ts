import { isAuthenticated } from "../../..//utils/isAuthenticated";
import { sendKeyMail } from "../../..//utils/sendMail";
import User from "../../../entities/User";
import Verification from "../../../entities/Verification";
import { RequestEmailVerificationResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";

const resolvers: Resolvers = {
  Mutation: {
    RequestEmailVerification: async (
      _,
      __,
      { req }
    ): Promise<RequestEmailVerificationResponse> => {
      isAuthenticated(req);
      const user: User = req.user;
      if (user.email && !user.verifiedEmail) {
        try {
          const oldVerification = await Verification.findOne({
            payload: user.email
          });
          if (oldVerification) {
            oldVerification.remove();
          }
          const newVerification = await Verification.create({
            payload: user.email,
            target: "EMAIL"
          }).save();
          await sendKeyMail(user.fullName, user.email, newVerification.key);
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
      } else {
        return {
          ok: false,
          error: "Your user has no Email to verify"
        };
      }
    }
  }
};

export default resolvers;
