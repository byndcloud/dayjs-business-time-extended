describe('Add Business Seconds', () => {
  it('should add seconds within the same business segment', () => {
    jest.isolateModules(() => {
      const dayjs = require('dayjs');
      const businessTime = require('../src');

      expect(new Date('2025-12-22T21:59:00.000Z').getTimezoneOffset()).toBe(0);

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

      const start = dayjs('2025-12-22T21:59:00.000Z');
      const result = start.addBusinessSeconds(60);

      expect(result.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-12-22 19:00:00');
    });
  });

  it('should add seconds crossing end of business day and continue on next day', () => {
    jest.isolateModules(() => {
      const dayjs = require('dayjs');
      const businessTime = require('../src');

      expect(new Date('2025-12-22T21:59:50.000Z').getTimezoneOffset()).toBe(0);

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

      const start = dayjs('2025-12-22T21:59:50.000Z');
      const result = start.addBusinessSeconds(30);

      expect(result.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-12-23 08:00:20');
    });
  });

  it('should add seconds starting outside business hours by jumping to next business time', () => {
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
      const result = start.addBusinessSeconds(60);

      expect(result.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-12-23 08:01:00');
    });
  });

  it('should add seconds with full weekdays across midnight', () => {
    jest.isolateModules(() => {
      const dayjs = require('dayjs');
      const businessTime = require('../src');

      dayjs.extend(businessTime);
      dayjs.setBusinessTime({
        sunday: null,
        monday: 'full',
        tuesday: 'full',
        wednesday: 'full',
        thursday: 'full',
        friday: 'full',
        saturday: null,
      });

      const start = dayjs('2021-02-03 23:59:30');
      const result = start.addBusinessSeconds(90);

      expect(result.format('YYYY-MM-DD HH:mm:ss')).toBe('2021-02-04 00:01:00');
    });
  });

  it('should preserve minute and second when adding 86400 business seconds from a date with seconds', () => {
    jest.isolateModules(() => {
      const dayjs = require('dayjs');
      const businessTime = require('../src');

      dayjs.extend(businessTime);
      dayjs.setBusinessTime({
        sunday: null,
        monday: 'full',
        tuesday: 'full',
        wednesday: 'full',
        thursday: 'full',
        friday: 'full',
        saturday: null,
      });

      const start = dayjs('2026-04-14 10:53:30');
      const result = start.addBusinessSeconds(86400);

      expect(result.format('YYYY-MM-DD HH:mm:ss')).toBe('2026-04-15 10:53:30');
    });
  });
});
