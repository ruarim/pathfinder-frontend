export default function timeFormatter(time: string) {
  let amPm = "";
  let formattedTime = "";
  const timesArray = time.split(":");
  parseInt(timesArray[0]) >= 12 ? (amPm = "pm") : (amPm = "am");
  formattedTime = `${timesArray[0]}:${timesArray[1]} ${amPm}`;
  return formattedTime;
}
