import dayjs from 'dayjs';
import businessTime from '../src';

describe('addBusinessMinutes - full Mon-Fri calendar with holidays', () => {
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

  it('should add 1440 business minutes from 2026-04-22T20:33:38.000Z skipping the 2026-04-23 holiday', () => {
    // startAt = Wed 2026-04-22 20:00:00 UTC
    // Wed 04-22 (full) : 20:00:00 -> 24:00:00 =  4h =  240 min
    // Thu 04-23        : holiday                    =    0 min
    // Fri 04-24 (full) : 00:00:00 -> 20:00:00 = 20h = 1200 min
    // Total                                         = 1440 min
    const start = dayjs('2026-04-22T20:33:38.000Z');
    const result = start.addBusinessMinutes(1440);

    expect(result.toISOString()).toBe('2026-04-24T20:33:38.000Z');
  });
  it('should add 1440 business minutes from 2026-04-22T20:39:59.000Z skipping the 2026-04-23 holiday', () => {
    // startAt = Wed 2026-04-22 20:00:00 UTC
    // Wed 04-22 (full) : 20:00:00 -> 24:00:00 =  4h =  240 min
    // Thu 04-23        : holiday                    =    0 min
    // Fri 04-24 (full) : 00:00:00 -> 20:00:00 = 20h = 1200 min
    // Total                                         = 1440 min
    const start = dayjs('2026-04-22T20:39:59.000Z');
    const result = start.addBusinessMinutes(1440);

    expect(result.toISOString()).toBe('2026-04-24T20:39:59.000Z');
  });

  it('should add 1440 business minutes from 2026-04-17T20:39:59.000Z skipping the 2026-04-23 holiday', () => {
    // startAt = Wed 2026-04-22 20:00:00 UTC
    // Wed 04-22 (full) : 20:00:00 -> 24:00:00 =  4h =  240 min
    // Thu 04-23        : holiday                    =    0 min
    // Fri 04-24 (full) : 00:00:00 -> 20:00:00 = 20h = 1200 min
    // Total                                         = 1440 min
    const start = dayjs('2026-04-17T20:39:59.000Z');
    const result = start.addBusinessMinutes(1440);

    expect(result.toISOString()).toBe('2026-04-20T20:39:59.000Z');
  });
});
