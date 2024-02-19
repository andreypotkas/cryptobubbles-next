type Props = {
  value: string;
};

enum CHART_COLORS {
  GREEN = "rgba(46, 204, 113, 0.5)",
  RED = "rgba(255,99,71, 0.5)",
}

export default function PriceChangeCell({ value }: Props) {
  const color = +value > 0 ? CHART_COLORS.GREEN : CHART_COLORS.RED;

  const toPercentage = (value: number, max: number = 2) => {
    const newValue = Intl.NumberFormat("en-US", {
      style: "percent",
      minimumFractionDigits: 1,
      maximumFractionDigits: max,
    }).format(value / 100);

    return value < 0 ? newValue : "+" + newValue;
  };

  return (
    <div className=" p-2 rounded text-center" style={{ background: color }}>
      {toPercentage(+value)}
    </div>
  );
}
