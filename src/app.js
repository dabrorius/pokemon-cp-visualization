import DetailsView from './components/details_view'

var d3 = require("d3");
var height = 600;
var width = 1000;
var padding = 40;

var cpScale = d3.scaleLinear()
  .domain([0, 3670])
  .range([padding, width-padding]);

var hpScale = d3.scaleLinear()
  .domain([0, 415])
  .range([height-padding, padding]);

var typeScale = d3.scaleOrdinal()
  .domain(['Normal', 'Fire', 'Fighting', 'Water', 'Flying', 'Grass', 'Poison', 'Electric', 'Ground', 'Psychic', 'Rock', 'Ice', 'Bug', 'Dragon', 'Ghost', 'Dark', 'Steel', 'Fairy'])
  .range(['#A8A878', '#F08030', '#C03028', '#6890F0', '#A890F0', '#78C850', '#A040A0', '#F8D030', '#E0C068', '#F85888', '#B8A038', '#98D8D8', '#A8B820', '#7038F8', '#705898', '#705848', '#B8B8D0', '#EE99AC']);

var searchMatchRadiusScale = d3.scaleOrdinal()
  .domain([true, false])
  .range([6, 3]);

var searchMatchOpacityScale = d3.scaleOrdinal()
  .domain([true, false])
  .range([1, 0.2]);

d3.csv("pokemon.csv", function(error, rawData) {
  if (error) throw error;
  var data = rawData.map(function(element){
    element.MATCHED = true;
    return element;
  });
  console.log(data);

  var svg = d3.select("svg");

  var detailsView = new DetailsView(50, 35, svg);
  detailsView.hide();

  var circlesGroup = svg.append('g');

  circlesGroup.selectAll('circle').data(data).enter()
    .append('circle')
    .attr('cx', function(d) { return cpScale(d['MAX_CP_40']); })
    .attr('cy', function(d) { return hpScale(d['MAX_HP_40']); })
    .attr('fill', function(d) { return typeScale(d['TYPE1']); })
    .attr('r', 6)
    .on('mouseover', function(d) {
      if( d['MATCHED'] ) {
        d3.select(this).attr('style', 'stroke:#555;stroke-width:3px;');
        detailsView.show();
        detailsView.update(d['NAME'], d['MAX_CP_40'], d['MAX_HP_40'], d['ATK'], d['DEF'], d['STA']);
      }
      this.parentNode.appendChild(this);
    })
    .on('mouseout', function(d) {
      d3.select(this).attr('style', null);
    });


  d3.select('#pokemonSearch')
    .on('input', function(e) {
      var searchValue = this.value;
      console.log(searchValue);
      detailsView.hide();
      data.forEach(function(element) {
        if(element['NAME'].toLowerCase().includes(searchValue) || searchValue.length < 3) {
          element.MATCHED = true;
        } else {
          element.MATCHED = false;
        }
      });
      circlesGroup.selectAll('circle').data(data)
        .transition()
        .attr('r', function(d) { return searchMatchRadiusScale(d['MATCHED']) } )
        .attr('fill-opacity', function(d) { return searchMatchOpacityScale(d['MATCHED']) } )
    });

  var axisVertical = d3.axisLeft(hpScale).ticks(5);
  svg.append('g').attr('transform','translate(' + padding + ', 0)').call(axisVertical);

  var axisHorizontal = d3.axisBottom(cpScale).ticks(10);
  svg.append('g').attr('transform','translate(0,' + (height-padding) + ')').call(axisHorizontal);
});
