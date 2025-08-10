const express = require("express");
const router = express.Router();
const topicController = require("@/controllers/topic.controller");
// GET /topics
router.get("/", topicController.getAllTopics);
// Get topic by ID
router.get("/:id", topicController.getTopicById);
// Get topic by slug
router.get("/by-slug/:slug", topicController.getTopicBySlug);
// Create new topic
router.post("/", topicController.createTopic);
// Update topic
router.put("/:id", topicController.updateTopic);
// Delete topic 
router.delete("/:id", topicController.deleteTopic);

module.exports = router;
