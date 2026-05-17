const supabase = require("../config/supabase");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status_code: 401,
        message: "Authorization token required",
        error: "Unauthorized",
      });
    }

    const token = authHeader.split(" ")[1];

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        status_code: 401,
        message: "Invalid or expired token",
        error: "Unauthorized",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: "Authentication error",
      error: error.message,
    });
  }
};

const isRecruiter = async (req, res, next) => {
  try {
    const { data: userProfile } = await supabase
      .from("users")
      .select("user_type")
      .eq("id", req.user.id)
      .single();

    if (userProfile?.user_type !== "recruiter") {
      return res.status(403).json({
        status_code: 403,
        message: "Access denied. Recruiter role required.",
        error: "Forbidden",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: "Authorization error",
      error: error.message,
    });
  }
};

module.exports = { authenticate, isRecruiter };
