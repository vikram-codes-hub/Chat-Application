import { Router } from "express";
import {
  getUsers, getUserById, updateProfile, updateStatus,
} from "../controllers/user.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect); // all user routes require auth

router.get  ("/",           getUsers);
router.get  ("/:id",        getUserById);
router.put  ("/profile",    updateProfile);
router.put  ("/status",     updateStatus);

export default router;