export const googleLogin = async (req, res) => {
  try {
    const { email, name, picture, googleId } = req.body;

    // Find or create user
    let user = await User.findOne({ googleId });
    const isNewUser = !user;

    if (!user) {
      user = await User.create({
        email,
        name,
        picture,
        googleId,
        spinsAvailable: 3, // Give 3 free spins to new users
        isFirstLogin: true
      });
    } else {
      // Check if user should get daily spin
      const now = new Date();
      const lastClaim = user.lastDailySpinClaim;
      
      if (!lastClaim || isNewDay(lastClaim, now)) {
        user.spinsAvailable += 1;
        user.lastDailySpinClaim = now;
        await user.save();
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id,
        email: user.email,
        name: user.name
      }, 
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE || '7d'
      }
    );

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        spinsAvailable: user.spinsAvailable,
        isNewUser
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function to check if it's a new day
const isNewDay = (lastClaim, now) => {
  if (!lastClaim) return true;
  
  const lastClaimDate = new Date(lastClaim);
  return (
    lastClaimDate.getDate() !== now.getDate() ||
    lastClaimDate.getMonth() !== now.getMonth() ||
    lastClaimDate.getFullYear() !== now.getFullYear()
  );
}; 