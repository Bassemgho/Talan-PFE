import { addEvent } from "../controllers/event.js";
import { uploadfile } from "../controllers/files.js"
import protectAdmin from '../middlewares/protectAdmin.js'
import protect from '../middlewares/protect.js'
import express from 'express'
import multer from 'multer'
import {getallpolls} from '../controllers/polls.js'
import { fetshallevents ,fetshuserevents,deleteEvent,updateEvent} from "../controllers/event.js";
import {getFile} from "../controllers/files.js"

const storage = multer.diskStorage(
    {
        destination: './uploads/',
        filename: function ( req, file, cb ) {
            //req.body is empty...
            //How could I get the new_file_name property sent from client here?
            cb( null, file.originalname+ '-' + Date.now()+".pdf");
        }
    }
);
const upload = multer({ storage: storage } )
const router = express.Router();

router.route('/events/fileinfo/:fileid').get(protect,getFile)
router.route('/uploadfile/:eventid').post([protect,upload.single('attachement')],uploadfile)
router.route('/getAllpolls').get(protect,getallpolls)
router.route('/events/update').post(protect,updateEvent)
router.route('/events/delete').post(protectAdmin,deleteEvent);
router.route('/events/addevent').post(protect,addEvent);
router.route('/events/all').get(protect,fetshallevents);
router.route('/events/user').get(protect,fetshuserevents)
export default router
