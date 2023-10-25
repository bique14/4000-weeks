export const weeksSinceBirth = (dateOfBirth: string): number => {
  // Parse the date of birth string into a Date object
  const parts = dateOfBirth.split("/");
  const birthDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);

  // Get the current date
  const currentDate = new Date();

  // Calculate the time difference in milliseconds
  const timeDifference = currentDate.getTime() - birthDate.getTime();

  // Calculate the number of weeks
  const millisecondsInAWeek = 1000 * 60 * 60 * 24 * 7;
  const weeks = Math.floor(timeDifference / millisecondsInAWeek);

  return weeks;
};
