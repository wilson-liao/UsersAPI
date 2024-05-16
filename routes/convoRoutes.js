const {Router} = require("express");
const router = Router();
const convoController = require("../controllers/convoController")

router.post("/postConvo", convoController.convo_post);
router.get("/getConvo/:id", convoController.convo_get);
router.put("/putConvo/:id", convoController.convo_put)
router.get("/getAllConvo", convoController.getAllConvo);
router.get("/deleteAllConvo", convoController.deleteAllConvo);

module.exports = router