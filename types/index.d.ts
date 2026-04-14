import { PluginFunc } from 'dayjs'

declare const plugin: PluginFunc
export = plugin

declare module 'dayjs' {
  export type BusinessHoursValue = BusinessHours[] | 'full' | null;
  export type HolidaysMap = Record<string, BusinessHoursValue>;
  export type Holidays = string[] | HolidaysMap;

  export function getHolidays(): Holidays;
  export function setHolidays(holidays: Holidays): void;
  export function getBusinessTime(): BusinessHoursMap;
  export function setBusinessTime(businessHours: BusinessHoursMap): void;
  export function setTZBusinessTime(timeZone: string): void;
  export function getTZBusinessTime(): string | null;

  export type BusinessUnitType = 'minute' | 'minutes' | 'hour' | 'hours' | 'day' | 'days' | 'second' | 'seconds';
  export interface Dayjs {
    isBusinessDay(): boolean,
    isHoliday(): boolean,
    nextBusinessDay(): Dayjs,
    lastBusinessDay(): Dayjs,
    isBusinessTime(): boolean,
    nextBusinessTime(): Dayjs,
    lastBusinessTime(): Dayjs,
    addBusinessDays(numberOfDays: number): Dayjs,
    subtractBusinessDays(numberOfDays: number): Dayjs,
    addBusinessHours(numberOfHours: number): Dayjs,
    addBusinessMinutes(numberOfMinutes: number): Dayjs,
    addBusinessSeconds(numberOfSeconds: number): Dayjs,
    addBusinessTime(timeToAdd: number, businessUnit: BusinessUnitType): Dayjs,
    subtractBusinessMinutes(numberOfMinutes: number): Dayjs;
    subtractBusinessSeconds(numberOfSeconds: number): Dayjs;
    subtractBusinessHours(numberOfHours: number): Dayjs,
    subtractBusinessTime(timeToSubtract: number, businessUnit: BusinessUnitType): Dayjs,
    businessSecondsDiff(comparator: Dayjs): number
    businessMinutesDiff(comparator: Dayjs): number
    businessHoursDiff(comparator: Dayjs): number
    businessDaysDiff(comparator: Dayjs): number
    businessTimeDiff(comparator: Dayjs, businessUnit: BusinessUnitType): number,
  }
  export interface BusinessHoursMap {
    sunday: BusinessHoursValue;
    monday: BusinessHoursValue;
    tuesday: BusinessHoursValue;
    wednesday: BusinessHoursValue;
    thursday: BusinessHoursValue;
    friday: BusinessHoursValue;
    saturday: BusinessHoursValue;
  }

  export interface BusinessHours {
    start: string,
    end: string
  }

  export interface BusinessTimeSegment {
    start: Dayjs;
    end: Dayjs;
  }

  export interface ILocale {
    holidays: Holidays,
    businessHours: BusinessHoursMap,
  }
}
