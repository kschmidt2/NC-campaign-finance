function buildChart(chartCandidate) {

  console.log(chartCandidate);

  // margins
  var margin = {top: 0, right: 10, bottom: 0, left: 85},
      width = 500 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

  // create responsive svg
  var svg = d3.select("#" + chartCandidate + "-chart")
      .append("div")
      .classed("svg-container-line", true) //container class to make it responsive
      .append("svg")
      //responsive SVG needs these 2 attributes and no width and height attr
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 585 480")
      //class to make it responsive
      .classed("svg-content-responsive", true)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scale.linear()
      .rangeRound([0, width]);

  var y = d3.scale.ordinal()
      .rangeRoundBands([0, height], .2);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickSize(-height)
      .tickFormat(function(d) { return "$" + d.toLocaleString(); });

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");


  var dataFile = "data/cities.csv";
  d3.csv(dataFile,
      function(d) {
          return {
              city: d.city,
              amount: +d.amount,
              candidate: d.candidate
          };
      },
      function(error, data) {
          if (error != null) {
              console.log("Uh-oh, something went wrong. Try again?");
          } else {
              var filtered_data = data.filter(function(d,i,arr) {
                if (chartCandidate == d.candidate) {
                  return d.city;
                } else {
                  return false;
                }
              });
              plot_data(filtered_data);
          }
      });

  var plot_data = function(data) {
    console.log(data);

    y.domain(data.map(function(d) { return d.city; }));
    x.domain([0, 140000]).nice();

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset(function() {
          if (chartCandidate == 'mccrory') {
            return [20,0]
          } else {
            return [120,0]
          }
        })
        .html(function(d) {
          return "City: " + d.city + "</br>Amount: " + d.amount.toLocaleString();
        })

    svg.call(tip);


    var g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
        .attr("y", -5)
        .attr("x", -10)
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "end");

    g.append("g")
        .attr("class", "axis")
        .attr("stroke-width", 0)
        .call(yAxis);

    var hoverbox = g.append("g")
        .attr("class", chartCandidate+"hover")
          .attr("x", width-100)
          .attr("y", height-100);


    function hoverBar(d) {
      hoverbox.append("text")
          .attr("x", width)
          .attr("y", height-50)
          .style("font-size","1.5em")
          .text(d.city + " $" + d.amount.toLocaleString())
          .style("text-anchor", "end");
    }

    function hoverOut() {
      hoverbox.select("text").remove();
    }


    svg.selectAll("bar")
        .data(data)
      .enter().append("rect")
        .attr("class", chartCandidate + "-bar")
        .attr("x", margin.left )
        .attr("height", y.rangeBand())
        .attr("y", function(d) { return y(d.city) + margin.top; })
        .attr("width", function(d) { return x(d.amount); })
        .on('mouseover', hoverBar)
        .on('mouseout', hoverOut);







      $('#mccrory-chart').css('height', height-80+'px');
};

};

buildChart('mccrory');
buildChart('cooper');

var height = $('#mccrory-chart').height();
