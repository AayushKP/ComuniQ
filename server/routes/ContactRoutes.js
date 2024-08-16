import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware";
import { searchContacts } from "../controllers/ContactsController";
const contactRoutes = Router();

contactRoutes.post("/search", verifyToken, searchContacts);
