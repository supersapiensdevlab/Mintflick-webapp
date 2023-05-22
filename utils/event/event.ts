import { Event } from "../models/event.model";

/**
 * Query all events
 * @returns
 */
export const findEvent = async () => {
  try {
    const event = await Event.find();
    return { success: true, event: event, error: null };
  } catch (error) {
    return { success: false, event: null, error: error };
  }
};

/**
 * Query single event
 * @param {Object} filter
 * @returns
 */
export const findOneEvent = async (filter: Object) => {
  try {
    const event = await Event.findOne(filter);
    return { success: true, event: event, error: null };
  } catch (error) {
    return { success: false, event: null, error: error };
  }
};

/**
 * Insert event in database
 * @param {Object} event
 * @returns
 */
export const insertOneEvent = async (event: Object) => {
  try {
    await Event.insertMany(event);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error };
  }
};

/**
 * Find and update an event
 * @param {Object} filter
 * @param {Object} update
 * @param {Object} options
 * @returns
 */
export const findOneAndUpdateEvent = async (
  filter: Object,
  update: Object,
  options: Object
) => {
  try {
    await Event.findOneAndUpdate(filter, update, options);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error };
  }
};

/**
 * Delete an event by id
 * @param {Object} filter
 * @returns
 */
export const findOneAndDeleteEvent = async (filter: Object) => {
  try {
    await Event.findOneAndDelete(filter);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error };
  }
};
