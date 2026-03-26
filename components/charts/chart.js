import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarController,
  BarElement,
  ArcElement,
  Filler,
  RadialLinearScale,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarController,
  BarElement,
  ArcElement,
  Filler,
  RadialLinearScale
);

const Chart = ({chart}) => {

  const month = chart.month

  const lineData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Recharge (times)",
        data: [2, 5, 3, 1, 2, 3, 4, 2, 0, 3, 2, 12],
        borderColor: "#ff8084",
        backgroundColor: "#ff8084",
        borderWidth: 2,
      },
    ],
  };
  const lineData2 = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],

    datasets: [
      {
        label: "Post",
        data: month,
        borderColor: "#9AD0F5",
        backgroundColor: "#9AD0F5",
        borderWidth: 2,
      },
    ],
  };
  const lineOptions = {
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="sm:m-5 m-0">
      <h1 className="text-xs sm:text-2xl text-gray-400 font-bold">
        Posts of the year :
      </h1>
      <div>
        <Bar data={lineData2} options={lineOptions} width={778} height={308} />
      </div>

      <h1 className="text-xs sm:text-2xl text-gray-400 font-bold mt-24">
        Recharge of the year :
      </h1>
      <div>
        <Bar data={lineData} options={lineOptions} width={778} height={308} />
      </div>
    </div>
  );
};

export default Chart;
