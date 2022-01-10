import User from "../../model/user";

const updateSub = async ({ token, subscription }, userId) => {
  const updateUserSubscription = await User.findByIdAndUpdate(
    { _id: userId, token },
    { $set: { subscription } },
    { new: true }
  );
  if (!updateUserSubscription) {
    throw new Error();
  }
  return updateUserSubscription;
};

export default updateSub;
