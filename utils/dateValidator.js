export const validateDates = (checkIn, checkOut) => {

  const now = new Date();
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);

  if (isNaN(inDate) || isNaN(outDate))
    return 'Invalid date format';

  if (inDate >= outDate)
    return 'Checkout must be after checkin';

  if (inDate < now)
    return 'Checkin cannot be in the past';

  return null;
};
