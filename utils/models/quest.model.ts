import {Schema, model} from 'mongoose';

interface IQuest {
  questId: string;
  name: string;
  banner: string;
  description: string;
  tasks: Array<string>;
  status: boolean;
}

const questSchema = new Schema<IQuest>({
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
    type: [String],
    default:[]
   },
   status:{
    type:Boolean,
    default:true,
   }
  
} ,{ timestamps: true });

export const Quest = model<IQuest>('Quest', questSchema);
