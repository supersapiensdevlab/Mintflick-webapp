import { User } from "@/utils/models/user.model";

export const addUser = async (user: Object) => {
  const newUser = new User(user);
  return newUser;
};

export const findById = async (user_id: String) => {
  const user = await User.findById(user_id);
  return user || null;
};

export const findOneAndUpdate = async (
  filter: Object,
  update: Object,
  options: Object
) => {
  User.findOneAndUpdate(filter, update, options);
};

export const findOne = async (filter: Object) => {
  const user = await User.findOne(filter);
  return user || null;
};

export const find = async (filter: Object) => {
  const user = await User.find(filter);
  return user || null;
};

export const findOneAndDelete = async (filter: Object) => {
  User.findOneAndDelete(filter);
};

export const updateOne = async (filter: Object, update: Object) => {
  User.updateOne(filter, update);
};
