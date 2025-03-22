// After successful e-Rupee payment
const user = await User.findById(userId);
user.spinsAvailable += 1; // Add 1 spin for each e-Rupee payment
await user.save(); 