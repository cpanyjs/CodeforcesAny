import { DAYS_IN_ONE_YEAR, DAYS_IN_WEEK } from './consts';
import dayjs, { Dayjs } from 'dayjs';

interface CalendarHeatmapSourceData {
  date: string;
  value: number;
}

interface CalendarHeatmapData extends CalendarHeatmapSourceData {
  colorIndex: number;
}

interface CalendarHeatmapOption {
  startDate?: Dayjs;
  endDate?: Dayjs;
  data: CalendarHeatmapSourceData[];
  max?: number;
}

export class CalendarHeatmap {
  startDate: Dayjs;
  endDate: Dayjs;
  max: number;
  data: CalendarHeatmapSourceData[];
  activities: Record<string, CalendarHeatmapData>;

  constructor({ startDate, endDate, data, max }: CalendarHeatmapOption) {
    this.data = data;
    this.endDate = endDate || dayjs().startOf('date');
    this.startDate =
      startDate || this.endDate.subtract(1, 'year').add(1, 'day');
    this.max =
      max || Math.ceil((Math.max(...data.map(({ value }) => value)) / 5) * 4);

    this.activities = data.reduce(
      (newValues: Record<string, CalendarHeatmapData>, { date, value }) => {
        const key = dayjs(date).format('YYYY-MM-DD');
        newValues[key] = {
          date,
          value: (newValues[key]?.value ?? 0) + value,
          colorIndex: this.getColorIndex(value)
        };
        return newValues;
      },
      {}
    );
  }

  get weekCount() {
    return this.getDaysCount() / DAYS_IN_WEEK;
  }

  get calendar() {
    // const date = this._shiftDate(this.startDate, -this.getCountEmptyDaysAtStart())
    let date = this.startDate.subtract(this.getCountEmptyDaysAtStart(), 'day');
    return Array.from({ length: this.weekCount }, () =>
      Array.from({ length: DAYS_IN_WEEK }, () => {
        const dDate = date.clone();
        const dayValues = this.activities[date.format('YYYY-MM-DD')];
        date = date.add(1, 'day');
        return {
          date: dDate,
          value: dayValues ? dayValues.value : 0,
          colorIndex: dayValues ? dayValues.colorIndex : 0
        };
      })
    );
  }

  get firstFullWeekOfMonths() {
    return this.calendar.reduce(
      (months: Array<{ value: number; index: number }>, week, index, weeks) => {
        if (index > 0) {
          const lastWeek = weeks[index - 1][0].date;
          const currentWeek = week[0].date;
          if (
            lastWeek.year() < currentWeek.year() ||
            lastWeek.month() < currentWeek.month()
          ) {
            months.push({ value: currentWeek.month(), index });
          }
        }
        return months;
      },
      []
    );
  }

  getColorIndex(value: number) {
    // TODO: fix color index
    if (value == null) {
      return 0;
    } else if (value <= 0) {
      return 0;
    } else if (value >= this.max) {
      return 4;
    } else {
      return Math.min(Math.ceil(((value * 100) / this.max) * 0.03) + 1, 4);
    }
  }

  getCountEmptyDaysAtStart() {
    return this.startDate.day();
  }

  getCountEmptyDaysAtEnd() {
    return DAYS_IN_WEEK - 1 - this.endDate.day();
  }

  getDaysCount() {
    return (
      DAYS_IN_ONE_YEAR +
      1 +
      this.getCountEmptyDaysAtStart() +
      this.getCountEmptyDaysAtEnd()
    );
  }

  // _shiftDate (date, numDays) {
  //   const newDate = new Date(date)
  //   newDate.setDate(newDate.getDate() + numDays)
  //   return newDate
  // }
  //
  // _parseDate (entry) {
  //   return (entry instanceof Date) ? entry : (new Date(entry))
  // }
  //
  // _keyDayParser (date) {
  //   let day = this._parseDate(date)
  //   return `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`
  // }
}
