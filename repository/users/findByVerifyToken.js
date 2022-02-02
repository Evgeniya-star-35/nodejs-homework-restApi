import User from "../../model/user";

const findByVerifyToken = async (verifyTokenEmail) => {
  return await User.findOne({ verifyTokenEmail });
};
export default findByVerifyToken;
