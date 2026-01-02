const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const businessTime = require('./src/index.ts');

// Estender dayjs com os plugins necessários
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(businessTime);

// Definir o timezone padrão como America/Sao_Paulo (UTC-3)
const TIMEZONE = 'America/Sao_Paulo';

// Script de teste para verificar o fuso horário
console.log('=== Teste de Data e Fuso Horário ===\n');

// Criar uma nova data
const now = new Date();

console.log('new Date():', now);
console.log('Timezone configurado:', TIMEZONE);

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
// Colocar a hora de início 5 min antes da hora atual do seu pc
dayjs.setBusinessTime({
  sunday: [{ start: '13:00:00', end: '16:00:00' }],
  monday: [{ start: '13:00:00', end: '16:00:00' }],
  tuesday: [{ start: '13:00:00', end: '16:00:00' }],
  wednesday: [{ start: '13:00:00', end: '16:00:00' }],
  thursday: [{ start: '13:00:00', end: '16:00:00' }],
  friday: [{ start: '13:00:00', end: '16:00:00' }],
  saturday: [{ start: '13:00:00', end: '16:00:00' }],
});

// dayjs.setBusinessTime({
//   sunday: [ { start: '22:00:00', end: '20:59:00' }],
//   monday: [ { start: '22:00:00', end: '20:59:00' }],
//   tuesday: [ { start: '22:00:00', end: '20:59:00' }],
//   wednesday: [ { start: '22:00:00', end: '20:59:00' }],
//   thursday: [ { start: '22:00:00', end: '20:59:00' }],
//   friday: [ { start: '22:00:00', end: '20:59:00' }],
//   saturday: [ { start: '22:00:00', end: '20:59:00' }],
// });
// // const oldHolidays =  ['2025-12-25']
const holidays = {
  '2025-12-25': [{ start: '12:00:00', end: '18:00:00' }, { start: '09:00:00', end: '10:00:00' }],
}
dayjs.setHolidays(holidays);

// Criar datas com o timezone específico (UTC-3)
// const inicio = dayjs.tz('2026-01-02 08:00s:00', TIMEZONE);
const inicio = dayjs.tz('2026-01-02T08:00:00.000Z', TIMEZONE);



// const fim = dayjs.tz('2026-01-02T17:00:00.000Z', TIMEZONE); // ERRADO, pois o fuso horário não é o UTC-3
const fim = dayjs.tz(new Date('2026-01-02T17:00:00.000Z'), TIMEZONE); // CERTO, pois o fuso horário é o UTC-3
// const fim = dayjs.tz(new Date()); // ERRADO, pois o fuso horário não é o UTC-3
// const fim = dayjs.tz(new Date(), TIMEZONE); // CERTO, pois o fuso horário é o UTC-3

// const expectedNextBusinessTime = '2025-12-25 08:00:00';
// const nextBusinessTime = inicio.nextBusinessTime();
// const lastBusinessTime = inicio.lastBusinessTime();s
// console.log('Next Business Time:', nextBusinessTime.format('YYYY-MM-DD HH:mm:ss'));
// console.log('Last Business Time:', lastBusinessTime.format('YYYY-MM-DD HH:mm:ss'));
// const newExpireAt = inicio.addBusinessMinutes(30)

const outputExpectedInSeconds = 3600;
const diffMinutosUteis = inicio.businessMinutesDiff(fim);
const diffHorasUteis = inicio.businessHoursDiff(fim);
const diffSegundosUteis = inicio.businessSecondsDiff(fim);

console.log('Início:', inicio.format('YYYY-MM-DD HH:mm:ss'));
console.log('Fim:', fim.format('YYYY-MM-DD HH:mm:ss'));
console.log('Minutos úteis (diff):', diffMinutosUteis, ' -> ', diffMinutosUteis * 60);
console.log('Horas úteis (diff):', diffHorasUteis, ' -> ', diffHorasUteis * 60 * 60);
console.log('Segundos úteis (diff):', diffSegundosUteis);
