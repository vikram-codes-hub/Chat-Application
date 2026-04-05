import { format, isToday, isYesterday } from 'date-fns';

export const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  return format(date, 'h:mm a'); 
};

export const formatConvTime = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  
  if (isToday(date)) {
    return format(date, 'h:mm a'); 
  } else if (isYesterday(date)) {
    return 'Yesterday';
  } else {
    return format(date, 'MM/dd/yyyy'); 
  }
};
