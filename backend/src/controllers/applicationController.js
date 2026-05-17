const supabase = require("../config/supabase");

// Apply for job
exports.applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { cover_letter, resume_url } = req.body;
    const userId = req.user.id;

    if (!cover_letter) {
      return res.status(400).json({
        status_code: 400,
        message: "Cover letter is required",
        error: "Bad Request",
      });
    }

    // Check if already applied
    const { data: existing } = await supabase
      .from("applications")
      .select("id")
      .eq("job_id", jobId)
      .eq("user_id", userId)
      .single();

    if (existing) {
      return res.status(400).json({
        status_code: 400,
        message: "You have already applied for this job",
        error: "Duplicate Application",
      });
    }

    // Create application
    const { data, error } = await supabase
      .from("applications")
      .insert({
        job_id: jobId,
        user_id: userId,
        cover_letter,
        resume_url,
        status: "applied",
      })
      .select()
      .single();

    if (error) throw error;

    // Increment applicants count
    await supabase.rpc("increment_applicants", { job_id: jobId });

    res.status(201).json({
      status_code: 201,
      message: "Application submitted successfully",
      application_id: data.id,
      applied_at: data.applied_at,
    });
  } catch (error) {
    res.status(500).json({
      status_code: 500,
      message: "Error submitting application",
      error: error.message,
    });
  }
};

// Get my applications
exports.getMyApplications = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const userId = req.user.id;

    const from = (page - 1) * limit;
    const to = from + parseInt(limit) - 1;

    let query = supabase
      .from("applications")
      .select(
        `
        *,
        jobs:job_id (
          id,
          title,
          company,
          company_logo,
          location,
          salary_min,
          salary_max
        )
      `,
        { count: "exact" },
      )
      .eq("user_id", userId)
      .order("applied_at", { ascending: false })
      .range(from, to);

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    const totalPages = Math.ceil(count / limit);

    res.json({
      status_code: 200,
      applications: data,
      pagination: {
        current_page: parseInt(page),
        total_pages: totalPages,
        total_items: count,
        items_per_page: parseInt(limit),
        has_next: page < totalPages,
        has_previous: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      status_code: 500,
      message: "Error fetching applications",
      error: error.message,
    });
  }
};

// Get application by ID
exports.getApplicationById = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user.id;

    const { data, error } = await supabase
      .from("applications")
      .select(
        `
        *,
        jobs:job_id (*)
      `,
      )
      .eq("id", applicationId)
      .eq("user_id", userId)
      .single();

    if (error || !data) {
      return res.status(404).json({
        status_code: 404,
        message: "Application not found",
        error: "Not Found",
      });
    }

    res.json({
      status_code: 200,
      application: data,
    });
  } catch (error) {
    res.status(500).json({
      status_code: 500,
      message: "Error fetching application",
      error: error.message,
    });
  }
};

// Withdraw application
exports.withdrawApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user.id;

    const { error } = await supabase
      .from("applications")
      .delete()
      .eq("id", applicationId)
      .eq("user_id", userId);

    if (error) throw error;

    res.json({
      status_code: 200,
      message: "Application withdrawn successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      status_code: 500,
      message: "Error withdrawing application",
      error: error.message,
    });
  }
};
