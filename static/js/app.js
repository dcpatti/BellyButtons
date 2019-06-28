function buildMetadata(sample) {


  var url = `/metadata/${sample}`;
  d3.json(url).then(function(sample){
    var sample_metadata = d3.select("#sample-metadata");

    sample_metadata.html("");

    Object.entries(sample).forEach(function ([key, value]) {
      var row = sample_metadata.append("p");
      row.text(`${key}: ${value}`);

});
  }
)};

function buildCharts(sample) {

  var url = `/samples/${sample}`;
  d3.json(url).then(function(data) {

    var x_values = data.otu_ids;
    var y_values = data.sample_values;
    var m_size = data.sample_values;
    var m_colors = data.otu_ids;
    var t_values = data.otu_labels;

    var trace1 = {
      x: x_values,
      y: y_values,
      text: t_values,

      mode: 'markers',
      textfont: {
        family:  'Raleway, sans-serif'
      },

      marker: {
        color: m_colors,
        size: m_size
      }
    };

    var data = [trace1];

    var layout = {
      xaxis: { title: "Bacteria Type (by ID)"},
      yaxis: { title: "Bacteria Count"},
    };

    Plotly.newPlot('bubble', data, layout);



    d3.json(url).then(function(data) {
    var pieval = data.sample_values.slice(0,10);
      var pielabel = data.otu_ids.slice(0,10);
      var pietext = data.otu_labels.slice(0,10);

      var data = [{
        values: pieval,
        labels: pielabel,
        hovertext: pietext,
        title: "Bacteria Ratios",
        type: 'pie'
      }];

      Plotly.newPlot('pie', data);

    });
  });
}


function init() {
  var selector = d3.select("#selDataset");

  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });


    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  buildCharts(newSample);
  buildMetadata(newSample);
}


init();