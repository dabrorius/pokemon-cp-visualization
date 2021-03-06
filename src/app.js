const ScatterChart =  require('./components/scatter_chart')
const d3 = require("d3");

const svg = d3.select("#pokemonVisualization");
const dataSource = svg.attr('data-source');



const height = svg.node().getBoundingClientRect().height;
const width = svg.node().getBoundingClientRect().width;

d3.csv(dataSource, function(error, rawData) {
  if (error) throw error;

  var data = rawData.map(function(element){
    element.MATCHED = true;
    return element;
  });

  document.getElementById("pokemonSearch").focus();

  var scatterChart = new ScatterChart(svg, data, {height: height, width: width});
  window.chart = scatterChart;

  d3.select(window).on("resize", function() {
    let newWidth = svg.node().getBoundingClientRect().width;
    console.log(newWidth);
    scatterChart.updateWidth(newWidth);
    svg.select('.x.axis').call(axisHorizontal);
  });

  d3.select('#pokemonSearch')
    .on('input', function(e) {
      var searchValue = this.value;
      scatterChart.highlight(searchValue);
    });

  d3.select('#vertical-axis-select')
    .on('input', function(e) {
      var searchValue = this.value;
      scatterChart.updateVerticalDomain(this.value);
      svg.select('.y.axis').call(axisVertical);
      verticalLabel.text(this.value);
    });

  d3.select('#horizontal-axis-select')
    .on('input', function(e) {
      var searchValue = this.value;
      scatterChart.updateHorizontalDomain(this.value);
      svg.select('.x.axis').call(axisHorizontal);
      horizontalLabel.text(this.value);
    });

  var axisVertical = d3.axisLeft(scatterChart.verticalScale).ticks(5);
  svg.append('g').attr('class', 'y axis').attr('transform','translate(60, 0)').call(axisVertical);
  var verticalLabel = svg.append('text')
    .attr('x', 15)
    .attr('y', 50)
    .attr('font-family', 'verdana')
    .attr('font-size', '14px')
    .text('STA');

  var axisHorizontal = d3.axisBottom(scatterChart.horizontalScale).ticks(10);
  svg.append('g').attr('class', 'x axis').attr('transform','translate(0,' + (height-60) + ')').call(axisHorizontal);
  var horizontalLabel = svg.append('text')
    .attr('x', width - 80)
    .attr('y', height - 40)
    .attr('font-family', 'verdana')
    .attr('font-size', '14px')
    .text('CP');
});
