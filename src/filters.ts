import dayjs from 'dayjs';

import { getColor } from './utils';

export const parseTime = (val: number) =>
  dayjs(val * 1000).format('YYYY-MM-DD HH:mm');

export const rankColor = (rating?: number) => `color: ${getColor(rating)}`;
