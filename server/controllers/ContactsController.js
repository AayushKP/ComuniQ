import { User } from "../models/UserModel";

export const searchContacts = async (req, res, next) => {
  try {
    const { searchTerm } = req.body;
    if(searchTerm=== undefined || searchTerm === null){
        return res.status(400).send("searchTerm is required")
    }
    
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Internal Server Error");
  }
};
