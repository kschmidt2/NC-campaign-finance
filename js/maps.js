function buildMap (selectCandidate){

  console.log(selectCandidate);


  var mapFile = "data/states.csv";
  d3.csv(mapFile,
      function(d) {
          return {
              state: d.state,
              cooper: +d.cooper,
              mccrory: +d.mccrory,
              total: +d.total,
          };
      },
      function(error, data) {
              if (error != null) {
                  console.log("Uh-oh, something went wrong. Try again?");
              } else {
                  console.log("Just loaded " + data.length + " records.");

                  map_data(data)
              }
      });

      var map_data = function(data) {
        console.log(data);

        var series = data;
        var dataset = {};

        var colors = {total: ["#d2d9da","#1f3f48"], mccrory: ["#ebbaba", "#c73838"], cooper: ["#c1c3da", "#4e5394"] };

        var onlyValues = series.map(function(d){ return d[selectCandidate]; });
        var minValue = Math.min.apply(null, onlyValues),
            maxValue = Math.max.apply(null, onlyValues);

        var paletteScale = d3.scale.linear()
            .domain([minValue,maxValue])
            .range([colors[selectCandidate][0], colors[selectCandidate][1]]);

        series.forEach(function(d){ //
            var iso = d.state,
                value = d[selectCandidate];
                dataset[iso] = { numberOfThings: value, fillColor: paletteScale(value) };
        });


        var map = new Datamap({
            element: document.getElementById('usmap'),
            scope: 'usa',
            fills: { defaultFill: '#FFF' },
            data: dataset,
            responsive: true,
            geographyConfig: {
              highlightBorderWidth: 0,
                highlightFillColor: colors[selectCandidate][1],
                // show desired information in tooltip
                popupTemplate: function(geo, data) {
                    // don't show tooltip if country don't present in dataset
                    if (!data) { return ; }
                    // tooltip content
                    return ['<div class="hoverinfo">',
                        '<strong>', geo.properties.name, '</strong>',
                        '<br>Amount: <strong>$', data.numberOfThings.toLocaleString(), '</strong>',
                        '</div>'].join('');;
                }
            }
        });

        $(window).on('resize', function() {
           map.resize();
        });
      }
}


$(".states").on('click', function(){
  $this = this;
  var candidateId = $(this).attr('id');
  $('.map').html('<div id="usmap"></div>');
  buildMap(candidateId);
  $('button').removeClass('active');
  $(this).addClass('active');
});

buildMap('total');
$('.map').html('<div id="usmap"></div>');
