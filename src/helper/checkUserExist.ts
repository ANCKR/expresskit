import Auth from "../models/auth";
export async function checkUser(username: string) {
  const user = await Auth.findOne({ where: { username } });
  if (!user) {
    return false;
  }
  return true;
}

export async function checkUserData(username: string) {
  const user = await Auth.findOne({ where: { username } });
  if (!user) {
    return null;
  }
  return user;
}
