export function offset() {
  let timezone_offset_min = new Date().getTimezoneOffset() + 60,
  offset_hrs = parseInt(Math.abs(timezone_offset_min/60)),
  offset_min = Math.abs(timezone_offset_min%60),
  timezone_standard;

   if(offset_hrs < 10)
  offset_hrs = '0' + offset_hrs;

   if(offset_min < 10)
  offset_min = '0' + offset_min;

   // Add an opposite sign to the offset
  // If offset is 0, it means timezone is UTC
  if(timezone_offset_min < 0)
  timezone_standard = '+' + offset_hrs + ':' + offset_min;
  else if(timezone_offset_min > 0)
  timezone_standard = '-' + offset_hrs + ':' + offset_min;
  else if(timezone_offset_min == 0)
  timezone_standard = 'Z';

   // Timezone difference in hours and minutes
  // String such as +5:30 or -6:00 or Z
  return timezone_standard;
}