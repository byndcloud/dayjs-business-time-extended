export const DEFAULT_WORKING_HOURS = {
  sunday: null,
  monday: [{ start: '09:00:00', end: '17:00:00' }],
  tuesday: [{ start: '09:00:00', end: '17:00:00' }],
  wednesday: [{ start: '09:00:00', end: '17:00:00' }],
  thursday: [{ start: '09:00:00', end: '17:00:00' }],
  friday: [{ start: '09:00:00', end: '17:00:00' }],
  saturday: null,
};

export enum DaysNames {
  sunday = 0,
  monday = 1,
  tuesday = 2,
  wednesday = 3,
  thursday = 4,
  friday = 5,
  saturday = 6,
}
