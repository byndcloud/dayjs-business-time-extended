const dayjs = require('dayjs');
const businessTime = require('./src/index.ts');

dayjs.extend(businessTime);

// dayjs.setBusinessTime({
//   sunday: null,
//   monday: [{ start: '08:00:00', end: '18:00:00' }],
//   tuesday: [{ start: '08:00:00', end: '18:00:00' }],
//   wednesday: [{ start: '08:00:00', end: '18:00:00' }],
//   thursday: [{ start: '08:00:00', end: '18:00:00' }],
//   friday: [{ start: '08:00:00', end: '18:00:00' }],
//   saturday: null,
// });
// // const oldHolidays =  ['2025-12-25']
// const holidays = {
//   '2025-12-25': [{ start: '12:00:00', end: '18:00:00' }, { start: '09:00:00', end: '10:00:00' }, { start: '02:00:00', end: '08:30:00' }],
// }
dayjs.setBusinessTime({
  sunday: [{ start: '21:00:00', end: '23:59:00' }, { start: '00:00:00', end: '20:59:00' }],
  monday: [{ start: '21:00:00', end: '23:59:00' }, { start: '00:00:00', end: '20:59:00' }],
  tuesday: [{ start: '21:00:00', end: '23:59:00' }, { start: '00:00:00', end: '20:59:00' }],
  wednesday: [{ start: '21:00:00', end: '23:59:00' }, { start: '00:00:00', end: '20:59:00' }],
  thursday: [{ start: '21:00:00', end: '23:59:00' }, { start: '00:00:00', end: '20:59:00' }],
  friday: [{ start: '21:00:00', end: '23:59:00' }, { start: '00:00:00', end: '20:59:00' }],
  saturday: [{ start: '21:00:00', end: '23:59:00' }, { start: '00:00:00', end: '20:59:00' }],
});
// // const oldHolidays =  ['2025-12-25']
const holidays = {
  '2025-12-25': [{ start: '12:00:00', end: '18:00:00' }, { start: '09:00:00', end: '10:00:00' }, { start: '02:00:00', end: '08:30:00' }],
}
dayjs.setHolidays(holidays);

const inicio = dayjs('2025-12-24 20:00:00');
const fim = dayjs('2025-12-25 11:00:00');
const expectedNextBusinessTime = '2025-12-24 20:00:00';
const nextBusinessTime = inicio.nextBusinessTime();
console.log('Next Business Time:', nextBusinessTime.format('YYYY-MM-DD HH:mm:ss'));

const outputExpectedInSeconds = 5400;
const diffMinutosUteis = inicio.businessMinutesDiff(fim);
const diffHorasUteis = inicio.businessHoursDiff(fim);
const diffSegundosUteis = inicio.businessSecondsDiff(fim);

console.log('Início:', inicio.format('YYYY-MM-DD HH:mm:ss'));
console.log('Fim:', fim.format('YYYY-MM-DD HH:mm:ss'));
console.log('Minutos úteis (diff):', diffMinutosUteis, ' -> ', diffMinutosUteis * 60);
console.log('Horas úteis (diff):', diffHorasUteis, ' -> ', diffHorasUteis * 60 * 60);
console.log('Segundos úteis (diff):', diffSegundosUteis);
