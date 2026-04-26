import JWT from "jsonwebtoken";

export const buildAuthPayload = (user) => ({
  id: user._id.toString(),
  _id: user._id.toString(),
  tenantId: user.tenantId.toString(),
  role: user.role,
  email: user.email,
});

export const signAuthToken = (user) =>
  JWT.sign(buildAuthPayload(user), process.env.SECRET_KEY, {
    expiresIn: "7d",
  });

export const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  tenantId: user.tenantId,
  phone: user.phone,
  address: user.address,
  profileImage: user.profileImage,
  isBlocked: user.isBlocked,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});
