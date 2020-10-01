// Use d3.json to fetch data from the json file
function dropDown() {
    d3.json("samples.json").then((data) => {
        var sampleNames = data.names

        // Use D3 to select the dropdown menu
        var dropdownMenu = d3.select("#selDataset");
        sampleNames.forEach((x) => {
            dropdownMenu.append('option').text(x).property('value', x)
        })
        var firstID = sampleNames[0]
        buildTables(firstID)
        buildCharts(firstID)
    });

}

// declare the functions so that tables & charts draw from the same datset. 
function optionChanged(newID) {
    buildTables(newID)
    buildCharts(newID)
}

// create the function to build the tables. 
function buildTables(sampleID) {
    d3.json("samples.json").then((data) => {
        var tableInfo = data.metadata
        var filterData = tableInfo.filter(x => x.id == sampleID)
        console.log(filterData[0])
        var location = d3.select("#sample-metadata");
        location.html("")
        Object.entries(filterData[0]).forEach(([key, value]) => {
            var row = location.append('tr');
            var cell = row.append('td');
            cell.text(key)
            var cell = row.append('td');
            cell.text(`:  ${value}`)
        })
    })

}

// Create the function to populate the charts. 
function buildCharts(sampleID) {
    d3.json("samples.json").then((data) => {
        var tableInfo = data.samples
        var filterData = tableInfo.filter(x => x.id == sampleID)
        console.log(filterData)
        var otuIDs = filterData[0].otu_ids;
        var sampleValues = filterData[0].sample_values;
        var otuLabels = filterData[0].otu_labels;

        // Create the first trace. 
        var trace = {
            x: sampleValues.slice(0, 10),
            y: otuIDs.slice(0, 10).map(x => `otu ${x}`),
            type: "bar",
            orientation: 'h'
        };

        // // Create the data array for our plot.
        var data = [trace];

        // // Define the bar plot layout. 
        var layout = {
            title: "Top 10 OTUs",
            xaxis: { title: "otu_labels" },
            yaxis: { title: "otu_ids" }
        };

        // // Plot the chart to the div tag. 
        Plotly.newPlot("bar", data, layout);
        
        // Build the second trace. 
        var trace2 = {
            x: otuIDs,
            y: sampleValues,
            mode: 'markers',
            marker: {
                color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)', 'rgb(44, 160, 101)', 'rgb(255, 65, 54)'],
                opacity: [1, 0.8, 0.6, 0.4],
                size: [40, 60, 80, 100]
            }

        }

        // // Create the data & formatting for the bubble plot. 
        var data = [trace2];
        var layout = {
            title: 'Marker Size and Color',
            showlegend: false,
            height: 600,
            width: 600
        };

        // Plot the bubble chart
        Plotly.newPlot('bubble', data, layout);

    })
}
dropDown()