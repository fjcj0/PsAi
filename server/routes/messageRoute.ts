import { Router } from "express";
import { conversationsOfUser, deleteConversation, getMessagesByConversation, sendMessageToAi } from "../controllers/messageController.controller";
import { upload } from "../utils/multer";
import { verifySession } from "../middleware/verifySession";

const router = Router();

router.post(
    "/send-message",
    verifySession,
    upload.single("file"),
    sendMessageToAi
);

router.post('/conversations', verifySession, conversationsOfUser);

router.post('/get-messages', verifySession, getMessagesByConversation);

router.delete('/delete-conversation/:userId/:conversation', verifySession, deleteConversation);

export default router;