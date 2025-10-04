import { Router } from "express";
import { conversationsOfUser, deleteConversation, getMessagesByConversation } from "../controllers/messageController.controller";
import { verifySession } from "../middleware/verifySession";

const router = Router();

router.get('/conversations', verifySession, conversationsOfUser);

router.get('/get-messages/:userId/:conversationId', verifySession, getMessagesByConversation);

router.delete('/delete-conversation/:userId/:conversationId', verifySession, deleteConversation);

export default router;