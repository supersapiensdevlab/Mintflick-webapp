import { Feed } from "../models/feed.model";

/**
 * Find and update a post in feed
 * @param {Object} filter
 * @param {Object} update
 * @param {Object} options
 * @returns
 */
export const findOneAndUpdateFeed = async (
  filter: Object,
  update: Object,
  options: Object
) => {
  try {
    await Feed.findOneAndUpdate(filter, update, options);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error };
  }
};

/**
 * Update multiple posts in feed
 * @param {Object} filter
 * @param {Object} update
 * @returns
 */
export const updateMany = async (filter: Object, update: Object) => {
  try {
    await Feed.updateMany(filter, update);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error };
  }
};

/**
 * Delete post from feed
 * @param {Object} filter
 * @returns
 */
export const deleteOneFeed = async (filter: Object) => {
  try {
    await Feed.deleteOne(filter);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error };
  }
};

/**
 * Query data from feed
 * @param {Object} filter
 * @returns
 */
export const findOneFeed = async (filter: Object) => {
  try {
    const user = await Feed.findOne(filter);
    return { success: true, user: user, error: null };
  } catch (error) {
    return { success: false, user: null, error: error };
  }
};

/**
 * Query complete feed
 * @returns
 */
export const findFeed = async () => {
  try {
    const feed = await Feed.find();
    return { success: true, feed: feed, error: null };
  } catch (error) {
    return { success: false, feed: null, error: error };
  }
};
