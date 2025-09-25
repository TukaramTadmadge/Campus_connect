const express = require("express");
const router = express.Router();
const wrapAsync = require("../middlewares/wrapAsync");
const { authorization } = require("../middlewares/authorization");
const chatController = require("../controllers/chat");

// -------- ONE-TO-ONE CHATS --------
router.post("/", authorization, wrapAsync(chatController.postChat));
router.get("/", authorization, wrapAsync(chatController.getChat));

// -------- GROUP CHATS --------
router.post("/group", authorization, wrapAsync(chatController.createGroup));
router.delete(
  "/deleteGroup/:chatId",
  authorization,
  wrapAsync(chatController.deleteGroup)
);
router.post("/rename", authorization, wrapAsync(chatController.renameGroup));
router.post("/groupremove", authorization, wrapAsync(chatController.removeFromGroup));
router.post("/groupadd", authorization, wrapAsync(chatController.addToGroup));

// -------- FETCH ALL GROUPS --------
router.get("/allgroups", authorization, wrapAsync(chatController.getAllGroups));

module.exports = router;
