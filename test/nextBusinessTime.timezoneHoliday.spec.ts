describe('Next Business Time (timezone + partial holiday)', () => {
  it('should return the next business time at 13:00 (America/Sao_Paulo) for an input at 16:00Z on a partial holiday', () => {
    jest.isolateModules(() => {
      const dayjs = require('dayjs');
      const businessTime = require('../src');

      expect(new Date('2025-12-24T16:00:00.000Z').getTimezoneOffset()).toBe(0);

      dayjs.extend(businessTime);

      const TIMEZONE = 'America/Sao_Paulo';
      dayjs.setTZBusinessTime(TIMEZONE);

      dayjs.setBusinessTime({
        sunday: [{ start: '08:00:00', end: '19:00:00' }],
        monday: [{ start: '08:00:00', end: '19:00:00' }],
        tuesday: [{ start: '08:00:00', end: '19:00:00' }],
        wednesday: [{ start: '08:00:00', end: '19:00:00' }],
        thursday: [{ start: '08:00:00', end: '19:00:00' }],
        friday: [{ start: '08:00:00', end: '19:00:00' }],
        saturday: [{ start: '08:00:00', end: '19:00:00' }],
      });

      const holidays = {
        '2025-12-24': [{ start: '14:21:00', end: '23:59:00' }],
      };

      dayjs.setHolidays(holidays);

      const inicio = dayjs('2025-12-24T16:00:00.000Z');
      const nextBusinessTime = inicio.nextBusinessTime();

      expect(nextBusinessTime.format('YYYY-MM-DD HH:mm:ss')).toBe(
        '2025-12-24 13:00:00',
      );
    });
  });
});
