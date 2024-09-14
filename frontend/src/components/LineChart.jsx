import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { useState, useEffect } from "react";
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress

const LineChart = ({ isCustomLineColors = false, isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Add a loading state

  const fetchData = async () => {
    try {
      const response = await fetch("https://renteaseadmin.onrender.com/admin/transactions/weekly");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const jsonData = await response.json();

      // Transform fetched data to match the chart format
      const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      const transformedData = daysOfWeek.map(day => {
        const dayData = jsonData.find(item => item.day === day);
        return {
          x: day,
          y: dayData ? dayData.totalAmount : 0
        };
      });

      console.log('Transformed Data:', transformedData);

      setData([{
        id: "Total Amount",
        color: "hsl(196, 70%, 50%)",
        data: transformedData
      }]);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false); // Set loading to false when data fetch is complete
    }
  };

  useEffect(() => {
    // Fetch data on mount
    fetchData();

    // Fetch new data every week
    const interval = setInterval(fetchData, 7 * 24 * 60 * 60 * 1000); // Weekly interval
    return () => clearInterval(interval);  // Clean up the interval on component unmount

  }, []);

  if (loading) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <CircularProgress /> {/* Spinning circle loader */}
      </div>
    );
  }

  if (!data.length) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        No Data Available
      </div>
    ); // Display a message if no data
  }

  return (
    <ResponsiveLine
      data={data}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
        tooltip: {
          container: {
            color: colors.primary[500],
          },
        },
      }}
      colors={isDashboard ? { datum: "color" } : { scheme: "nivo" }}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ 
        type: "point",
        min: 'auto',
        max: 'auto',
        includeZero: false,
        align: 'middle'
      }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: true,
        reverse: false,
      }}
      yFormat=" >-.2f"
      curve="catmullRom"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: "bottom",
        tickSize: 0,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Day of Week",
        legendOffset: 36,
        legendPosition: "middle",
        format: value => value // Ensure all days are shown
      }}
      axisLeft={{
        orient: "left",
        tickValues: 5,
        tickSize: 3,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Total Amount",
        legendOffset: -40,
        legendPosition: "middle",
      }}
      enableGridX={false}
      enableGridY={false}
      pointSize={8}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
};

export default LineChart;
