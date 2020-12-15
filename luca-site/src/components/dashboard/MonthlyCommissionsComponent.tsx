import React from 'react';
import Chart from "react-apexcharts";
import { Card, CardContent } from '@material-ui/core';
import { DbContext } from '../../util/api';
import CircularProgress from '@material-ui/core/CircularProgress';

const initialPlotState = Object.freeze({
  series: [{
    name: "Commissions Amount ($)",
    data: [] as any,
    colors: ['#F44336']
  }],
  options: {
    chart: {
      height: 350,
      width: 100,
      type: 'line',
      zoom: {
        enabled: false
      },
      toolbar: {
        tools: {
          download: false
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'straight',
      colors: ['#83A672'],
    },
    title: {
      text: `PLACEHOLDER`,
      align: 'left'
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5
      },
    },
    xaxis: {
      categories: [] as any
    }
  },
} as any);

const MonthlyCommissionsComponent = (props: any) => {
  const [loaded, setLoad] = React.useState(false);
  const [plotState, setPlotState] = React.useState(initialPlotState);
  const api = React.useContext(DbContext);
  var currDate = new Date();
  var data = [] as any[];
  var monthCreated = api.getMonthCreated(); 

  const monthLookup = {
    0: "Jan",
    1: "Feb",
    2: "Mar",
    3: "Apr",
    4: "May",
    5: "Jun",
    6: "Jul",
    7: "Aug",
    8: "Sep",
    9: "Oct",
    10: "Nov",
    11: "Dec"
  } as any;

  var monthLabels: string[] = [];
  
  React.useEffect(() => {
    console.log(props.data);
    if (!loaded && props.data !== undefined) {
      data = props.data;
      for (var i = monthCreated; i <= currDate.getMonth(); i++) {
        monthLabels.push(monthLookup[i]);
      }

      var plotData = [];
      for (var month = monthCreated; month < data.length; month++) {
        plotData.push(data[month]);
      }

      setPlotState({
        ...plotState,

        series: [{
          name: "Commissions Amount ($)",
          data: plotData,
          colors: ['#F44336']
        }],
        options: {
          title: {
            text: `Commissions Earned by Month ($) ${currDate.getFullYear()}`,
            align: 'left'
          },
          xaxis: {
            categories: monthLabels
          }
        }
      })

      setLoad(true);
    }
  });

  return (
    <Card>
      <CardContent>
        {!loaded &&
          <CircularProgress />
        }
        {loaded &&
          <div id="chart">
          <Chart options={plotState.options} series={plotState.series} type="line" height={350} />
          </div>
        }
      </CardContent>
    </Card>
  );
}

export default MonthlyCommissionsComponent;