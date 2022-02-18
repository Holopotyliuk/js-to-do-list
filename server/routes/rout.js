const express=require('express')
const router=express();
const controller=require('../controllers/controller.js')
router.get('/tasks',controller.read)
router.post('/tasks',controller.create)
router.delete('/tasks',controller.remove)
router.patch('/tasks',controller.updateDone)
module.exports=router