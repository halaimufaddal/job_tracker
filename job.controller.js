import Jobs from "../Models/job.models.js";
import jobs from "../Models/job.models.js"

export const createJobPost = async (req, res) => {
    try {
        const newJob = await new jobs({
            companyName: req.body.companyName,
            role: req.body.role,
            jobType: req.body.jobType,
            status: req.body.status,
            jobLinks: req.body.jobLinks,
            notes: req.body.notes
        });


        const savedJob = await newJob.save();
        res.status(201).json({
            message: "new job is created successfully!",
            savedJob
        });
    } catch (err) {
        res.status(400).json({
            message: "An error occured",
            error: err.message
        });
    }
};


export const getAllJobs = async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status && status !== "All") {
      query.status = status;
    }

    if (search && search.trim() !== "") {
      query.$or = [
        { companyName: { $regex: search.trim(), $options: "i" } },
        { role: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const jobs = await Jobs.find(query).sort({ createdAt: -1 });

    const allJobs = await Jobs.find();
    const stats = {
      total: allJobs.length,
      applied: allJobs.filter((j) => j.status === "Applied").length,
      interviewing: allJobs.filter((j) => j.status === "Interviewing").length,
      offer: allJobs.filter((j) => j.status === "Offer").length,
      rejected: allJobs.filter((j) => j.status === "Rejected").length,
    };

    res.status(200).json({
      count: jobs.length,
      stats,
      jobs,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch jobs",
      error: err.message,
    });
  }
};


export const UpdateJob = async (req, res) => {
    try {
        const { id } = req.params;

        const updateJob = await jobs.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        })
        if (!updateJob) {
            return res.status(404).json({ message: "Job not found" });
        }

        res.status(200).json({
            message: "Job updated successfully",
            job: updateJob,
        });
    } catch (err) {
        res.status(400).json({
            message: "Failed to update job",
            error: err.message,
        });
    }
};

export const deleteJob = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteJob = await jobs.findByIdAndDelete(id)

        if (!deleteJob) {
            return res.status(404).json({ message: "Job not found" });
        }
        res.status(200).json({
            message: "Job deleted successfully",
            deleteJob,
        });
    } catch (err) {
        res.status(400).json({
            message: "Failed to delete job",
            error: err.message,
        });
    }
}







