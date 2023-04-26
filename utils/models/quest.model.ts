const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questSchema = new Schema({
  questId: {
    type: String,
    trim: true,
  },
  name: {
    type: String,
    trim: true,
  },banner:
  {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },  
   tasks:{
    type:Array,
    default:[]
   },
   status:{
    type:Boolean,
    default:true,
   }
  
} ,{ timestamps: true });

const Quest = mongoose.model('Quest', questSchema);
module.exports = Quest;
