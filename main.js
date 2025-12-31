const dayjs = require('dayjs');
const businessTime = require('./src/index.ts');

dayjs.extend(businessTime);

dayjs.setBusinessTime({
  sunday: null,
  monday: [{ start: '08:00:00', end: '18:00:00' }],
  tuesday: [{ start: '08:00:00', end: '18:00:00' }],
  wednesday: [{ start: '08:00:00', end: '18:00:00' }],
  thursday: [{ start: '08:00:00', end: '18:00:00' }],
  friday: [{ start: '08:00:00', end: '18:00:00' }],
  saturday: null,
});

dayjs.setHolidays(['2025-12-25']);

const inicio = dayjs('2025-12-24 17:00:00');
const fim = dayjs('2025-12-26 10:00:00');

const diffMinutosUteis = inicio.businessMinutesDiff(fim);
const diffHorasUteis = inicio.businessHoursDiff(fim);

console.log('Início:', inicio.format('YYYY-MM-DD HH:mm:ss'));
console.log('Fim:', fim.format('YYYY-MM-DD HH:mm:ss'));
console.log('Minutos úteis (diff):', diffMinutosUteis);
console.log('Horas úteis (diff):', diffHorasUteis);
