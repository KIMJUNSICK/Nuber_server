import User from "../../../entities/User";
import Verification from "../../../entities/Verification";
import generateToken from "../../../utils/generateToken";

import { EmailSignUpMutationArgs, EmailSignUpResponse } from "src/types/graph";
import { Resolvers } from "src/types/resolvers";
import { sendKeyMail } from "../../../utils/sendMail";

const resolvers: Resolvers = {
  Mutation: {
    EmailSignUp: async (
      _,
      args: EmailSignUpMutationArgs
    ): Promise<EmailSignUpResponse> => {
      const { email } = args;
      try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return {
            ok: false,
            error: "You should log in instead",
            token: null
          };
        } else {
          const phoneVerification = await Verification.findOne({
            payload: args.phoneNumber,
            verified: true
          });
          if (phoneVerification) {
            const newUser = await User.create({
              ...args
            }).save();
            if (newUser.email) {
              const emailVerification = await Verification.create({
                payload: args.phoneNumber,
                target: "EMAIL"
              }).save();
              await sendKeyMail(
                newUser.fullName,
                newUser.email,
                emailVerification.key
              );
            }
            const token = generateToken(newUser.id);
            return {
              ok: true,
              error: null,
              token
            };
          } else {
            return {
              ok: false,
              error: "You haven't verified your phone number",
              token: null
            };
          }
        }
      } catch (error) {
        return {
          ok: false,
          error: error.message,
          token: null
        };
      }
    }
  }
};

export default resolvers;
