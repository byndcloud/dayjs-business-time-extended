import dayjs from 'dayjs';
import businessTime from '../src';

describe('subtractBusinessSeconds - full Mon-Fri calendar with holidays', () => {
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
    (dayjs as any).setHolidays(['2026-04-23']);
  });

  it('should subtract 86400 business seconds skipping the 2026-04-23 holiday', () => {
    // startAt = Fri 2026-04-24 15:00:00 UTC
    // Fri 04-24 (full)    : 15:00:00 -> 00:00:00 = 15h  = 54000 s
    // Thu 04-23           : holiday                     =     0 s
    // Wed 04-22 (full)    : 24:00:00 -> 15:00:00 = 9h   = 32400 s
    // Total                                             = 86400 s
    const start = dayjs('2026-04-24T15:39:21.910Z');
    const result = start.subtractBusinessSeconds(86400);

    expect(result.toISOString()).toBe('2026-04-22T15:39:21.910Z');
  });
});
