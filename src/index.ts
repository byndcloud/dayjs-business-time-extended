import UpdateLocale from 'dayjs/plugin/updateLocale';
import LocaleData from 'dayjs/plugin/localeData';
import IsSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import IsSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import dayjs, {
  BusinessHoursMap,
  BusinessTimeSegment,
  BusinessUnitType,
  Dayjs,
} from 'dayjs';

const DEFAULT_WORKING_HOURS = {
  sunday: null,
  monday: [{ start: '09:00:00', end: '17:00:00' }],
  tuesday: [{ start: '09:00:00', end: '17:00:00' }],
  wednesday: [{ start: '09:00:00', end: '17:00:00' }],
  thursday: [{ start: '09:00:00', end: '17:00:00' }],
  friday: [{ start: '09:00:00', end: '17:00:00' }],
  saturday: null,
};

enum DaysNames {
  sunday = 0,
  monday = 1,
  tuesday = 2,
  wednesday = 3,
  thursday = 4,
  friday = 5,
  saturday = 6,
}

const businessTime = (
  option: any,
  DayjsClass: typeof Dayjs,
  dayjsFactory: typeof dayjs,
) => {
  dayjsFactory.extend(LocaleData);
  dayjsFactory.extend(UpdateLocale);
  dayjsFactory.extend(IsSameOrBefore);
  dayjsFactory.extend(IsSameOrAfter);
  dayjsFactory.extend(utc);
  dayjsFactory.extend(timezone);

  // Variável para armazenar o timezone configurado
  let configuredTimezone: string | null = null;

  setBusinessTime(DEFAULT_WORKING_HOURS);
  setHolidays([]);

  function getLocale() {
    return dayjsFactory.Ls[dayjs().locale()];
  }

  function updateLocale(newData) {
    dayjsFactory.updateLocale(dayjs().locale(), { ...newData });
  }

  function getHolidays() {
    return getLocale().holidays || [];
  }

  function setHolidays(holidays) {
    validateHolidays(holidays);
    updateLocale({ holidays });
  }

  function validateHolidays(holidays: any) {
    if (holidays == null) {
      return;
    }

    if (Array.isArray(holidays)) {
      return;
    }

    if (typeof holidays !== 'object') {
      throw new Error('Invalid holidays: expected array or object');
    }

    Object.keys(holidays).forEach((dateKey) => {
      const value = holidays[dateKey];
      if (value === null) {
        return;
      }

      validateBusinessHoursArray(value, `holidays.${dateKey}`);
    });
  }

  function getBusinessTime(): BusinessHoursMap {
    return getLocale().businessHours;
  }

  function setTZBusinessTime(timeZone: string) {
    configuredTimezone = timeZone;
  }

  function getTZBusinessTime(): string | null {
    return configuredTimezone;
  }

  /**
   * Garante que a data esteja no timezone correto.
   * Se um timezone foi configurado via setTZBusinessTime, converte a data para esse timezone.
   * Suporta vários formatos de entrada: Dayjs, Date, strings ISO, etc.
   */
  function ensureTimezone(input: any): Dayjs {
    // Se não há timezone configurado, retorna a entrada convertida para Dayjs
    if (!configuredTimezone) {
      if (dayjs.isDayjs(input)) {
        return input;
      }
      return dayjsFactory(input);
    }

    // Se a entrada já é um Dayjs
    if (dayjs.isDayjs(input)) {
      // Verifica se já está no timezone correto
      const inputTz = (input as any).$x?.$timezone;
      if (inputTz === configuredTimezone) {
        return input;
      }
      
      // Se não tem timezone (foi criado com dayjs() sem .tz()),
      // precisamos pegar o UTC timestamp e converter para o timezone configurado
      if (!inputTz) {
        // Obtém o timestamp UTC e cria um novo objeto no timezone correto
        return dayjsFactory.tz(input.toDate(), configuredTimezone);
      }
      
      // Converte para o timezone configurado mantendo o mesmo instante no tempo
      return (input as any).tz(configuredTimezone);
    }

    // Se é uma string ou Date, converte para o timezone configurado
    if (typeof input === 'string') {
      // Se é uma string ISO com Z ou offset, primeiro converte para Date para preservar o momento exato
      if (input.includes('Z') || input.match(/[+-]\d{2}:\d{2}$/)) {
        return dayjsFactory.tz(new Date(input), configuredTimezone);
      }
      // Se é uma string sem timezone, assume que já está no timezone local desejado
      return dayjsFactory.tz(input, configuredTimezone);
    }

    if (input instanceof Date) {
      return dayjsFactory.tz(input, configuredTimezone);
    }

    // Fallback: tenta converter normalmente
    return dayjsFactory.tz(input, configuredTimezone);
  }

  function setBusinessTime(businessHours: BusinessHoursMap) {
    validateBusinessHoursMap(businessHours, 'businessHours');
    updateLocale({ businessHours });
  }

  function validateTimeRange(timeRange: { start: string; end: string }, path: string) {
    const start = timeStringToDayJS(timeRange.start);
    const end = timeStringToDayJS(timeRange.end);

    if (start.isAfter(end)) {
      throw new Error(
        `Invalid time range at ${path}: start (${timeRange.start}) must be before or equal to end (${timeRange.end})`,
      );
    }
  }

  function validateBusinessHoursArray(hours: any, path: string) {
    if (hours == null) {
      return;
    }

    if (!Array.isArray(hours)) {
      throw new Error(`Invalid business hours at ${path}: expected array or null`);
    }

    hours.forEach((range, index) => {
      if (!range || typeof range !== 'object') {
        throw new Error(`Invalid business hours at ${path}[${index}]: expected object`);
      }

      validateTimeRange(range, `${path}[${index}]`);
    });
  }

  function validateBusinessHoursMap(map: any, path: string) {
    if (!map || typeof map !== 'object') {
      throw new Error(`Invalid business hours at ${path}: expected object`);
    }

    Object.keys(map).forEach((dayKey) => {
      validateBusinessHoursArray(map[dayKey], `${path}.${dayKey}`);
    });
  }

  function isFullHoliday(date: Dayjs) {
    const holidays = getHolidays();
    const key = date.format('YYYY-MM-DD');

    if (Array.isArray(holidays)) {
      return holidays.includes(key);
    }

    if (holidays && typeof holidays === 'object') {
      if (Object.prototype.hasOwnProperty.call(holidays, key)) {
        return holidays[key] === null;
      }
    }

    return false;
  }

  function getHolidayExcludedHours(date: Dayjs): any {
    const holidays = getHolidays();
    const key = date.format('YYYY-MM-DD');

    if (Array.isArray(holidays)) {
      return holidays.includes(key) ? null : undefined;
    }

    if (holidays && typeof holidays === 'object') {
      if (Object.prototype.hasOwnProperty.call(holidays, key)) {
        return holidays[key];
      }
    }

    return undefined;
  }

  function buildSegmentsFromHours(
    date: Dayjs,
    hours: any,
  ): BusinessTimeSegment[] {
    if (!hours) {
      return null;
    }

    const segments = hours.reduce((acc, businessTime) => {
      let { start, end } = businessTime;
      start = timeStringToDayJS(start, date);
      end = timeStringToDayJS(end, date);
      acc.push({ start, end });
      return acc;
    }, []);

    segments.sort((a, b) => a.start.valueOf() - b.start.valueOf());
    return segments;
  }

  function subtractSegments(
    baseSegments: BusinessTimeSegment[],
    excludedSegments: BusinessTimeSegment[],
  ): BusinessTimeSegment[] {
    if (!excludedSegments?.length) {
      return baseSegments;
    }

    let result: BusinessTimeSegment[] = baseSegments;

    for (const excluded of excludedSegments) {
      const next: BusinessTimeSegment[] = [];
      for (const base of result) {
        const baseStart = base.start;
        const baseEnd = base.end;

        const exStart = excluded.start;
        const exEnd = excluded.end;

        const hasOverlap = exStart.isBefore(baseEnd) && exEnd.isAfter(baseStart);
        if (!hasOverlap) {
          next.push(base);
          continue;
        }

        if (exStart.isSameOrBefore(baseStart) && exEnd.isSameOrAfter(baseEnd)) {
          continue;
        }

        if (exStart.isAfter(baseStart)) {
          const leftEnd = exStart.isBefore(baseEnd) ? exStart : baseEnd;
          if (leftEnd.isAfter(baseStart)) {
            next.push({ start: baseStart, end: leftEnd });
          }
        }

        if (exEnd.isBefore(baseEnd)) {
          const rightStart = exEnd.isAfter(baseStart) ? exEnd : baseStart;
          if (baseEnd.isAfter(rightStart)) {
            next.push({ start: rightStart, end: baseEnd });
          }
        }
      }

      result = next;
      if (!result.length) {
        return null;
      }
    }

    return result.length ? result : null;
  }

  function getEffectiveBusinessTimeSegments(day: Dayjs): BusinessTimeSegment[] {
    const date = day.clone();

    if (isFullHoliday(date)) {
      return null;
    }

    const dayName = DaysNames[date.day()];
    const businessHours = getBusinessTime()[dayName];
    const baseSegments = buildSegmentsFromHours(date, businessHours);
    if (!baseSegments?.length) {
      return null;
    }

    const excludedHours = getHolidayExcludedHours(date);
    if (excludedHours === undefined) {
      return baseSegments;
    }

    if (excludedHours === null) {
      return null;
    }

    const excludedSegments = buildSegmentsFromHours(date, excludedHours);
    return subtractSegments(baseSegments, excludedSegments);
  }

  function isHoliday() {
    const today = this.format('YYYY-MM-DD');
    const holidays = getHolidays();

    if (Array.isArray(holidays)) {
      return holidays.includes(today);
    }

    if (holidays && typeof holidays === 'object') {
      return Object.prototype.hasOwnProperty.call(holidays, today);
    }

    return false;
  }

  function isBusinessDay() {
    return !!getEffectiveBusinessTimeSegments(this)?.length;
  }

  function addOrsubtractBusinessDays(
    date: Dayjs,
    numberOfDays: number,
    action: 'add' | 'subtract' = 'add',
  ) {
    let daysToIterate = numberOfDays;
    let day = date.clone();

    while (daysToIterate) {
      day = day[action](1, 'day');
      if (day.isBusinessDay()) {
        daysToIterate = daysToIterate - 1;
      }
    }

    return day;
  }

  function nextBusinessDay() {
    return addOrsubtractBusinessDays(this, 1);
  }

  function lastBusinessDay() {
    return addOrsubtractBusinessDays(this, 1, 'subtract');
  }

  function addBusinessDays(numberOfDays: number) {
    return addOrsubtractBusinessDays(this, numberOfDays);
  }

  function subtractBusinessDays(numberOfDays: number) {
    return addOrsubtractBusinessDays(this, numberOfDays, 'subtract');
  }

  function timeStringToDayJS(timeString: string, date: Dayjs = dayjs()) {
    const [hours, minutes, seconds] = <number[]>(
      (timeString.split(':') as unknown)
    );
    return date
      .clone()
      .hour(hours)
      .minute(minutes)
      .second(seconds)
      .millisecond(0);
  }

  function getBusinessTimeSegments(day: Dayjs): BusinessTimeSegment[] {
    return getEffectiveBusinessTimeSegments(day);
  }

  function getCurrentBusinessTimeSegment(date) {
    const businessSegments = getBusinessTimeSegments(date);

    if (!businessSegments?.length) {
      return false;
    }

    return businessSegments.find((businessSegment) => {
      const { start, end } = businessSegment;
      return date.isSameOrAfter(start) && date.isSameOrBefore(end);
    });
  }

  function isBusinessTime() {
    return !!getCurrentBusinessTimeSegment(this);
  }

  function nextBusinessTime() {
    if (!this.isBusinessDay()) {
      const nextBusinessDay = this.nextBusinessDay();
      return getBusinessTimeSegments(nextBusinessDay)[0].start;
    }

    const segments = getBusinessTimeSegments(this);

    for (let index = 0; index < segments.length; index++) {
      const { start, end } = segments[index];
      const isLastSegment = index === segments.length - 1;

      if (this.isBefore(start)) {
        return start;
      }

      if (this.isAfter(end)) {
        if (!isLastSegment) {
          continue;
        }

        const nextBusinessDay = this.nextBusinessDay();
        return getBusinessTimeSegments(nextBusinessDay)[0].start;
      }

      return this.clone();
    }
  }

  function lastBusinessTime() {
    if (!this.isBusinessDay()) {
      const lastBusinessDay = this.lastBusinessDay();
      const { end } = getBusinessTimeSegments(lastBusinessDay).pop();
      return end;
    }

    const segments = getBusinessTimeSegments(this).reverse();

    for (let index = 0; index < segments.length; index++) {
      const { start, end } = segments[index];
      const isFirstSegment = index === segments.length - 1;

      if (this.isAfter(end)) {
        return end;
      }

      if (this.isBefore(start)) {
        if (!isFirstSegment) {
          continue;
        }

        const lastBusinessDay = this.lastBusinessDay();
        return getBusinessTimeSegments(lastBusinessDay).pop().end;
      }

      return this.clone();
    }
  }

  function addBusinessMinutes(minutesToAdd: number): Dayjs {
    return addOrSubtractBusinessMinutes(this, minutesToAdd);
  }

  function addBusinessHours(hoursToAdd: number): Dayjs {
    const minutesToAdd = hoursToAdd * 60;
    return this.addBusinessMinutes(minutesToAdd);
  }

  function addBusinessTime(timeToAdd: number, businessUnit: BusinessUnitType) {
    if (businessUnit.match(/^(minute)+s?$/)) {
      return this.addBusinessMinutes(timeToAdd);
    }

    if (businessUnit.match(/^(hour)+s?$/)) {
      return this.addBusinessHours(timeToAdd);
    }

    if (businessUnit.match(/^(day)+s?$/)) {
      return this.addBusinessDays(timeToAdd);
    }

    throw new Error('Invalid Business Time Unit');
  }

  function addOrSubtractBusinessMinutes(
    day: Dayjs,
    numberOfMinutes: number,
    action: 'add' | 'subtract' = 'add',
  ): Dayjs {
    let date =
      action === 'add' ? day.nextBusinessTime() : day.lastBusinessTime();

    while (numberOfMinutes) {
      const segment = getCurrentBusinessTimeSegment(
        date,
      ) as BusinessTimeSegment;

      if (!segment) {
        date =
          action === 'add' ? date.nextBusinessTime() : date.lastBusinessTime();
        continue;
      }

      const { start, end } = segment;

      const compareBaseDate = action === 'add' ? end : date;
      const compareDate = action === 'add' ? date : start;

      let timeToJump = compareBaseDate.diff(compareDate, 'minute');

      if (timeToJump > numberOfMinutes) {
        timeToJump = numberOfMinutes;
      }

      numberOfMinutes -= timeToJump;

      if (!timeToJump && numberOfMinutes) {
        timeToJump = 1;
      }

      date = date[action](timeToJump, 'minute');
    }

    return date;
  }

  function subtractBusinessMinutes(minutesToSubtract: number): Dayjs {
    return addOrSubtractBusinessMinutes(this, minutesToSubtract, 'subtract');
  }

  function subtractBusinessHours(hoursToSubtract: number): Dayjs {
    const minutesToSubtract = hoursToSubtract * 60;
    return this.subtractBusinessMinutes(minutesToSubtract);
  }

  function subtractBusinessTime(
    timeToSubtract: number,
    businessUnit: BusinessUnitType,
  ) {
    if (businessUnit.match(/^(minute)+s?$/)) {
      return this.subtractBusinessMinutes(timeToSubtract);
    }

    if (businessUnit.match(/^(hour)+s?$/)) {
      return this.subtractBusinessHours(timeToSubtract);
    }

    if (businessUnit.match(/^(day)+s?$/)) {
      return this.subtractBusinessDays(timeToSubtract);
    }

    throw new Error('Invalid Business Time Unit');
  }

  function fixDatesToCalculateDiff(base, comparator) {
    // Garante que ambas as datas estejam no timezone correto
    const baseConverted = ensureTimezone(base);
    const comparatorConverted = ensureTimezone(comparator);

    let from: Dayjs = baseConverted.clone();
    let to: Dayjs = comparatorConverted.clone();
    let multiplier = 1;

    if (baseConverted.isAfter(comparatorConverted)) {
      to = baseConverted.clone();
      from = comparatorConverted.clone();
      multiplier = -1;
    }

    if (!from.isBusinessTime()) {
      from = from.lastBusinessTime();
    }

    if (!to.isBusinessTime()) {
      to = to.nextBusinessTime();
    }

    return { from, to, multiplier };
  }

  function businessDaysDiff(comparator: Dayjs): number {
    let { from, to, multiplier } = fixDatesToCalculateDiff(this, comparator);
    let diff = 0;

    while (!from.isSame(to, 'day')) {
      diff += 1;
      from = from.addBusinessDays(1);
    }

    return diff ? diff * multiplier : 0;
  }

  function businessSecondsDiff(comparator: Dayjs): number {
    let { from, to, multiplier } = fixDatesToCalculateDiff(this, comparator);
    let diff = 0;

    const isSameDayfromTo = from.isSame(to, 'day');
    if (isSameDayfromTo) {
      const fromSegments = getBusinessTimeSegments(from);
      for (const segment of fromSegments) {
        const { start, end } = segment;

        if (
          to.isSameOrAfter(start) &&
          to.isSameOrBefore(end) &&
          from.isSameOrAfter(start) &&
          from.isSameOrBefore(end)
        ) {
          diff += to.diff(from, 'seconds');
          break;
        } else if (to.isSameOrAfter(start) && to.isSameOrBefore(end)) {
          diff += to.diff(start, 'seconds');
          break;
        } else if (from.isSameOrAfter(start) && from.isSameOrBefore(end)) {
          diff += end.diff(from, 'seconds');
        }
      }

      return diff ? diff * multiplier : 0;
    }

    let segments = getBusinessTimeSegments(from);
    for (const segment of segments) {
      const { start, end } = segment;

      if (from.isSameOrAfter(start) && from.isSameOrBefore(end)) {
        diff += end.diff(from, 'seconds');
      } else if (start.isSameOrAfter(from)) {
        diff += end.diff(start, 'seconds');
      }
    }

    from = from.addBusinessDays(1);
    while (from.isBefore(to, 'day')) {
      segments = getBusinessTimeSegments(from);
      for (const segment of segments) {
        const { start, end } = segment;
        diff += end.diff(start, 'seconds');
      }

      from = from.addBusinessDays(1);
    }

    const toSegments = getBusinessTimeSegments(to);
    for (const segment of toSegments) {
      const { start, end } = segment;
      if (to.isSameOrAfter(start) && to.isSameOrBefore(end)) {
        diff += to.diff(start, 'seconds');
      } else if (end.isSameOrBefore(to)) {
        diff += end.diff(start, 'seconds');
      }
    }

    return diff ? diff * multiplier : 0;
  }

  function businessMinutesDiff(comparator: Dayjs): number {
    let { from, to, multiplier } = fixDatesToCalculateDiff(this, comparator);
    let diff = 0;

    const isSameDayfromTo = from.isSame(to, 'day');
    if (isSameDayfromTo) {
      const fromSegments = getBusinessTimeSegments(from);
      for (const segment of fromSegments) {
        const { start, end } = segment;

        if (
          to.isSameOrAfter(start) &&
          to.isSameOrBefore(end) &&
          from.isSameOrAfter(start) &&
          from.isSameOrBefore(end)
        ) {
          diff += to.diff(from, 'minutes');
          break;
        } else if (to.isSameOrAfter(start) && to.isSameOrBefore(end)) {
          diff += to.diff(start, 'minutes');
          break;
        } else if (from.isSameOrAfter(start) && from.isSameOrBefore(end)) {
          diff += end.diff(from, 'minutes');
        } 
      }

      return diff ? diff * multiplier : 0;
    }

    let segments = getBusinessTimeSegments(from);
    for (const segment of segments) {
      const { start, end } = segment;

      if (from.isSameOrAfter(start) && from.isSameOrBefore(end)) {
        diff += end.diff(from, 'minutes');
      } else if (start.isSameOrAfter(from)) {
        diff += end.diff(start, 'minutes');
      }
    }

    from = from.addBusinessDays(1);
    while (from.isBefore(to, 'day')) {
      segments = getBusinessTimeSegments(from);
      for (const segment of segments) {
        const { start, end } = segment;
        diff += end.diff(start, 'minutes');
      }

      from = from.addBusinessDays(1);
    }

    const toSegments = getBusinessTimeSegments(to);
    for (const segment of toSegments) {
      const { start, end } = segment;
      if (to.isSameOrAfter(start) && to.isSameOrBefore(end)) {
        diff += to.diff(start, 'minutes');
      } else if (end.isSameOrBefore(to)) {
        diff += end.diff(start, 'minutes');
      }
    }

    return diff ? diff * multiplier : 0;
  }

  function businessHoursDiff(comparator: Dayjs): number {
    const minutesDiff = this.businessMinutesDiff(comparator);
    return minutesDiff / 60;
  }

  function businessTimeDiff(comparator: Dayjs, businessUnit: BusinessUnitType) {
    if (businessUnit.match(/^(minute)+s?$/)) {
      return this.businessMinutesDiff(comparator);
    }

    if (businessUnit.match(/^(hour)+s?$/)) {
      return this.businessHoursDiff(comparator);
    }

    if (businessUnit.match(/^(day)+s?$/)) {
      return this.businessDaysDiff(comparator);
    }

    throw new Error('Invalid Business Time Unit');
  }

  // New functions on dayjs factory
  dayjsFactory.getHolidays = getHolidays;
  dayjsFactory.setHolidays = setHolidays;
  dayjsFactory.getBusinessTime = getBusinessTime;
  dayjsFactory.setBusinessTime = setBusinessTime;
  dayjsFactory.setTZBusinessTime = setTZBusinessTime;
  dayjsFactory.getTZBusinessTime = getTZBusinessTime;

  // New methods on Dayjs class
  DayjsClass.prototype.isHoliday = isHoliday;
  DayjsClass.prototype.isBusinessDay = isBusinessDay;
  DayjsClass.prototype.nextBusinessDay = nextBusinessDay;
  DayjsClass.prototype.lastBusinessDay = lastBusinessDay;
  DayjsClass.prototype.addBusinessDays = addBusinessDays;
  DayjsClass.prototype.subtractBusinessDays = subtractBusinessDays;
  DayjsClass.prototype.isBusinessTime = isBusinessTime;
  DayjsClass.prototype.nextBusinessTime = nextBusinessTime;
  DayjsClass.prototype.lastBusinessTime = lastBusinessTime;
  DayjsClass.prototype.addBusinessTime = addBusinessTime;
  DayjsClass.prototype.addBusinessHours = addBusinessHours;
  DayjsClass.prototype.addBusinessMinutes = addBusinessMinutes;
  DayjsClass.prototype.subtractBusinessMinutes = subtractBusinessMinutes;
  DayjsClass.prototype.subtractBusinessHours = subtractBusinessHours;
  DayjsClass.prototype.subtractBusinessTime = subtractBusinessTime;
  DayjsClass.prototype.businessMinutesDiff = businessMinutesDiff;
  DayjsClass.prototype.businessSecondsDiff = businessSecondsDiff;
  DayjsClass.prototype.businessHoursDiff = businessHoursDiff;
  DayjsClass.prototype.businessDaysDiff = businessDaysDiff;
  DayjsClass.prototype.businessTimeDiff = businessTimeDiff;
};

export default businessTime;
exports = module.exports = businessTime;
