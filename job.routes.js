import express from "express"
import { createJobPost, getAllJobs,UpdateJob, deleteJob} from "../Controllers/job.controller.js";

const router=express.Router();

router.post("/create",createJobPost);
router.get("/read",getAllJobs)
router.patch("/update/:id",UpdateJob)
router.delete("/delete/:id",deleteJob);

export default router;