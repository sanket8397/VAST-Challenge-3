function draw_circle_bar(data, parentDiv, isUpdate = false) {
    // var margin = { top: 0, right: 0, bottom: 100, left: 0 };

    if (parentDiv == "tempId" && !isUpdate) {
        addCircleLegends();
    }

    var map_div = d3.select("#" + parentDiv);
    var width = +map_div.style("width").replace("px", "");
    var height = +map_div.style("height").replace("px", "");
    var innerRadius = 60,
        outerRadius = Math.min(width, height) / 2; // the outerRadius goes from the middle of the SVG area to the border

    var groupedData = d3.group(data, (d) => d.business);
    var plotEnd = (2 * Math.PI) / 3;
    var plotStart = 0;

    var colorScale = d3.scaleOrdinal()
        .domain(Array.from(groupedData.keys()))
        .range(d3.schemePaired);
    groupedData.forEach((groupData, business) => {

        // append the svg object to the body of the page
        var svg = d3
            .select("#chart_svg_" + parentDiv)
            .attr("width", width + "px")
            .attr("height", height + "px")
            .append("g")
            .attr("id", business)
            .attr(
                "transform",
                "translate(" + width / 2 + "," + (height / 1.7) + ")"
            );
        svg.append("text")
            .attr("class","pieText")
            .text("bruh")
            .attr('text-anchor','middle')
            .attr('font-weight','bold')
            .attr('opacity',0)
        // X scale
        var x = d3
            .scaleBand()
            .range([plotStart, plotEnd])
            .align(0)
            .domain(groupData.map(d => d.venueId));

        // Y scale
        var y = d3
            .scaleRadial()
            .range([innerRadius, outerRadius]) // Domain will be define later.
            .domain([0, d3.max(data, d => d.amount)]); // Domain of Y is from 0 to the max seen in the data

        // Add bars
        svg
            // .append("g")
            .selectAll("path")
            .data(groupData)
            .enter()
            .append("path")
            .attr("fill", d => colorScale(d.business))
            .on('click', function (event, d) {
                // Replace the console.log with your logic to render another chart
            })
            .on('mouseover', function (event, d) {
                d3.select(".pieText").transition()
                .duration('200')
                .attr('opacity',1)
                .text(`${(""+d.amount).split(".")[0]}`)
                .attr('font-size','12')

                d3.select(this)
                    .transition()
                    .duration(100)
                    .style("transform", "scale(1.2)");
            })
            .on('mouseout', function (event, d) {
                d3.select(this)
                    .transition()
                    .duration(100)
                    .style("transform", "scale(1)");
                d3.select(".pieText").transition()
                    .duration('200')
                    .attr('opacity',0)
            })
            .attr("d", d3
                .arc() // imagine your doing a part of a donut plot
                .innerRadius(innerRadius)
                .outerRadius(function (d) {
                    return y(d.amount);
                })
                .startAngle(function (d) {
                    return x(d.venueId);
                })
                .endAngle(function (d) {
                    return x(d.venueId) + x.bandwidth();
                })
                .padAngle(0.01)
                .padRadius(innerRadius)
            );
        plotEnd += (2 * Math.PI) / 3;
        plotStart += (2 * Math.PI) / 3;

        svg.append("g")
            .selectAll("g")
            .data(groupData)
            .enter()
            .append("g")
            .attr("text-anchor", function (d) { return (x(d.venueId) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
            .attr("transform", function (d) { return "rotate(" + ((x(d.venueId) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")" + "translate(" + (y(d['amount']) + 10) + ",0)"; })
            .append("text")
            .text(function (d) { return (d.venueId) })
            .attr("transform", function (d) { return (x(d.venueId) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
            .style("font-size", "11px")
            .attr("alignment-baseline", "middle")

        svg.on("click", (d, e) => {
            venueId = d.target.__data__.venueId;
            plotHeatmap(venueId)
        })
    });
}

function addCircleLegends(){
    let legend_container = document.querySelector(".legend-container")
    const remove_legend = document.querySelectorAll(".legend-options-container");
    for (let i = 0; i < remove_legend.length; i++) {
        remove_legend[i].remove();
    }

    const optionLength = 3;
    let legend_items = [
        `Pub`,
        `Restaurant`,
        `School`
    ]
    
    legend_colors = ["#a6cee3", "#1f78b4", "#b2df8a"]

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
