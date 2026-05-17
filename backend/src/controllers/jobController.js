const supabase = require("../config/supabase");

// Get all jobs with filters
exports.getJobs = async (req, res) => {
  try {
    const {
      search,
      location,
      job_type,
      experience,
      min_salary,
      max_salary,
      page = 1,
      limit = 20,
      sort_by = "posted_at",
      order = "desc",
    } = req.query;

    const from = (page - 1) * limit;
    const to = from + parseInt(limit) - 1;

    let query = supabase
      .from("jobs")
      .select("*", { count: "exact" })
      .eq("is_active", true);

    // Apply filters
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }
    if (location) {
      query = query.ilike("location", `%${location}%`);
    }
    if (job_type) {
      query = query.eq("job_type", job_type);
    }
    if (experience) {
      query = query.eq("experience", experience);
    }
    if (min_salary) {
      query = query.gte("salary_min", min_salary);
    }
    if (max_salary) {
      query = query.lte("salary_max", max_salary);
    }

    // Sorting and pagination
    query = query
      .order(sort_by, { ascending: order === "asc" })
      .range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    const totalPages = Math.ceil(count / limit);

    res.json({
      status_code: 200,
      jobs: data,
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
      message: "Error fetching jobs",
      error: error.message,
    });
  }
};

// Get job by ID
exports.getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;

    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", jobId)
      .single();

    if (error || !data) {
      return res.status(404).json({
        status_code: 404,
        message: "Job not found",
        error: "Not Found",
      });
    }

    // Increment views
    await supabase.rpc("increment_job_views", { job_id: jobId });

    res.json({
      status_code: 200,
      job: data,
    });
  } catch (error) {
    res.status(500).json({
      status_code: 500,
      message: "Error fetching job",
      error: error.message,
    });
  }
};

// Get similar jobs
exports.getSimilarJobs = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { limit = 5 } = req.query;

    // Get current job
    const { data: currentJob } = await supabase
      .from("jobs")
      .select("skills, job_type")
      .eq("id", jobId)
      .single();

    if (!currentJob) {
      return res.status(404).json({
        status_code: 404,
        message: "Job not found",
        error: "Not Found",
      });
    }

    // Find similar jobs
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("is_active", true)
      .neq("id", jobId)
      .eq("job_type", currentJob.job_type)
      .limit(parseInt(limit));

    if (error) throw error;

    res.json({
      status_code: 200,
      jobs: data,
    });
  } catch (error) {
    res.status(500).json({
      status_code: 500,
      message: "Error fetching similar jobs",
      error: error.message,
    });
  }
};
