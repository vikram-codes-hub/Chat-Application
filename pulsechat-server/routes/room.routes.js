import { Router } from "express";
import {
  getRooms, getRoomById, createRoom,
  updateRoom, joinRoom, leaveRoom,
} from "../controllers/room.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect);

router.get ("/"         , getRooms);
router.get ("/:id"      , getRoomById);
router.post("/"         , createRoom);
router.put ("/:id"      , updateRoom);
router.post("/:id/join" , joinRoom);
router.post("/:id/leave", leaveRoom);

export default router;