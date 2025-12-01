import User from "../models/User.js"; // must point to correct User.js

export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    if (!firstName || !lastName || !email || !password)
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password,
    });

    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      }),
    });
  } catch (error) {
    console.error(error); // <-- always log error for debugging
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
