var svg;

const daysList = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const formatMonth = d => d3.timeFormat("%B")(d).substring(0, 3);

const startDay = new Date(2022, 2, 1);
const endDay = new Date(2023, 4, 25);
const startYear = 2022;

var cellSize = 12;

function getDateValue(data, date) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].date == date) {
            return data[i].amount;
        }
    }
}

function convertDateFormat(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
}

function draw_heat_map(data, parentDiv, isUpdate = false) {
    for (let i = 0; i < data.length; i++) {
        data[i].date = convertDateFormat(data[i].date);
    }
    if (parentDiv == "tempId" && !isUpdate) {
        addHeatmapFilters();
        addHeatmapLegends();
    }
    const tooltip = d3.select("body")
        .append("rect")
        .attr("class", "d3-tooltip")
        .style("position", "absolute")
        .style("z-index", "100")
        .style("visibility", "hidden")
        .style("padding", "15px")
        .style("background", "#fff")
        .style("border-radius", "5px")
        .style("border", "solid")
        .style("font-family", "Poppins, sans-serif")
        .text("");

    const heatmap_div = d3.select("#" + parentDiv);
    var width = +heatmap_div.style("width").replace("px", "");
    var height = +heatmap_div.style("height").replace("px", "")

    cellSize = width / 70;
    var colorScale = null;
    if (data[0].business == 'School') {
        colorScale = d3.scaleSequential(d3.interpolateGreens).domain([0, d3.max(data, d => d.amount)]);
    } else {
        colorScale = d3.scaleSequential(d3.interpolateBlues).domain([0, d3.max(data, d => d.amount)]);
    }
    svg = d3.select("#chart_svg_" + parentDiv).attr("width", width)
        .attr("height", height);

    const days_month = svg.append("g").attr("transform", "translate(30, " + (height / 2.3) + ")");
    days_month.append("g").attr("id", "days-" + parentDiv);
    days_month.append("g").attr("id", "months-" + parentDiv);

    d3.select("#months-" + parentDiv)
        .selectAll(".months-label")
        .data(data) // bind data to the selection
        .enter().append("text")
        .attr("x",0)
        .attr("y", - height/4)
        .attr("text-anchor", "left")
        .style("font-family", "Poppins, sans-serif")
        .style("font-size", "1.5rem")
        .text(function(d) {
        return "VenueId = " + d.venueId;
        })

    days = d3.select("#days-" + parentDiv)
        .selectAll(".day")
        .data(d3.timeDays(startDay, endDay))
        .enter().append("rect")
        .attr("class", "day")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", d => ((d3.timeYear(d).getFullYear() - startYear) * cellSize * 53 + d3.timeWeek.count(d3.timeYear(d), d) * cellSize) - 90)
        .attr("y", d => d.getDay() * cellSize)
        .datum(d3.timeFormat("%Y-%m-%d"))
        .style("fill", d => colorScale(data.find(e => e.date === d)?.amount ?? 0))
        .on("mouseover", function (d, i) { 
            var tooltip_text = "Date " + i
            if (getDateValue(data, i) != undefined) {
                tooltip_text += "<br/>Amount " + getDateValue(data, i);
            }
            tooltip.html(tooltip_text).style("visibility", "visible"); })
        .on("mousemove", function () { tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px"); })
        .on("mouseout", function () { tooltip.html(``).style("visibility", "hidden"); })

    months = d3.select("#months-" + parentDiv)
        .selectAll(".month")
        .data(d3.timeMonths(startDay, endDay))
        .enter().append("path")
        .attr("class", "month")
        .attr("d", monthPath);

    d3.select("#months-" + parentDiv)
        .selectAll(".month-label")
        .data(d3.timeMonths(startDay, endDay))
        .enter().append("text")
        .attr("class", "month-label")
        .attr("x", d => ((d3.timeYear(d).getFullYear() - startYear) * 52 + d3.timeWeek.count(d3.timeYear(d), d) + 0.5) * cellSize - 90)
        .attr("y", -5)
        .attr("text-anchor", "middle")
        .style("font-family", "Poppins, sans-serif")
        .text(formatMonth);

    d3.select("#days-" + parentDiv)
        .selectAll(".day-label")
        .data(daysList)
        .enter().append("text")
        .attr("class", "day-label")
        .attr("x", 2)
        .attr("y", d => (daysList.indexOf(d) + 0.5) * cellSize)
        .attr("text-anchor", "end")
        .attr("dy", ".35em")
        .style("font-family", "Poppins, sans-serif")
        .style("font-size", "0.9rem")
        .text(d => daysList[daysList.indexOf(d)]);
}

function monthPath(t0) {
    const t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0);
    const d0 = t0.getDay();
    const w0 = d3.timeWeek.count(d3.timeYear(t0), t0);
    const d1 = t1.getDay();
    const w1 = d3.timeWeek.count(d3.timeYear(t1), t1);
    return `M${w0 * cellSize},${d0 * cellSize}`
        + `H${(w0 + 1) * cellSize}`
        + `V${7 * cellSize}`
        + `H${w1 * cellSize}`
        + `V${(d1 + 1) * cellSize}`
        + `H${w1 * cellSize}`
        + `V${0}`
        + `H${w0 * cellSize}`
        + `Z`;
}

function addHeatmapFilters() {
    let filter_container = document.querySelector(".filter-container");
    let newInner = document.createElement("div");
    newInner.innerHTML = [
        '<select id="business-type">',
        '<option value="">Select Business Type</option>',
        '<option value="pubs">Pubs</option>',
        '<option value="restaurants">Restaurants</option>',
        '<option value="schools">Schools</option>',
        '</select>'
    ]
    filter_container.appendChild(newInner);
    let venueInner = document.createElement("div");
    venueInner.innerHTML = [
        '<select id="venue-id">',
        '<option value="">Select Venue ID</option>',
        '</select>'
    ]
    filter_container.appendChild(venueInner);
    heatmapFiltersFunctionality();
}

function addHeatmapLegends(){
    let legend_container = document.querySelector(".legend-container")
    const remove_legend = document.querySelectorAll(".legend-options-container");
    for (let i = 0; i < remove_legend.length; i++) {
        remove_legend[i].remove();
    }
}
