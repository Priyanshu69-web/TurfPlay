import JWT from "jsonwebtoken";
import UserModel from "../models/userModel.js";

export const requireSignIn = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({
        success: false,
        message: "Authorization header missing or malformed",
      });
    }
    const token = authHeader.split(" ")[1];
    const decodedToken = JWT.verify(token, process.env.SECRET_KEY);

    if (!decodedToken?.tenantId || !decodedToken?.id) {
      return res.status(401).send({
        success: false,
        message: "Invalid token payload",
      });
    }

    req.user = {
      id: decodedToken.id,
      _id: decodedToken.id,
      role: decodedToken.role,
      tenantId: decodedToken.tenantId,
      email: decodedToken.email,
    };
    req.tenantId = decodedToken.tenantId;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).send({
      success: false,
      message: "Invalid token",
    });
  }
};


export const isAdmin = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({
      _id: req.user.id,
      tenantId: req.tenantId,
    });

    if (!user) {
      return res.status(401).send({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(401).send({
        success: false,
        message: "Unauthorized Access",
      });
    }

    req.currentUser = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in admin middleware",
    });
  }
};
