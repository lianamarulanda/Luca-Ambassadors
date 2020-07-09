import React from 'react';
import Chart from "react-apexcharts";
import { Card, CardContent } from '@material-ui/core';
import { DbContext } from '../../util/api';

const MonthlyCommissionsComponent = () => {
  const api = React.useContext(DbContext);
  var data = api.codeData as any;
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

  monthLabels.push("Jan");
  monthLabels.push("Feb");
  monthLabels.push("Mar");


  // for (var i = 0; i < data.monthlyCommissions.length; i++) {
  //   monthLabels.push(monthLookup[i]);
  // }

  console.log(monthLabels);

  const state = {
    series: [{
        name: "Commissions Amount ($)",
        // data: data.monthlyCommissions,
        data: [5, 15, 20], 
        colors:['#F44336']
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
            download:false
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
        text: 'Commissions Earned by Month ($) 2020',
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
        <div id="chart">
          <Chart options={state.options} series={state.series} type="line" height={350}/>
        </div>
      </CardContent>
    </Card>
  );
}

export default MonthlyCommissionsComponent;