describe('Subtract Business Seconds', () => {
  it('should subtract seconds within the same business segment', () => {
    jest.isolateModules(() => {
      const dayjs = require('dayjs');
      const businessTime = require('../src');

      expect(new Date('2025-12-22T21:59:30.000Z').getTimezoneOffset()).toBe(0);

      dayjs.extend(businessTime);
      dayjs.setTZBusinessTime('America/Sao_Paulo');
      dayjs.setBusinessTime({
        sunday: [{ start: '08:00:00', end: '19:00:00' }],
        monday: [{ start: '08:00:00', end: '19:00:00' }],
        tuesday: [{ start: '08:00:00', end: '19:00:00' }],
        wednesday: [{ start: '08:00:00', end: '19:00:00' }],
        thursday: [{ start: '08:00:00', end: '19:00:00' }],
        friday: [{ start: '08:00:00', end: '19:00:00' }],
        saturday: [{ start: '08:00:00', end: '19:00:00' }],
      });

      const start = dayjs('2025-12-22T21:59:30.000Z');
      const result = start.subtractBusinessSeconds(60);

      expect(result.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-12-22 18:58:30');
    });
  });

  it('should subtract seconds crossing start of business day and continue on previous day', () => {
    jest.isolateModules(() => {
      const dayjs = require('dayjs');
      const businessTime = require('../src');

      expect(new Date('2025-12-23T11:00:10.000Z').getTimezoneOffset()).toBe(0);

      dayjs.extend(businessTime);
      dayjs.setTZBusinessTime('America/Sao_Paulo');
      dayjs.setBusinessTime({
        sunday: [{ start: '08:00:00', end: '19:00:00' }],
        monday: [{ start: '08:00:00', end: '19:00:00' }],
        tuesday: [{ start: '08:00:00', end: '19:00:00' }],
        wednesday: [{ start: '08:00:00', end: '19:00:00' }],
        thursday: [{ start: '08:00:00', end: '19:00:00' }],
        friday: [{ start: '08:00:00', end: '19:00:00' }],
        saturday: [{ start: '08:00:00', end: '19:00:00' }],
      });

      const start = dayjs('2025-12-23T11:00:10.000Z');
      const result = start.subtractBusinessSeconds(30);

      expect(result.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-12-22 18:59:40');
    });
  });

  it('should subtract seconds starting outside business hours by jumping to last business time', () => {
    jest.isolateModules(() => {
      const dayjs = require('dayjs');
      const businessTime = require('../src');

      expect(new Date('2025-12-23T00:00:00.000Z').getTimezoneOffset()).toBe(0);

      dayjs.extend(businessTime);
      dayjs.setTZBusinessTime('America/Sao_Paulo');
      dayjs.setBusinessTime({
        sunday: [{ start: '08:00:00', end: '19:00:00' }],
        monday: [{ start: '08:00:00', end: '19:00:00' }],
        tuesday: [{ start: '08:00:00', end: '19:00:00' }],
        wednesday: [{ start: '08:00:00', end: '19:00:00' }],
        thursday: [{ start: '08:00:00', end: '19:00:00' }],
        friday: [{ start: '08:00:00', end: '19:00:00' }],
        saturday: [{ start: '08:00:00', end: '19:00:00' }],
      });

      const start = dayjs('2025-12-23T00:00:00.000Z');
      const result = start.subtractBusinessSeconds(60);

      expect(result.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-12-22 18:59:00');
    });
  });
});
