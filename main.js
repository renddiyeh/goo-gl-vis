var allUrlChart;

var urls = ['dbkXbS', 'FJTgqy', 'n0d4G8'];
var masterData = {};

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
  };
}

var getPieChartData = function(key, range) {
  var browserData = masterData[key].analytics[range].browsers;
  var platformData = masterData[key].analytics[range].platforms;
  
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

var drawAllUrlChart = function(range) {
  range = range || 'allTime';
  var data = {
    labels: urls,
    datasets: [
      {
        label: "My First dataset",
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1,
        data: urls.map(function(url) {
          return parseInt(masterData[url].analytics[range].shortUrlClicks);
        })
      }
    ]
  };

  var container = $('<canvas width="600" height="300"></canvas>').appendTo('#compare');

  allUrlChart = new Chart(container, {
    type: 'bar',
    data: data,
  });
};

var updateAllUrlChart = function(range) {
  $('#compare').empty();
  drawAllUrlChart(range);
};

var allDataLoaded = (function(count, cb) {
  var current = 1;
  return {
    load: function() {
      if (++current > count) cb();
    }
  };
}(urls.length, drawAllUrlChart));

var rangeCallBack = [function() {
  updateAllUrlChart($('#range').val());
}];

$(function(){
  urls.forEach(function(url, index) {
    $.getJSON('https://www.googleapis.com/urlshortener/v1/url?shortUrl=http://goo.gl/' + url + '&projection=FULL&key=AIzaSyD74hLS39SKpqOv_cJ9PGDDUoArIgk4Uo8', function(data) {
      masterData[url] = data;
      var initData = getPieChartData(url, 'allTime');
      var browserChart = new MyChart($('#url' + (index + 1) + '-1'));
      browserChart.draw(initData.browser);
      var platformChart = new MyChart($('#url' + (index + 1) + '-2'));
      platformChart.draw(initData.platform);

      rangeCallBack.push(function() {
        var newData = getPieChartData(url, $('#range').val());
        browserChart.update(newData.browser);
        platformChart.update(newData.platform);
      });
      
      allDataLoaded.load();
    }); 
  });
  $('#range').change(function() {
    rangeCallBack.forEach(function(func) { func(); })
  });
});

