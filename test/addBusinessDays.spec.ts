import dayjs from 'dayjs';
import businessTime from '../src';

describe('Add Business Days', () => {
  beforeAll(() => {
    dayjs.extend(businessTime);

    const holidays = ['2021-01-01', '2021-01-25', '2021-06-03'];

    dayjs.setHolidays(holidays);
  });

  it('should add 3 business day on a date', () => {
    const date = dayjs('2021-02-08');
    const expected = dayjs('2021-02-11');

    const newDate = date.addBusinessDays(3);

    expect(newDate).toBeDefined();
    expect(newDate).toStrictEqual(expected);
  });

  it('should add 4 business day on a day before a weekend', () => {
    // february 19th, 2021 is a friday
    const date = dayjs('2021-02-19');

    // february 25th, 2021 is a monday
    const expected = dayjs('2021-02-25');

    const newDate = date.addBusinessDays(4);

    expect(newDate).toBeDefined();
    expect(newDate).toStrictEqual(expected);
  });

  it('should add 2 business days on a day before a holiday', () => {
    // june 2nd, 2021 is a wednesday
    //   before corpus christ holiday
    const date = dayjs('2021-06-02');

    // june 7th, 2021 is a monday
    const expected = dayjs('2021-06-07');

    const newDate = date.addBusinessDays(2);

    expect(newDate).toBeDefined();
    expect(newDate).toStrictEqual(expected);
  });

  it('should add 3 business days on a day before a long weekend', () => {
    // january 22nd, 2021 is a friday
    //   before São Paulo City anniversary
    const date = dayjs('2021-01-22');

    // january 28th, 2021 is a thursday
    const expected = dayjs('2021-01-28');

    const newDate = date.addBusinessDays(3);

    expect(newDate).toBeDefined();
    expect(newDate).toStrictEqual(expected);
  });

  it('should add 1 business day with full weekdays preserving time', () => {
    dayjs.setBusinessTime({
      sunday: null,
      monday: 'full',
      tuesday: 'full',
      wednesday: 'full',
      thursday: 'full',
      friday: 'full',
      saturday: null,
    });

    const date = dayjs('2021-02-03 17:30:00');
    const expected = dayjs('2021-02-04 17:30:00');

    const newDate = date.addBusinessDays(1);

    expect(newDate).toBeDefined();
    expect(newDate).toStrictEqual(expected);
  });

  it('should throw when weekday range has same start and end', () => {
    expect(() => {
      dayjs.setBusinessTime({
        sunday: null,
        monday: [{ start: '00:00:00', end: '00:00:00' }],
        tuesday: [{ start: '00:00:00', end: '00:00:00' }],
        wednesday: [{ start: '00:00:00', end: '00:00:00' }],
        thursday: [{ start: '00:00:00', end: '00:00:00' }],
        friday: [{ start: '00:00:00', end: '00:00:00' }],
        saturday: null,
      });
    }).toThrow(/Invalid time range/);
  });
});
