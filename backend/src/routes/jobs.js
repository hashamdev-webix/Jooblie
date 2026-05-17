const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");

router.get("/", jobController.getJobs);
router.get("/:jobId", jobController.getJobById);
router.get("/:jobId/similar", jobController.getSimilarJobs);

module.exports = router;
