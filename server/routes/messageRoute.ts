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

router.get('/conversations', verifySession, conversationsOfUser);

router.get('/get-messages/:userId/:conversationId', verifySession, getMessagesByConversation);

router.delete('/delete-conversation/:userId/:conversationId', verifySession, deleteConversation);

export default router;