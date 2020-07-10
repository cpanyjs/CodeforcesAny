import { Pie as BasePie, PieOptions, config } from 'chart.xkcd';

export const positionType: typeof config.positionType = config.positionType;

export function Pie(
  el: HTMLOrSVGElement,
  data: Array<[string, number]>,
  options?: PieOptions & { title: string }
) {
  return new BasePie(el, {
    data: {
      labels: data.map(([key]) => key),
      datasets: [
        {
          data: data.map(([, val]) => val)
        }
      ]
    },
    options: options
  });
}
