const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");
const { authenticate } = require("../middleware/auth");

router.post(
  "/jobs/:jobId/apply",
  authenticate,
  applicationController.applyForJob,
);
router.get("/", authenticate, applicationController.getMyApplications);
router.get(
  "/:applicationId",
  authenticate,
  applicationController.getApplicationById,
);
router.delete(
  "/:applicationId",
  authenticate,
  applicationController.withdrawApplication,
);

module.exports = router;
