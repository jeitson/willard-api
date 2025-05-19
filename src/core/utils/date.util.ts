import * as dayjs from 'dayjs';
import { isDate } from 'lodash';

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const DATE_FORMAT = 'YYYY-MM-DD';

export function formatToDateTime(
	date: string | number | Date | dayjs.Dayjs | null | undefined = undefined,
	format = DATE_TIME_FORMAT,
): string {
	return dayjs(date).format(format);
}

export function formatToDate(
	date: string | number | Date | dayjs.Dayjs | null | undefined = undefined,
	format = DATE_FORMAT,
): string {
	return dayjs(date).format(format);
}

export function isDateObject(obj: unknown): boolean {
	return isDate(obj) || dayjs.isDayjs(obj);
}

export function excelDateToJSDate(excelDate: string): string {
	if (excelDate === '') {
		return '';
	}

	if (excelDate.includes('-')) {
		return excelDate;
	}

	excelDate = parseInt(excelDate) as any;

    const baseDate = new Date(1900, 0, 1);
    const daysSince1900 = parseInt(excelDate.toString()) - 1;
    baseDate.setDate(baseDate.getDate() + daysSince1900 - 1);
    return baseDate.toISOString().split('T')[0];
}

export function excelTimeToJSDate(excelTime: number): string {
    const totalSeconds = Math.floor(excelTime * 24 * 60 * 60);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;


    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
