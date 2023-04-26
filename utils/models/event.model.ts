const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema(
  {
    eventId: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    freeEvent: {
      type: Boolean,
    },
    ticketPrice: {
      type: String,
      default: '0',
    },
    unlimitedTickets: {
      type: Boolean,
    },
    ticketCount: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
      trim: true,
    },
    endTime: {
      type: String,
      trim: true,
    },
    timeZone: {
      type: String,
      trim: true,
      default: 'Asia/Kolkata',
    },
    eventImage: {
      type: String,
    },
    eventGallery: {
      type: String,
    },
    eventHost: {
      type: String,
      trim: true,
    },
    eventUrl: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    lockId: {
      type: String,
      trim: true,
    },
    withdrawn: {
      type: Boolean,
      default: false,
    },
    verifiedTickets: {
      type: [String],
      default: [],
      validate: {
        validator: function (arr) {
          // Custom validator function to check for unique values
          const uniqueValues = new Set(arr);
          return uniqueValues.size === arr.length;
        },
        message: 'Duplicate values found in the array', // Custom error message
      },
    },
    bookings: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true },
);

export const Event = mongoose.model('Event', eventSchema);