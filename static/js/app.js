function init() {
  var selector = Plotly.d3.select("#selDataset");

  d3.json("/names").then((sampleNames) => {
      sampleNames.forEach((sample) => {
          selector
              .append("option")
              .text(sample)
              .property("value", sample);
      });
      // dropdown_select.data(sampleNames)
      // .enter()
      // .append("option")
      // .attr("value",data)
      // .text(data)

      const firstSample = sampleNames[0];
      console.log(firstSample)
      buildMetadata(firstSample);
      buildBubble(firstSample);
      buildPie(firstSample);
  });
}

function buildMetadata(sample) {
  console.log("You're in buildMetadata")
  var url = `/metadata/${sample}`
  d3.json(url).then(function(response) {
      console.log(response)
      var selectMetadata = d3.select("#sample-metadata");
      // selectMetadata.html("");
      selectMetadata.selectAll("p").remove();
      Object.entries(response).forEach(([key, value]) => {
        selectMetadata.append("p").text(`${key}: ${value}`);
      }); 
      // {
        // console.log(response)
        //   var row = selectMetadata.append("p");
        //   row.text(`${key}: ${value}`);
        //   console.log(row)
        //   console.log(row.text)
      // });
  });
};

function buildBubble(sample) {
  console.log("You're in buildBubble")
  var url = `/samples/${sample}`
  d3.json(url).then((data) => {
      var x_values = data.otu_ids;
      var y_values = data.sample_values;
      var m_size = data.sample_values;
      var m_colors = data.otu_ids;
      var t_values = data.otu_labels;

      var layout = {
        margin: { t: 0 },
        hovermode: "closest",
        xaxis: { title: "OTU ID" }
      };

      var data = [{
          x: x_values,
          y: y_values,
          text: t_values,
          mode: "markers",
          marker: {
              color: m_colors,
              size: m_size,
              colorscale: "Fire"
          }
      }];

      Plotly.newPlot("bubble", data, layout)
  });
};

function buildPie(sample) {
  console.log("You're in buildPie")
  var url = `/samples/${sample}`
  d3.json(url).then((data) => {
      var pie_labels = data.otu_ids.slice(0,11);
      var pie_values = data.sample_values.slice(0,11);
      var pie_desc = data.otu_labels.slice(0,11);
      console.log(pie_labels)
      console.log(pie_values)
      console.log(pie_desc)

      var layout = {
        margin: { t: 0, l: 0 }
      };

      var data = [{
          values: pie_values,
          labels: pie_labels,
          type: "pie",
          name: "Top 10 Bellybutton Biodiversity Samples",
          textinfo: "percent",
          text: pie_desc,
          textposition: "inside",
          hoverinfo: "label+value+text+percent" 
      }];

      Plotly.plot("pie", data, layout)
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
