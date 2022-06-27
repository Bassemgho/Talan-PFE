import express from 'express';
import {getChats,createChat} from '../controllers/chat.js'
import protect from '../middlewares/protect.js'

const router = express.Router();
router.route('/chat/getuserchats').get(protect,getChats)
router.route('/chat/createchat').post(protect,createChat)
export default router
