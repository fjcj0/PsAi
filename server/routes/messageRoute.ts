import { Router } from "express";
import { sendMessageToAi } from "../controllers/messageController.controller";
import { upload } from "../utils/multer";

const router = Router();

router.post(
    "/send-message",
    upload.single("file"),
    sendMessageToAi
);

export default router;
