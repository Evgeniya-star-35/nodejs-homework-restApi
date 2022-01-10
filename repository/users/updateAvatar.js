import User from "../../model/user";
import * as path from "path";
import * as fs from "fs/promises";
import jimp from "jimp";

const updateAvatar = async ({ userId, file }) => {
  const FILE_DIR = path.join(`./tmp/${file.filename}`);

  const AVATARS_DIR = path.join("./public/avatars");

  const [, extension] = file.originalname.split(".");
  const newImageName = `${Date.now()}.${extension}`;
  if (file) {
    const avatars = await jimp.read(FILE_DIR);
    await avatars
      .autocrop()
      .cover(
        250,
        250,
        jimp.HORIZONTAL_ALIGN_CENTER || jimp.VERTICAL_ALIGN_MIDDLE
      )
      .writeAsync(FILE_DIR);
    await fs.rename(FILE_DIR, path.join(AVATARS_DIR, newImageName));
  }
  const newFilePath = `/api/download/${newImageName}`;
  const newAvatar = await User.findOneAndUpdate(
    { _id: userId },
    { $set: { avatarURL: newFilePath } },
    { new: true }
  );
  return newAvatar.avatarURL;
};

export default updateAvatar;
