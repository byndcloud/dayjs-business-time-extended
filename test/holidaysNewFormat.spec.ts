import dayjs from 'dayjs';
import businessTime from '../src';

describe('Holidays (new format)', () => {
  beforeAll(() => {
    dayjs.extend(businessTime);

    (dayjs as any).setBusinessTime({
      sunday: null,
      monday: [{ start: '08:00:00', end: '18:00:00' }],
      tuesday: [{ start: '08:00:00', end: '18:00:00' }],
      wednesday: [{ start: '08:00:00', end: '18:00:00' }],
      thursday: [{ start: '08:00:00', end: '18:00:00' }],
      friday: [{ start: '08:00:00', end: '18:00:00' }],
      saturday: null,
    });

    const holidays = {
      '2025-12-25': [{ start: '08:00:00', end: '18:00:00' }],
    };

    (dayjs as any).setHolidays(holidays);
  });

  it('should return 0 seconds for businessSecondsDiff when comparator is on a holiday (new format)', () => {
    const inicio = dayjs('2025-12-24 20:00:00');
    const fim = dayjs('2025-12-25 11:01:01');

    const expectedSeconds = 0;
    const seconds = (inicio as any).businessSecondsDiff(fim);

    expect(seconds).toBe(expectedSeconds);
  });

  it('should support partial holiday exclusions (new format)', () => {
    const holidays = {
      '2025-12-25': [{ start: '12:00:00', end: '18:00:00' }],
    };

    (dayjs as any).setHolidays(holidays);

    const inicio = dayjs('2025-12-24 20:00:00');
    const fim = dayjs('2025-12-25 11:00:00');

    const outputExpectedInSeconds = 10800;
    const seconds = (inicio as any).businessSecondsDiff(fim);

    expect(seconds).toBe(outputExpectedInSeconds);
  });

  it('should support multiple holiday exclusion segments (new format)', () => {
    const holidays = {
      '2025-12-25': [
        { start: '12:00:00', end: '18:00:00' },
        { start: '09:00:00', end: '10:00:00' },
      ],
    };

    (dayjs as any).setHolidays(holidays);

    const inicio = dayjs('2025-12-24 20:00:00');
    const fim = dayjs('2025-12-25 11:00:00');

    const outputExpectedInSeconds = 7200;
    const seconds = (inicio as any).businessSecondsDiff(fim);

    expect(seconds).toBe(outputExpectedInSeconds);
  });

  it('should support multiple holiday exclusion segments including partial overlap with business hours (new format)', () => {
    const holidays = {
      '2025-12-25': [
        { start: '12:00:00', end: '18:00:00' },
        { start: '09:00:00', end: '10:00:00' },
        { start: '02:00:00', end: '08:30:00' },
      ],
    };

    (dayjs as any).setHolidays(holidays);

    const inicio = dayjs('2025-12-24 20:00:00');
    const fim = dayjs('2025-12-25 11:00:00');

    const outputExpectedInSeconds = 5400;
    const seconds = (inicio as any).businessSecondsDiff(fim);

    expect(seconds).toBe(outputExpectedInSeconds);
  });

  it('should return the same time for nextBusinessTime when already inside a segment (24h schedule)', () => {
    (dayjs as any).setBusinessTime({
      sunday: [
        { start: '21:00:00', end: '23:59:00' },
        { start: '00:00:00', end: '20:59:00' },
      ],
      monday: [
        { start: '21:00:00', end: '23:59:00' },
        { start: '00:00:00', end: '20:59:00' },
      ],
      tuesday: [
        { start: '21:00:00', end: '23:59:00' },
        { start: '00:00:00', end: '20:59:00' },
      ],
      wednesday: [
        { start: '21:00:00', end: '23:59:00' },
        { start: '00:00:00', end: '20:59:00' },
      ],
      thursday: [
        { start: '21:00:00', end: '23:59:00' },
        { start: '00:00:00', end: '20:59:00' },
      ],
      friday: [
        { start: '21:00:00', end: '23:59:00' },
        { start: '00:00:00', end: '20:59:00' },
      ],
      saturday: [
        { start: '21:00:00', end: '23:59:00' },
        { start: '00:00:00', end: '20:59:00' },
      ],
    });

    const holidays = {
      '2025-12-25': [
        { start: '12:00:00', end: '18:00:00' },
        { start: '09:00:00', end: '10:00:00' },
        { start: '02:00:00', end: '08:30:00' },
      ],
    };

    (dayjs as any).setHolidays(holidays);

    const inicio = dayjs('2025-12-24 20:00:00');
    const nextBusinessTime = (inicio as any).nextBusinessTime();
    const expectedNextBusinessTime = '2025-12-24 20:00:00';

    expect(nextBusinessTime.format('YYYY-MM-DD HH:mm:ss')).toBe(
      expectedNextBusinessTime,
    );
  });
});
