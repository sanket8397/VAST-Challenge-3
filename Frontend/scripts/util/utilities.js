var onFocus = null;
var venueId = null;
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

function wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = 0, //parseFloat(text.attr("dy")),
            tspan = text.text(null)
                .append("tspan")
                .attr("x", x)
                .attr("y", y)
                .attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                    .attr("x", x)
                    .attr("y", y)
                    .attr("dy", ++lineNumber * lineHeight + dy + "em")
                    .text(word);
            }
        }
    });
}

function removeChart(isUpdate = false) {
    d3.selectAll("#chart_svg_tempId > *")
        .transition()
        .duration(200)
        .style('opacity', 0)
    d3.selectAll("#chart_svg_tempId > *")
        .style('display', 'none')
        .remove();
    spinner_display("tempId")
    // remove filters
    if (!isUpdate) {
        removeFilters();
    }
}

function animateAndAddChart() {
    spinner_hide_display("tempId")
    d3.select("#chart_svg_tempId >   *")
        .style("opacity", 0)
        .transition()
        // .delay(500)
        .duration(200)
        .style("opacity", 1);
}

function getCalendarDates() {
    return {
        start: document.querySelector("#startDate").value,
        end: document.querySelector("#endDate").value
    }
}

d3.select("#linebar-sideview")
    .on("click", (e, _) => {
        plotLineBar();
    });

d3.select("#density-sideview")
    .on("click", () => {
        plotDensity()
    });


d3.select("#heatmap-sideview")
    .on("click", () => {
        plotHeatmap();
    });

d3.select("#circle-sideview")
    .on("click", () => {
        plotCircleBar();
    });

d3.select("#stream-sideview")
    .on("click", () => {
        plotStream();
    })

d3.select("#map-sideview")
    .on("click", () => {
        plotMap();
    });

flatpickr("#endDate", {
    onValueUpdate: () => { updateChartMain(); }
});

flatpickr("#startDate", {
    onValueUpdate: () => { updateChartMain(); }
});

function updateChartMain() {
    dates = getCalendarDates();

    // check if main is null
    if (onFocus === null) {
        return;
    }
    if (onFocus.length > 0) {
        // switch to slide 3:
        currentSlide = 3;
        for (const slide of slides) {
            slide.style.transform = `translateX(-${(slideWidth + 32) * currentSlide}px)`;
        }
        changeCharts();

        if (onFocus == "density") {
            plotDensity(true);
        }
        if (onFocus == "heatmap") {
            plotHeatmap();
        }
        if (onFocus == "stream") {
            plotStream();
        }
        if (onFocus == "map") {
            plotMap();
        }
        if (onFocus == "circle") {
            plotCircleBar();
        }
        if (onFocus == "linebar") {
            plotLineBar();
        }
    }
}

function plotMap(isUpdate = false) {
    removeChart(isUpdate);
    venueId = null;
    dates = getCalendarDates();
    get_map_data(data => {
        parentDiv = "map-sideview";
        draw_map(data, "tempId", isUpdate);
        animateAndAddChart();
    }, { start: dates.start, end: dates.end });
    currentSlide = 3;
    onFocus = "map";
    changeCharts();
}

function plotStream() {
    removeChart();
    dates = getCalendarDates();
    const update = (data) => {
        const stream = createStreamGraph("tempId", true);
        stream(data);
        animateAndAddChart();
    };
    get_chart_data('stream', { average: 'DAILY', start_date: dates.start, end_date: dates.end }, update);
    currentSlide = 3;
    onFocus = "stream";
    changeCharts();
}

function plotCircleBar() {
    removeChart();
    dates = getCalendarDates();
    get_circle_bar_data(data => {
        draw_circle_bar(data, "tempId");
        animateAndAddChart();
    }, { start: dates.start, end: dates.end });
    currentSlide = 3;
    onFocus = "circle";
    changeCharts();
}

function plotHeatmap(venueId = 1798, isUpdate = false) {
    removeChart(isUpdate);
    // spinner_display("tempId")
    dates = getCalendarDates();
    get_heatmap_data((data) => {
        draw_heat_map(data, "tempId", isUpdate);
        animateAndAddChart();
    }, {
        venueId: venueId,
        start: dates.start,
        end: dates.end
    });
    currentSlide = 3;
    onFocus = "heatmap";
    changeCharts();
}

function plotDensity(isUpdate = false) {
    removeChart(isUpdate);
    const dates = getCalendarDates()
    const req = { start_date: dates.start, end_date: dates.end }
    const update = (data) => {
        // spinner_hide_display(chart + "-sideview")
        const density = createDensityChart(data.data, "tempId", true);
        density(true)
        animateAndAddChart();
    }
    get_chart_data('densityPlot', req, update)
    currentSlide = 3;
    onFocus = "density"
    changeCharts();
}

function plotLineBar(numRec = 100,isUpdate = false) {
    removeChart(isUpdate)
    const dates = getCalendarDates()
    get_bar_line(data => {
        draw_bar_line(data, "tempId",isUpdate);
        animateAndAddChart();
    }, { numRecords: numRec, start: dates.start, end: dates.end });
    onFocus = "linebar"
    currentSlide = 3;
    changeCharts();
}

// Icon triggers:
icons = document.querySelectorAll(".icon")
for (const icon of icons) {
    const id = icon.id.split("-")[0];
    if (id == "density") {
        icon.addEventListener("click", () => plotDensity());
    }
    if (id == "heatmap") {
        icon.addEventListener("click", () => plotHeatmap());
    }
    if (id == "stream") {
        icon.addEventListener("click", () => plotStream());
    }
    if (id == "map") {
        icon.addEventListener("click", () => plotMap());
    }
    if (id == "circle") {
        icon.addEventListener("click", () => plotCircleBar());
    }
    if (id == "linebar") {
        icon.addEventListener("click", () => plotLineBar());
    }
}

function mapFiltersFunctionality() {
    // Map functionality
    var finance_map = document.getElementById("finance_map");
    var basic_map = document.getElementById("basic_map");
    var map_checkboxes = document.getElementById("map_checkboxes");
    const isUpdate = true;
    finance_map.addEventListener("change", function () {
        if (finance_map.checked) {
            map_checkboxes.style.display = "block";
        } else {
            map_checkboxes.style.display = "none";
        }
        plotMap(isUpdate);
        addMapLegends();
    });

    basic_map.addEventListener("change", function () {
        if (basic_map.checked) {
            map_checkboxes.style.display = "none";
        }
        plotMap(isUpdate);
        addMapLegends();
    });

    const map_checkboxes_list = document.querySelectorAll('.map-checkbox');

    function onCheckboxChange(event) {
        const checkbox = event.target;
        plotMap(isUpdate);
    }

    map_checkboxes_list.forEach((checkbox) => {
        checkbox.addEventListener('change', onCheckboxChange);
    });
}

function heatmapFiltersFunctionality() {
    var business = document.getElementById("business-type");
    var venue = document.getElementById("venue-id");
    business.addEventListener("change", function () {
        const pubs = [442, 443, 444, 892, 893, 894, 1342, 1343, 1344, 1798, 1799, 1800];
        const restaurants = [445, 446, 447, 448, 449, 895, 896, 897, 898, 899, 1345, 1346, 1347, 1348, 1349, 1801, 1802, 1803, 1804, 1805];
        const schools = [0, 450, 900, 1350];
        var venues = document.getElementById("venue-id");
        venues.options.length = 0;
        if (business.value == "pubs") {
            for (let i = 0; i < pubs.length; i++) {
                var option = document.createElement("option");
                option.text = pubs[i];
                venues.add(option);
            }
        } else if (business.value == "restaurants") {
            for (let i = 0; i < restaurants.length; i++) {
                var option = document.createElement("option");
                option.text = restaurants[i];
                venues.add(option);
            }
        } else if (business.value == "schools") {
            for (let i = 0; i < schools.length; i++) {
                var option = document.createElement("option");
                option.text = schools[i];
                venues.add(option);
            }
        }
    });
    venue.addEventListener("change", function () {
        plotHeatmap(venue.value, true);
    });

}