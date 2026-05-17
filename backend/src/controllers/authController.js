const supabase = require("../config/supabase");

// Register
exports.register = async (req, res) => {
  try {
    const { email, password, full_name, user_type } = req.body;

    // Validate input
    if (!email || !password || !full_name || !user_type) {
      return res.status(400).json({
        status_code: 400,
        message: "All fields are required",
        error: "Bad Request",
      });
    }

    // Register with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return res.status(400).json({
        status_code: 400,
        message: authError.message,
        error: "Registration Failed",
      });
    }

    // Insert user profile
    const { error: profileError } = await supabase.from("users").insert({
      id: authData.user.id,
      email,
      full_name,
      user_type,
    });

    if (profileError) {
      return res.status(400).json({
        status_code: 400,
        message: profileError.message,
        error: "Profile Creation Failed",
      });
    }

    res.status(201).json({
      status_code: 201,
      message: "User registered successfully",
      access_token: authData.session.access_token,
      refresh_token: authData.session.refresh_token,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        full_name,
        user_type,
        created_at: authData.user.created_at,
      },
    });
  } catch (error) {
    res.status(500).json({
      status_code: 500,
      message: "Server error",
      error: error.message,
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status_code: 400,
        message: "Email and password are required",
        error: "Bad Request",
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({
        status_code: 401,
        message: "Invalid credentials",
        error: error.message,
      });
    }

    // Get user profile
    const { data: profile } = await supabase
      .from("users")
      .select("*")
      .eq("id", data.user.id)
      .single();

    res.json({
      status_code: 200,
      message: "Login successful",
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: profile || {
        id: data.user.id,
        email: data.user.email,
        created_at: data.user.created_at,
      },
    });
  } catch (error) {
    res.status(500).json({
      status_code: 500,
      message: "Server error",
      error: error.message,
    });
  }
};

// Logout
exports.logout = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return res.status(400).json({
        status_code: 400,
        message: error.message,
        error: "Logout Failed",
      });
    }

    res.json({
      status_code: 200,
      message: "Logout successful",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      status_code: 500,
      message: "Server error",
      error: error.message,
    });
  }
};
