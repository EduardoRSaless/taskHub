import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import { useState, useEffect } from "react";
import { useData } from "../../context/DataContext";

export default function MonthlySalesChart() {
  const { projects } = useData();
  const [chartType, setChartType] = useState<"bar" | "line">("bar");
  const [monthlyData, setMonthlyData] = useState<number[]>(Array(12).fill(0));

  useEffect(() => {
    // Recalcular dados sempre que 'projects' mudar
    const data = Array(12).fill(0);
    
    projects.forEach((p) => {
      // Normalizar status e verificar data
      if (p.status === "Concluído" && p.dueDate) {
        // Tentar criar data de várias formas para garantir compatibilidade
        const date = new Date(p.dueDate);
        if (!isNaN(date.getTime())) {
          const month = date.getMonth();
          data[month]++;
        }
      }
    });
    
    setMonthlyData(data);
  }, [projects]);

  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: chartType,
      height: 280,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        borderRadius: 4,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: chartType === "line" ? 3 : 0,
      curve: "smooth",
      colors: chartType === "line" ? ["#465fff"] : ["transparent"],
    },
    xaxis: {
      categories: [
        "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
        "Jul", "Ago", "Set", "Out", "Nov", "Dez",
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: "#64748b", fontSize: "12px" },
      },
    },
    legend: { show: false },
    yaxis: {
      title: { text: undefined },
      labels: {
        style: { colors: "#64748b", fontSize: "12px" },
        formatter: (val) => val.toFixed(0), // Mostrar inteiros
      },
    },
    grid: {
      borderColor: "#e2e8f0",
      strokeDashArray: 4,
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
      padding: { top: 0, right: 0, bottom: 0, left: 10 },
    },
    fill: { opacity: 1 },
    tooltip: {
      theme: "light",
      y: {
        formatter: (val: number) => `${val} Projetos`,
      },
    },
  };

  const series = [
    {
      name: "Concluídos",
      data: monthlyData,
    },
  ];

  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  function handleChartTypeChange(type: "bar" | "line") {
    setChartType(type);
    closeDropdown();
  }

  return (
    <div className="h-full rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6 flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Projetos Concluídos
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Desempenho mensal de entregas
          </p>
        </div>
        
        <div className="relative inline-block">
          <button 
            className="flex items-center justify-center rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300" 
            onClick={toggleDropdown}
          >
            <MoreDotIcon className="h-5 w-5" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2 right-0 top-full mt-1"
          >
            <DropdownItem
              onItemClick={() => handleChartTypeChange("bar")}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
            >
              Gráfico de Barras
            </DropdownItem>
            <DropdownItem
              onItemClick={() => handleChartTypeChange("line")}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
            >
              Gráfico de Linha
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="flex-1 w-full flex items-center">
        <div className="w-full">
          <Chart options={options} series={series} type={chartType} height={280} />
        </div>
      </div>
    </div>
  );
}
