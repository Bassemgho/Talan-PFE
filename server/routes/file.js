import protectAdmin from '../middlewares/protectAdmin.js'

import protect from '../middlewares/protect.js'

import express from 'express'
import {getmyfiles,downloadFile} from '../controllers/files.js'
const router = express.Router();
router.route('/files/download/:file_id').get(protect,downloadFile)
router.route('/files/getuserfiles').get(protect,getmyfiles)

export default router
