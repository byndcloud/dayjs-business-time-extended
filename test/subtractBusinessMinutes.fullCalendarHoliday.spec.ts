import dayjs from 'dayjs';
import businessTime from '../src';

describe('subtractBusinessMinutes - full Mon-Fri calendar with holidays', () => {
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
    (dayjs as any).setHolidays(['2026-04-21', '2026-04-23']);
  });

  it('should subtract 1440 business minutes from 2026-04-24T20:39:59.000Z skipping the 2026-04-23 holiday', () => {
    // startAt = Fri 2026-04-24 20:39:59 UTC
    // Fri 04-24 (full) : 20:39:59 -> 00:00:00 = 20h 39m 59s =  1239m 59s
    // Thu 04-23        : holiday                            =        0 s
    // Wed 04-22 (full) : 24:00:00 -> 20:39:59 =  3h 20m  1s =   200m  1s
    // Total                                                 = 1440 min
    const start = dayjs('2026-04-24T20:39:59.000Z');
    const result = start.subtractBusinessMinutes(1440);

    expect(result.toISOString()).toBe('2026-04-22T20:39:59.000Z');
  });
});
