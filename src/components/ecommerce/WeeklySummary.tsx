import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useData } from "../../context/DataContext";

export default function WeeklySummary() {
  const { events } = useData();

  // Calcular eventos por dia da semana atual
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Domingo

  const weekCounts = [0, 0, 0, 0, 0, 0, 0]; // Dom a Sáb

  events.forEach((e) => {
    const eventDate = new Date(e.start);
    if (eventDate >= startOfWeek && eventDate < new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000)) {
      weekCounts[eventDate.getDay()]++;
    }
  });

  // Ajustar para começar na Segunda (índice 1) até Domingo (índice 0 no final)
  const chartData = [...weekCounts.slice(1), weekCounts[0]];
  const totalEvents = weekCounts.reduce((a, b) => a + b, 0);
  
  // Carga de trabalho (Exemplo: > 10 eventos = Pesada)
  const workload = totalEvents > 10 ? "Pesada" : totalEvents > 5 ? "Média" : "Leve";
  const workloadColor = totalEvents > 10 ? "text-red-500" : totalEvents > 5 ? "text-orange-500" : "text-green-500";
  const workloadPercent = Math.min(100, (totalEvents / 15) * 100); // 15 eventos = 100%

  const chartOptions: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 280,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "50%",
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: false },
    xaxis: {
      categories: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: "#64748b",
          fontSize: "12px",
        },
      },
    },
    yaxis: { 
      show: true,
      labels: {
        style: {
          colors: "#64748b",
          fontSize: "12px",
        },
      },
    },
    grid: { 
      show: true,
      borderColor: "#e2e8f0",
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    tooltip: { enabled: true },
  };

  const chartSeries = [
    {
      name: "Eventos",
      data: chartData,
    },
  ];

  return (
    <div className="h-full rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6 flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Resumo Semanal
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Análise de eventos e carga de trabalho
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 gap-6 lg:grid-cols-2 items-center">
        {/* Coluna 1: Gráfico de Eventos */}
        <div className="w-full">
          <h4 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
            Eventos por dia
          </h4>
          <div className="w-full">
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="bar"
              height={280}
            />
          </div>
        </div>

        {/* Coluna 2: Carga e Horários */}
        <div className="space-y-5 w-full">
          {/* Carga de Reuniões */}
          <div>
            <h4 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              Carga de Reuniões
            </h4>
            <div className="flex items-center gap-3">
              <div className="relative h-3 w-full max-w-[200px] rounded-full bg-gray-100 dark:bg-gray-700">
                <div
                  className={`absolute left-0 top-0 h-full rounded-full ${totalEvents > 10 ? "bg-red-500" : totalEvents > 5 ? "bg-orange-500" : "bg-green-500"}`}
                  style={{ width: `${workloadPercent}%` }}
                ></div>
              </div>
              <span className={`text-sm font-bold ${workloadColor}`}>{workload}</span>
            </div>
            <p className="mt-1 text-xs text-gray-400">
              {totalEvents} eventos agendados esta semana
            </p>
          </div>

          {/* Horários Mais Ocupados (Simulado por enquanto, pois requer análise complexa) */}
          <div>
            <h4 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              Horários mais ocupados
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 dark:border-gray-800 dark:bg-white/[0.02]">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Manhã (09:00 - 12:00)
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  Frequente
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
