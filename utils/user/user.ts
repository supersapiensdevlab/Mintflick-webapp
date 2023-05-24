import { User } from "@/utils/models/user.model";
import { Mutex } from "async-mutex";

// Create an object to store the count of calls for each user
export const callCount: any = {};

// Create a mutex for synchronizing access to callCount object
const mutex = new Mutex();

/**
 * Adds a new user in database
 * @param {Object} user
 */
export const addUser = async (user: Object) => {
  const newUser = new User(user);
  return newUser;
};

/**
 * Find user by id
 * @param {String} user_id
 */
export const findById = async (user_id: String) => {
  try {
    const user = await User.findById(user_id);
    return { success: true, user: user, error: null };
  } catch (error) {
    return { success: false, user: null, error: error };
  }
};

/**
 * Find a user and update
 * @param {Object} filter
 * @param {Object} update
 * @param {Object} options
 * @returns
 */
export const findOneAndUpdate = async (
  filter: Object,
  update: Object,
  options: Object
) => {
  try {
    await User.findOneAndUpdate(filter, update, options);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error };
  }
};

/**
 * Query user by id and update
 * @param {Object} filter
 * @param {Object} update
 * @returns
 */
export const findByIdAndUpdate = async (filter: any, update: Object) => {
  try {
    const user = await User.findByIdAndUpdate(filter, update);
    return { success: true, user: user, error: null };
  } catch (error) {
    return { success: false, user: null, error: error };
  }
};

/**
 * Find a single user
 * @param {Object} filter
 * @returns
 */
export const findOne = async (filter: Object) => {
  try {
    const user = await User.findOne(filter);
    return { success: true, user: user, error: null };
  } catch (error) {
    return { success: false, user: null, error: error };
  }
};

/**
 * Find multiple users
 * @param {Object} filter
 * @returns
 */
export const find = async (filter: Object) => {
  try {
    const user = await User.find(filter);
    return { success: true, user: user, error: null };
  } catch (error) {
    return { success: false, user: null, error: error };
  }
};

/**
 * Find a user and delete
 * @param {Object} filter
 * @returns
 */
export const findOneAndDelete = async (filter: Object) => {
  try {
    await User.findOneAndDelete(filter);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error };
  }
};

/**
 * Update a single user
 * @param {Object} filter
 * @param {Object} update
 * @returns
 */
export const updateOne = async (filter: Object, update: Object) => {
  try {
    await User.updateOne(filter, update);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error };
  }
};

export const limitCheck = async (userId: String) => {
  if (!userId) {
    return { status: false, error: "Username is required" };
  }
  // Acquire the mutex before accessing/updating the callCount object
  const release = await mutex.acquire();
  try {
    if (!callCount.userId) {
      callCount.userId = 1; // Initialize the count for the user if not already present
    } else {
      callCount.userId++; // Increment the count for the user if already present
    }
    // res.json({ message: `Route called ${callCount[req.user_id]} time(s) by req.user_id ${req.user_id}` });
  } finally {
    release(); // Release the mutex after updating the callCount object
    return { status: true, error: null };
  }
};
