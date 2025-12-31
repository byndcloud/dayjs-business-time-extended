import dayjs from 'dayjs';
import businessTime from '../src';

describe('Set Calendar Validation', () => {
  beforeAll(() => {
    dayjs.extend(businessTime);
  });

  it('should throw when setting business time with start > end', () => {
    const calendar: any = {
      sunday: [{ start: '22:00:00', end: '20:59:00' }],
      monday: [{ start: '22:00:00', end: '20:59:00' }],
      tuesday: [{ start: '22:00:00', end: '20:59:00' }],
      wednesday: [{ start: '22:00:00', end: '20:59:00' }],
      thursday: [{ start: '22:00:00', end: '20:59:00' }],
      friday: [{ start: '22:00:00', end: '20:59:00' }],
      saturday: [{ start: '22:00:00', end: '20:59:00' }],
    };

    expect(() => {
      (dayjs as any).setBusinessTime(calendar);
    }).toThrow(/Invalid time range/);
  });

  it('should throw when setting holidays (new format) with start > end', () => {
    const holidays: any = {
      '2025-12-25': [{ start: '22:00:00', end: '20:59:00' }],
    };

    expect(() => {
      (dayjs as any).setHolidays(holidays);
    }).toThrow(/Invalid time range/);
  });
});
