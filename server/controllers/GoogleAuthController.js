import jwt from "jsonwebtoken";

export const googleAuthCallback = (req, res) => {
  const user = req.user;

  const token = jwt.sign(
    { email: user.email, userId: user.id },
    process.env.JWT_KEY,
    { expiresIn: 3 * 24 * 60 * 60 * 1000 }
  );

  res.cookie("jwt", token, {
    maxAge: 3 * 24 * 60 * 60 * 1000,
    secure: true,
    sameSite: "None",
  });

  res.redirect(process.env.CLIENT_REDIRECT_URL);
};
