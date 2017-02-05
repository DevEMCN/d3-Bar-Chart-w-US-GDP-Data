// USA GDP data
var url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json'

d3.json(url, function (error, data) {
  var gdp = data.data.map(function(d){ return d[1]});
  var gdp_Dates = data.data.map(function(d){ return d[0]});
  var maxGdp = d3.max(gdp);

  var margins = { top: 10, right: 10, bottom: 260, left: 85 };

  var width = 700, height = 400;
  var padding = 3;

  var svg = d3.select('.barchart')
          .append('svg')
          .attr({ width: width + margins.left + margins.right,
            height: height + margins.top + margins.bottom });

  // container for holding the bars
  var chart = svg.append('g')
                  .attr('transform', 'translate(' + margins.left + ',' +
                            margins.top + ")");

  // create the tool tip
  var tooltip = d3.select('.barchart')
      .append('div')
      .attr({
        'class': 'toolTip'
      });

  // scale to calculate height of each bars
  var xScale = d3.scale.ordinal()
                .domain(gdp)
                .rangeBands([0, width]); // calculate bar position and padding

  // scale to calculate height of each bars
  var yScale = d3.scale
              .linear()
              .domain([0, maxGdp])
              .range([0, height]);

 // this positions each bar
 function translator(d, i) {
      return "translate(" + xScale.range()[i] + "," +
                (height - yScale(d)) + ")";
 }

  // create the groups for the content of each bar
  var bars = chart.selectAll('rect')
              .data(data.data)
              .enter()
              .append('g')
              //.attr('transform', translator)
              .append('rect')
            .attr({
                  fill: 'steelblue',
                  width: xScale.rangeBand(),
                  height: function(d) { return yScale(d[1])},
                  x: function(d, i){ return i * xScale.rangeBand()},
                  y: function(d) { return height - yScale(d[1])}
            })
            .on('mouseover', function(d){
              tooltip.style({
                'left': d3.event.pageX - 50 + 'px',
                'top': d3.event.pageY - 70  + 'px',
                'display': 'inline-block'
              })
              .html('Date:' + d[0] + '<br/>$' + d[1]);
            })
            .on('mouseout', function(d){ tooltip.style('display', 'none')});

  // creating the left axis
  var yAxisGroup = svg.append('g');
  yAxisGroup.attr(
            'transform', 'translate(' + (margins.left - padding) + ',' +
                                              margins.top + ')');

  var yAxisScale = d3.scale
                  .linear()
                  .domain([maxGdp, 0])
                  .range([0, height]);

  var leftAxis = d3.svg.axis()
                  .orient('left')
                  .scale(yAxisScale);

  var yAxisNodes = yAxisGroup.call(leftAxis);
  styleAxisNodes(yAxisNodes);

  // bottom axis
  var minDate = new Date(d3.min(gdp_Dates));
  var maxDate = new Date(d3.max(gdp_Dates));

  var xAxisScale = d3.time.scale()
          .domain([minDate, maxDate])
          .range([padding, width + padding]);

  var xAxis = d3.svg.axis()
                  .scale(xAxisScale)
                  .orient("bottom");

  var xAxisX = margins.left - padding;
  var xAxisY = height + margins.top  + padding;

  var xAxisGroup = svg.append("g")
                  .attr({ transform: 'translate(' + xAxisX + ',' + xAxisY + ')' });

  var xAxisNodes = xAxisGroup.call(xAxis);
  styleAxisNodes(xAxisNodes);

  xAxisNodes.selectAll("text")
          .style('text-anchor', 'start')
          .attr({
                dx: 10,
                dy: -5,
                transform: 'rotate(90)'
           });

  function styleAxisNodes(axisNodes) {
    axisNodes.selectAll('.domain')
              .attr({
                    fill: 'none',
                    'stroke-width': 1,
                    stroke: 'black'
              });
    axisNodes.selectAll('.tick line')
            .attr({
                fill: 'none',
                'stroke-width': 1,
                stroke: 'black'
            });
   }
});
