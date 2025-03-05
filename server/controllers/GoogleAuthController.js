import jwt from "jsonwebtoken";

export const googleAuthCallback = (req, res) => {
  const user = req.user;

  const token = jwt.sign(
    { email: user.email, id: user.id },
    "your-secret-key",
    { expiresIn: "3d" }
  );

  res.cookie("jwt", token, {
    maxAge: 3 * 24 * 60 * 60 * 1000,
    secure: true,
    sameSite: "None",
  });

  res.redirect(process.env.CLIENT_REDIRECT_URL);
};
