var browserChart, platformChart;

function MyChart(container) {
  this.container = container;
  this.draw = function(data) {
    this.data = data;
    var ctx = $('<canvas width="600" height="600"></canvas>').appendTo(this.container);
    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.data.label, 
        datasets: [{
          label: '# of Votes',
          data: this.data.count,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            // 'rgba(75, 192, 192, 0.2)',
            // 'rgba(153, 102, 255, 0.2)',
            // 'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            // 'rgba(75, 192, 192, 1)',
            // 'rgba(153, 102, 255, 1)',
            // 'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero:true
            }
          }]
        }
      }
    });
  };
  this.update = function(data) {
    this.container.empty();
    this.draw(data);
  }
}

$(function(){
  $.getJSON('https://www.googleapis.com/urlshortener/v1/url?shortUrl=http://goo.gl/L2NNq6&projection=FULL&key=AIzaSyD74hLS39SKpqOv_cJ9PGDDUoArIgk4Uo8', function(data) {
      //console.log(data);
      //
    
    var getChartData = function(range) {
      var browserData = data.analytics[range].browsers;
      var platformData = data.analytics[range].platforms;
      
      var dataset = {
        browser: {
          count: [],
          label: [],
        },
        platform: {
          count: [],
          label: [],
        }
      };

      if (!browserData) return dataset;
      if (!platformData) return dataset;

      browserData.forEach(function(value) {
        dataset.browser.label.push(value.id);
        dataset.browser.count.push(value.count);
      });

      platformData.forEach(function(value) {
        dataset.platform.label.push(value.id);
        dataset.platform.count.push(value.count);
      });
      return dataset;
    };

    // init
    var initData = getChartData('allTime');

    var browserChart = new MyChart($('#myChart1'));
    browserChart.draw(initData.browser);
    var platformChart = new MyChart($('#myChart2'));
    platformChart.draw(initData.platform);

    $('#range').change(function() {
      var newRange = $(this).val();
      var newData = getChartData(newRange);
      browserChart.update(newData.browser);
      platformChart.update(newData.platform);
    });
  });   

});

