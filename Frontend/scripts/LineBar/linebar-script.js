var last_selected_path, last_selected_area;
var svg, x_axis_data, xScale, yScale;
var line_data;
var bar_data;
var chartWidth = 0;
var chartHeight = 0;
var data, bar_data_process;

function addMapFiltersBarLine() {
  // Add map filters
  let filter_container = document.querySelector(".filter-container")
  let newDiv = document.createElement("label")
  newDiv.style.margin = 'auto'
  newDiv.style.display = 'flex'
  newDiv.style.flexDirection = 'column'
  newDiv.style.gap = '1rem'
  let newButton = document.createElement('button')
  newButton.textContent = 'Change number of records'
  newButton.addEventListener('click',()=>{
    plotLineBar(document.getElementById('barline_input').value,true) 
  })
  newDiv.setAttribute("for", "barline_input")
  let innerHTML = ` Number of records<input type="number" name="barline_records" value="100" id="barline_input">`
  newDiv.innerHTML = innerHTML;
  newDiv.appendChild(newButton)
  filter_container.appendChild(newDiv)
//   mapFiltersFunctionality();
}

function draw_bar_line(data, parentDiv,isUpdate = false) {

    //var mapExtent = { minX: -5000, minY: -200, maxX: 2800, maxY: 8000 };
    // var viewExtent = { minX: -5000, minY: -400, maxX: 3000, maxY: 8200 };
    new_load_function(data, parentDiv);
    if(!isUpdate && parentDiv == "tempId"){
        addMapFiltersBarLine()
    }
}
function new_load_function(data, parentDiv) {

    create_x_axis_data(data);
  plot_graph(x_axis_data, parentDiv);
}

function plot_graph(x_axis_data, parentDiv) {
    var keys = Object.keys(x_axis_data);
    create_line_chart_data(x_axis_data);
    create_bar_chart_data(x_axis_data);

    if (parentDiv == "tempId") {
        addLineBarLegends();
    }
    // Display the values in the console
    // Set up the SVG container

    const div = d3.select("#" + parentDiv)
    const svgWidth = div.style("width").replace("px", "");
    const svgHeight = div.style("height").replace("px", "");

    const margin = { top: 20, right: 20, bottom: 60, left: 40 };
    chartWidth = svgWidth - margin.left - margin.right;
    chartHeight = svgHeight - margin.top - margin.bottom;
    svg = d3.select("#chart_svg_" + parentDiv)
        .attr("width", svgWidth)
        .attr("height", svgHeight)

    const chart = svg.append('g')
        .attr('transform', `translate(${margin.left},  ${margin.top})`);

    const values = Object.values(line_data); // Extract values from object

    // Find the maximum value
    const maxValue = Math.max(...values.map(d => d.average)); // Get maximum value

    // Display the maximum value
    // Set up the x-axis scale

    //creating data for line and bar plotting
     data = Object.entries(line_data).map(([key, value]) => ({ key, average: value.average }));

     bar_data_process = Object.entries(bar_data).map(([key, value]) => ({ key, average: value.average_rate }));


    //Defining x and y axis
    xScale = d3.scaleBand()
        .range([0, chartWidth * 0.95])
        .domain(data.map(d => d.key))
        .padding(0.5)
    // .padding(0.1);


    yScale = d3.scaleLinear()
        .domain([0, maxValue])
        .rangeRound([chartHeight, 0]);

    //add x axis label
    svg.append("text")
        .attr("x", chartWidth / 2)
        .attr("y", chartHeight * 1.08)
        .style("text-anchor", "middle")
        .style("font-size", "0.85em")
        .text("Building IDs");

    // add y axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (chartHeight / 2) - 60)
        .attr("dy", "1em")
        .style("font-size", "0.65em")
        .style("text-anchor", "middle")
        .text("Rate in Dollars");

    //call x axis
    chart.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${chartHeight} )`)
        .call(d3.axisBottom(xScale).tickFormat(function (d) {
            return d
        }))
        .selectAll("text")
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "end")
        .attr("font-size", "3px")
        .attr("x", 10)
        .attr("y", -1)
        .attr("dx", "-6em")


    // Add y-axis
    chart.append('g')
        .attr('class', 'y-axis')
        .call(d3.axisLeft(yScale));


    //line chart
    const line = d3.line()
        .x(d => xScale(d.key) + 42)
        .y(d => yScale(d.average))
        .curve(d3.curveLinear);


    svg.append('path')
        .datum(data)

        .attr('class', 'line')
        .attr('d', line)

        .attr('stroke', '#43aa8b')
        .attr('stroke-width', 1)
        .attr('fill', 'none')
        .on("mousemove", function () {
            line_mousemove();
        })


    //bar chart
    svg.selectAll("mybar")
        .data(bar_data_process)
        .join("rect")
        .attr("x", function (d) {
            //console.key("d is: " + d.key)
            return xScale(d.key) + 40;
        })
        .attr("y", function (d) {
            return yScale(d.average) + 20
        })

        .attr("width", xScale.bandwidth())
        .attr("height", function (d) { return chartHeight - yScale(d.average) })
        .attr("fill", '#6739d4')
        .on("mouseover", function (d, i) {
            tooltip.html("Building ID: " + i.key + "<br/> Average 10 hours wage: " + i.average
            + "<br/> Average rental cost of building: " + tooltip_text(i.key))
                .style("background", "light-blue")
                .style("visibility", "visible");
        })
        .on("mousemove", function () {
                tooltip
                .style("top", (event.pageY - 10) + "px")
                .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function () {
            tooltip.html(``).style("visibility", "hidden");

        });;

    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "d3-tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("padding", "15px")
        .style("background", "#fff")
        .style("border-radius", "5px")
        .style("border", "solid")
        .text("a simple tooltip");


    //adding the legend
    // create_legend();

}
function tooltip_text(key1) {

rental = data.filter((d) => {
  return d.key == key1;
});

return rental[0].average;

}
function create_legend() {
    var keys = ["Average 10 hours rate for jobs in building", "Average rental cost of building"]
    var color = ["blue", "red"]
    const div = d3.select("#main-legend-svg")
    const legendWidth = div.attr("width")
    const legendHeight = div.attr("height")
    const margin = { left: 10, top: 0, right: 0, bottom: 0 };
    const sizeWidth = legendWidth + margin.left + margin.right
    const sizeHeight = legendHeight + margin.top + margin.bottom
    div.selectAll("mydots")
        .data(keys)
        .enter()
        .append("rect")
        .attr("fill", function (d, i) {
            return color[i]
        })
        .attr("x", legendWidth + margin.left)
        .attr("y", function (d, i) {
            return i * (30) + (15 / 2)
        }) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("width", 25)
        .attr("height", 25)

    // Add one dot in the legend for each name.
    div.selectAll("mylabels")
        .data(keys)
        .enter()
        .append("text")
        .attr("x", legendWidth)

        .attr("y", function (d, i) {
            return 45 + i * (sizeHeight + 30) + (sizeHeight / 2)
        }) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function (d, i) {
            return color[i]
        })
        .text(function (d) {
            return d
        })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .style("font-size", "1.2em")
    // .call(wrap, sizeWidth)

}
function create_x_axis_data(data) {
    const propertyToGroupBy = 'buildingId';
    // Use reduce() to group objects by the specified property
    x_axis_data = data.reduce((acc, obj) => {
        const key = obj[propertyToGroupBy];
        if (!acc[key]) {
            acc[key] = [];
        }
        // Keep only unique values based on a specific property
        if (!acc[key].some(item => item.apartmentId === obj.apartmentId)) {
            acc[key].push(obj);
        }
        return acc;
    }, {});

}

function create_line_chart_data(x_axis_data) {
    //const key = 'name'; // Replace 'name' with the specific key you want to use
    const avgKey = 'average'; // Key to store the average value

    // Calculate the average of ID values for each key
    line_data = Object.entries(x_axis_data).reduce((acc, [k, v]) => {
        const rent = v.map(d => d.rentalCost); // Extract ID values
        const avg = rent.reduce((sum, val) => sum + val, 0) / rent.length; // Calculate average
        acc[k] = { [avgKey]: avg }; // Store average value in new object
        return acc;
    }, {});
}

function create_bar_chart_data(x_axis_data) {
    //const key = 'name'; // Replace 'name' with the specific key you want to use
    const avgKey = 'average_rate'; // Key to store the average value

    // Calculate the average of ID values for each key
    bar_data = Object.entries(x_axis_data).reduce((acc, [k, v]) => {
        const rent = v.map(d => d.hourlyRate); // Extract ID values
        const avg = rent.reduce((sum, val) => sum + val, 0) / rent.length; // Calculate average
        acc[k] = { [avgKey]: avg * 10 }; // Store average value in new object
        return acc;
    }, {});

    // Display the resulting object
}

function line_mousemove() {
    const bisect = d3.bisector(d => d.key).left;
    const mouseX = d3.pointer(event)[0];

    // Use the bisector function to find the nearest data point on the x-axis
    const xValue = xScale.invert(mouseX);
    const index = bisect(data, xValue);
    // const nearestDataPoint = data[index];

    // Log the x-axis value to the console
}

function addLineBarLegends(){
    let legend_container = document.querySelector(".legend-container")
    const remove_legend = document.querySelectorAll(".legend-options-container");
    for (let i = 0; i < remove_legend.length; i++) {
        remove_legend[i].remove();
    }
    const optionLength = 2;

    let legend_items = [
      `Average 10 hours rate for jobs in building`,
      `Average rental cost of building`,
    ]
    
    legend_colors = ["#6739d4", "#43aa8b"]

    for (let i = 0; i < optionLength; i++) {
        const container = document.createElement("div");
        container.setAttribute("class", "legend-options-container");
        container.style.display = "inline-block";

        const circle = document.createElement("div");
        circle.style.width = "20px";
        circle.style.height = "20px";
        circle.style.borderRadius = "50%";
        circle.style.backgroundColor = legend_colors[i];
        circle.style.border = "1px solid black";
        circle.style.display = "inline-block";
        circle.style.marginLeft = "10px";
        container.appendChild(circle);

        const label = document.createElement("span");
        label.textContent = legend_items[i];
        label.style.marginLeft = "10px";
        container.appendChild(label);

      legend_container.appendChild(container)
    }
  }
