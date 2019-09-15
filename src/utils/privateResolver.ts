const privateResolver = resolverFtn => async (parent, args, context, info) => {
  if (!context.req.user) {
    throw Error("No JWT. I refuse to proceed");
  }
  const resolved = await resolverFtn(parent, args, context, info);
  return resolved;
};

export default privateResolver;
