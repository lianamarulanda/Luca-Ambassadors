import React from 'react';
import Chart from "react-apexcharts";
import { Card, CardContent } from '@material-ui/core';
import { DbContext } from '../../util/api';
import CircularProgress from '@material-ui/core/CircularProgress';

const TopProductsComponent = (props: any) => {
  const api = React.useContext(DbContext);
  const [loaded, setLoad] = React.useState(false);
  const [productLabels, setLabels] = React.useState([] as string[]);
  const [productQuantities, setQuantities] = React.useState([] as number[])

  React.useEffect(() => {
    if (!loaded) {
      if (props.data !== undefined) {
        // populate the arrays of product labels and corresponding quantities for the graph
        var labels = [] as string[];
        var quants = [] as number[];
  
        var count = 0;
        for (let [key, value] of props.data) {
          labels.push(key);
          quants.push(value);
          count++;
          if (count === 5)
            break;
        }
  
        setLabels(labels);
        setQuantities(quants);
        setLoad(true);
      }
    }
  });
  
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
            download: false
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
          {!loaded &&
            <CircularProgress color="inherit" />
          }
          {loaded &&
            <Chart options={state.options} series={state.series} type="bar" height={350} />
          }
        </div>
      </CardContent>
    </Card>
  );
}
export default TopProductsComponent;