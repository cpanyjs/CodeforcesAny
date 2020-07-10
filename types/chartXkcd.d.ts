declare module 'chart.xkcd' {
  interface PieOptions {
    innerRadius?: number;
    showLegend?: boolean;
    dataColors?: string[];
    legendPosition?: number;
    unxkcdify?: boolean;
  }

  class Pie {
    constructor(
      svg: HTMLOrSVGElement,
      data: {
        title?: string;
        data: {
          labels: string[];
          datasets: Array<{ data: number[] }>;
        };
        options?: PieOptions;
      }
    );
  }

  const config: {
    positionType: {
      upLeft: 1;
      upRight: 2;
      downLeft: 3;
      downRight: 4;
    };
  };
}
