import { Router } from "express";
import {
  getConversations,
  createConversation,
  createGroupConversation,
  deleteConversation,
} from "../controllers/conversation.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect);

router.get   ("/",         getConversations);
router.post  ("/",         createConversation);
router.post  ("/group",    createGroupConversation);
router.delete("/:id",      deleteConversation);

export default router;