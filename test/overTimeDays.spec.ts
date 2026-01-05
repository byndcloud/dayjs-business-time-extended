import dayjs from 'dayjs';
import businessTime from '../src';

describe('overtimeDaysTimes (new format)', () => {
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

    const overTimeDays = {
      '2025-12-25': [{ start: '08:00:00', end: '18:00:00' }],
    };

    (dayjs as any).setOvertimeDays(overTimeDays);
  });

  it('should return three hours in seconds for businessSecondsDiff when comparator is on a overtime day.', () => {
    const inicio = dayjs('2025-12-24 20:00:00');
    const fim = dayjs('2025-12-25 11:00:00');

    // Tres horas em segundos.
    const expectedSeconds = 10800;
    const seconds = (inicio as any).businessSecondsDiff(fim);

    expect(seconds).toBe(expectedSeconds);
  });

  it('should support multiple overtime days add segments', () => {
    const overTimeDays = {
      '2025-12-24': [
        { start: '19:00:00', end: '22:00:00' },
        { start: '06:00:00', end: '08:00:00' },
      ],
    };

    (dayjs as any).setOvertimeDays(overTimeDays);

    const inicio = dayjs('2025-12-24 20:00:00');
    const fim = dayjs('2025-12-25 11:00:00');

    const outputExpectedInSeconds = 5;
    const seconds = (inicio as any).businessHoursDiff(fim);

    expect(seconds).toBe(outputExpectedInSeconds);
  });

  it('should support multiple overtime days add segments including partial overlap with business hours', () => {
    const overTimeDays = {
      '2025-12-25': [
        { start: '12:00:00', end: '18:00:00' },
        { start: '09:00:00', end: '10:00:00' },
        { start: '02:00:00', end: '08:00:00' },
      ],
    };

    (dayjs as any).setOvertimeDays(overTimeDays);

    const inicio = dayjs('2025-12-24 20:00:00');
    const fim = dayjs('2025-12-25 11:00:00');

    const outputExpectedInSeconds = 32400;
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

    const overTimeDays = {
      '2025-12-25': [
        { start: '12:00:00', end: '18:00:00' },
        { start: '09:00:00', end: '10:00:00' },
        { start: '02:00:00', end: '08:30:00' },
      ],
    };

    (dayjs as any).setOvertimeDays(overTimeDays);

    const inicio = dayjs('2025-12-24 20:00:00');
    const nextBusinessTime = (inicio as any).nextBusinessTime();
    const formattedNextBusinessTime = nextBusinessTime.format('YYYY-MM-DD HH:mm:ss');
    const expectedNextBusinessTime = '2025-12-24 20:00:00';

    expect(formattedNextBusinessTime).toBe(
      expectedNextBusinessTime,
    );
  });
});
