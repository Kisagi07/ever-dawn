/**
 * Create a more structured object for handling Time
 * - Easier way to add hours,minutes,seconds without handling the excess time prevention : hours 25 or minutes/seconds 61, this will automatically increment the upper level
 * - Get difference between 2 Time in hours, minutes, and seconds object
 */
class Time {
  hours = 0;
  minutes = 0;
  seconds = 0;

  /**
   * time in string format HH:mm:ss are required for converting to structured class
   * @example
   *
   * const time = "15:00:00"
   * const structuredTime = new Time(time) //  correct
   *
   * const time = "03:00 PM"
   * const structuredTime = new Time(time) // error
   *
   * @param time
   */
  constructor(time: string) {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    // validate if each time are valid value
    if (isNaN(hours)) {
      throw new Error("Hours result in NaN after converting");
    }
    if (isNaN(minutes)) {
      throw new Error("Minutes result in NaN after converting");
    }
    if (isNaN(seconds)) {
      throw new Error("Seconds result in NaN after converting");
    }

    // Assign converted values to property
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
  }

  /**
   * Find the difference in hours between 2 Time class
   * @example
   * a = new Time(22:00:00)
   * b = new Time(01:00:00)
   *
   * const diff = a.getDifference(b)
   * console.log(dif) // {hours: 3}
   *
   * @param time
   * @returns
   */
  getDifference = (time: Time) => {
    // variable to add for finding difference
    let alterHours = this.hours;
    // hour difference between 2 times
    let hourDifference = 0;
    // while the alterHours are not equal time.hours, it will keep adding incrementing alterHours and hourDifference until the hours match
    while (alterHours !== time.hours) {
      console.log(hourDifference);
      hourDifference++;
      alterHours++;
      if (alterHours === 24) {
        alterHours = 0;
      }
    }
    // minute variable to alter for finding difference
    let alterMinutes = this.minutes;
    // minutes difference between 2 times
    let minuteDifference = 0;
    // while the alterMinutes are not equal to time.minutes, it will keep incrementing `alterMinutes` and `minuteDifference`
    while (alterMinutes !== time.minutes) {
      alterMinutes++;
      minuteDifference++;
      if (alterMinutes === 60) {
        alterMinutes = 0;
        hourDifference--; // Adjust hour difference when minutes wrap around
        if (hourDifference < 0) {
          hourDifference = 23; // Handle negative hour difference
        }
      }
    }
    // return the hours and minutes difference
    return { hours: hourDifference, minutes: minuteDifference };
  };
}

export default Time;
