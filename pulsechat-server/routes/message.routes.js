import { Router } from "express";
import {
  getMessages, sendMessage, markAsSeen, deleteMessage,
} from "../controllers/message.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect);

router.get ("/:conversationId",          getMessages);
router.post("/:conversationId",          sendMessage);
router.put ("/:messageId/seen",          markAsSeen);
router.delete("/:messageId",             deleteMessage);

export default router;