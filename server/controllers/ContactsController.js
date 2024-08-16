import { User } from "../models/UserModel";

export const searchContacts = async (req, res, next) => {
  try {
    const { searchTerm } = req.body;
    if (searchTerm === undefined || searchTerm === null) {
      return res.status(400).send("searchTerm is required");
    }
    const sanitizedSeacrhTerm = searchTerm.replace(/[.*+?^${}|[\]\\]/g, "\\$&");

    const regex = new RegExp(sanitizedSeacrhTerm, "i");

    const contacts = await User.find({
      $and: [{ _id: { $ne: request.userId } }],
      $or: [{ firstName: regex }, { lastname: regex }, { email: regex }],
    });

    return res.status(200).json({ contacts });
    
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Internal Server Error");
  }
};
