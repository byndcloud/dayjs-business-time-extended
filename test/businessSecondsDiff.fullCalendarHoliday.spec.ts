import dayjs from 'dayjs';
import businessTime from '../src';

describe('businessSecondsDiff - full Mon-Fri calendar with holiday', () => {
  beforeAll(() => {
    dayjs.extend(businessTime);

    const fullCalendar: any = {
      sunday: null,
      monday: 'full',
      tuesday: 'full',
      wednesday: 'full',
      thursday: 'full',
      friday: 'full',
      saturday: null,
    };

    (dayjs as any).setBusinessTime(fullCalendar);
    (dayjs as any).setHolidays(['2026-04-21']);
  });

  it('should compute start.businessSecondsDiff(expireAt) when startAt > expireAt and expireAt falls on a full holiday', () => {
    const expireAt = dayjs('2026-04-21T03:00:00.000Z');
    const startAt = dayjs('2026-04-22T16:20:57.746Z');

    const diff = startAt.businessSecondsDiff(expireAt);

    // startAt is AFTER expireAt, so the diff must be negative (multiplier = -1).
    // April 21 is a full holiday (0 business seconds).
    // April 22 (Wednesday, full day) contributes from 00:00:00 to 16:20:57.746
    //   = 16 * 3600 + 20 * 60 + 57 = 58857 seconds.
    expect(diff).toBeDefined();
    expect(diff).toBe(-58857);
  });
});
