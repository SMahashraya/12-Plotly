function init() {
  var selector = Plotly.d3.select("#selDataset");

  d3.json("/names").then((sampleNames) => {
      sampleNames.forEach((sample) => {
          selector
              .append("option")
              .text(sample)
              .property("value", sample);
      });
      dropdown_select.data(response)
      .enter()
      .append("option")
      .attr("value",data)
      .text(data)

      const firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
  });
}

function buildMetadata(sample) {
  var url = `/metadata/${sample}`
  d3.json(url).then(function(sample) {
      var selectMetadata = d3.select("#sample-metadata");
      selectMetadata.html("");
      Object.defineProperties(sample).forEach(function ([key, value]) {
          var row = selectMetadata.append("h5");
          row.text(`${key}: ${value}`);
      });
  });
};

function buildBubble(sample) {
  var url = `/samples/${sample}`
  d3.json(url).then(function(data) {
      var x_values = data.otu_ids;
      var y_values = data.sample_values;
      var m_size = data.sample_values;
      var m_colors = data.otu_ids;
      var t_values = data.otu_labels;

      var layout = {
          x: x_values,
          y: y_values,
          textz: t_values,
          mode: "markers",
          marker: {
              color: m_colors,
              size: m_size
          }
      };

      Plotly.newPlot("bubble", data, layout)
  });
};

function buildPie(sample) {
  var url = `/samples/${sample}`
  d3.json(url).then(function(data) {
      var pie_labels = data.otu_ids.slice(0,11);
      var pie_values = data.sample_values.slice(0,11);
      var pie_desc = data.otu_labels.slice(0,11);

      var layout = {
          values: pie_values,
          labels: pie_labels,
          type: "pie",
          name: "Top 10 Bellybutton Biodiversity Samples",
          textinfo: "percent",
          text: pie_desc,
          textposition: "inside",
          hoverinfo: "label+value+text+percent" 
      }
      Plotly.newplot("pie", data, layout)
  })
}

function optionChanged(newSample) {
  console.log("optionchanged detected and new sample selected")
  console.log("new sample: " + newSample )
  buildMetadata(newSample);
  buildBubble(newSample);
  buildPie(newSample);
}
init();
