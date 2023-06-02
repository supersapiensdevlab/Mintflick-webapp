import moment from "moment";

export const calculateTimeToToday = (secs:number) => {
 return moment(secs* 1000).fromNow()
};
