import React from 'react';
import Chart from "react-apexcharts";
import { Card, CardContent } from '@material-ui/core';
import { DbContext } from '../../util/api';
import CircularProgress from '@material-ui/core/CircularProgress';

const MonthlyCommissionsComponent = (props: any) => {
  const [loaded, setLoad] = React.useState(false);
  const api = React.useContext(DbContext);
  var monthCreated = api.getMonthCreated();
  var currDate = new Date();
  var data = props.data;

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
    if (props.data !== undefined) {
      console.log("i am not undefined!");

      for (var i = monthCreated; i < props.data.length; i++) {
        monthLabels.push(monthLookup[i]);
      }
    
      data = props.data.slice(monthCreated);
      console.log(data);

      setLoad(true);
    }
  });
  
  const state = {
    series: [{
      name: "Commissions Amount ($)",
      data: data,
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
        text: `Commissions Earned by Month ($) ${currDate.getFullYear()}`,
        align: 'left'
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
      },
      xaxis: {
        categories: monthLabels
      }
    },

  } as any;

  return (
    <Card>
      <CardContent>
        {!loaded &&
          <CircularProgress />
        }
        {loaded &&
          <div id="chart">
          <Chart options={state.options} series={state.series} type="line" height={350} />
          </div>
        }
      </CardContent>
    </Card>
  );
}

export default MonthlyCommissionsComponent;