import React from 'react';
import Chart from "react-apexcharts";
import { Card, CardContent } from '@material-ui/core';
import { DbContext } from '../../util/api';

const TopProductsComponent = () => {
  const api = React.useContext(DbContext);
  var data = api.dashboardData as any;
  var productLabels: string[] = [];
  var productQuantities: number[] = [];

  // populate the arrays of product labels and corresponding quantities for the graph
  var count = 0;
  for (let [key, value] of data.productMap) {
    productLabels.push(key);
    productQuantities.push(value);
    count++;
    if (count === 5)
      break;
  }

  const state = {
  series: [{
    name: "Quantities Sold",
    data: productQuantities,
  }],
  options: {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        tools: {
          download:false
        }
      },
    },
    fill: {
      colors: ['#83A672'],
    },
    plotOptions: {
      bar: {
        horizontal: true,
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: productLabels,
    },
    title: {
      text: 'Top 5 Products Sold',
      align: 'left'
    },
  },

  } as any;

  return (
    <Card>
      <CardContent>
        <div id="chart">
          <Chart options={state.options} series={state.series} type="bar" height={350}/>
        </div>
      </CardContent>
  </Card>
  );
}
export default TopProductsComponent;

      
