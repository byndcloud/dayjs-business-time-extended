const dayjs = require('dayjs');
const businessTime = require('./src/index.ts');

// Estender dayjs com businessTime (utc e timezone são incluídos automaticamente)
dayjs.extend(businessTime);

// Definir o timezone padrão como America/Sao_Paulo (UTC-3)
const TIMEZONE = 'America/Sao_Paulo';
dayjs.setTZBusinessTime(TIMEZONE);

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

// Criar datas - agora o ensureTimezone fará a conversão automática
// Você pode usar qualquer formato: string, Date, ou Dayjs
const inicio = dayjs('2026-01-02 08:00:00');
const fim = dayjs(new Date());

// Ou se preferir usar formatos ISO:
// const inicio = dayjs('2026-01-02T08:00:00.000Z');
// const fim = dayjs(new Date('2026-01-02T17:00:00.000Z'));

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

console.log('Início (timezone do sistema):', inicio.format('YYYY-MM-DD HH:mm:ss'));
console.log('Fim (timezone do sistema):', fim.format('YYYY-MM-DD HH:mm:ss'));
console.log('\nOBS: Os objetos acima são exibidos no timezone do sistema.');
console.log('Porém, as funções de diff convertem automaticamente para', TIMEZONE, 'antes de calcular.\n');
console.log('Minutos úteis (diff):', diffMinutosUteis, ' -> ', diffMinutosUteis * 60, 'segundos');
console.log('Horas úteis (diff):', diffHorasUteis, ' -> ', diffHorasUteis * 60 * 60, 'segundos');
console.log('Segundos úteis (diff):', diffSegundosUteis);
