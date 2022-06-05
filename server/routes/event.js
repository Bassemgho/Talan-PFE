import { addEvent } from "../controllers/event.js";
import protectAdmin from '../middlewares/protectAdmin.js'
import protect from '../middlewares/protect.js'
import express from 'express'
import {getallpolls} from '../controllers/polls.js'
import { fetshallevents ,fetshuserevents,deleteEvent} from "../controllers/event.js";

const router = express.Router()
router.route('/getAllpolls').get(protect,getallpolls)
router.route('/events/delete').post(protectAdmin,deleteEvent);
router.route('/events/addevent').post(protect,addEvent);
router.route('/events/all').get(protect,fetshallevents);
router.route('/events/user').get(protect,fetshuserevents)
export default router
