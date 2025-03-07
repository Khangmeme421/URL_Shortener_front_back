const express = require("express");
const router = express.Router();
const vocabController = require("../controllers/vocabController");

router.get("/", vocabController.getAllLinks);
router.get("/search", vocabController.getLinkByUrl);
router.get("/shortURL", vocabController.getLinkByShortenedLink);
router.post("/", vocabController.createLink);
router.put("/:id", vocabController.updateLink);
router.delete("/:id", vocabController.deleteLink);

module.exports = router;
