// JS for loading and updating with the dates
document.addEventListener("DOMContentLoaded", function () {
    changeCharts();
    // plotDensity();
    var isMainChart = (chartVal) => {
        if (chartVal) {
            console.log("Chart added to main chart: ", chartVal)
            // trigger change in order with this
        }
    };
    observe_svg(isMainChart);
});

function spinner_display(parentDiv) {
    try {
        const spinner = document.querySelector(`#${parentDiv} > .loader`)
        spinner.classList.add("display");
        setTimeout(() => {
            spinner.classList.remove("display");
        }, 2000);
    }
    catch (e) {
    };
}

function spinner_hide_display(parentDiv) {
    try {
        const spinner = document.querySelector(`#${parentDiv} .loader`)
        spinner.classList.remove("display");
    }
    catch (e) {
    };
}

function observe_svg(isMainChart) {
    // Observe tempId for changes
    const svg = document.getElementById("chart_svg_tempId");
    const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                isMainChart(true);
                return;
            }
        }
        isMainChart(false)
        return
    });
    const config = { childList: true, subtree: true };
    observer.observe(svg, config);
    isMainChart(false);
    return;
}

function loadSideViewCharts(charts) {
    // Load all charts of sideview

    charts.map((chart) => {
        if (chart == "linebar") {
            try {
                spinner_display(chart + "-sideview")
                get_bar_line(data => {
                    spinner_hide_display(chart + "-sideview")
                    draw_bar_line(data, chart + "-sideview");
                });
            }
            catch (e) { }
        }
        if (chart == "density") {
            try {
                spinner_display(chart + "-sideview")
                const update = (data) => {
                    spinner_hide_display(chart + "-sideview")
                    const density = createDensityChart(data.data, chart + "-sideview", false);
                    density(false)
                }
                get_chart_data('densityPlot', {}, update)
            } catch (e) { }
        }
        if (chart == "circle") {
            try {
                spinner_display(chart + "-sideview")
                get_circle_bar_data(data => {
                    spinner_hide_display(chart + "-sideview")
                    draw_circle_bar(data, chart + "-sideview");
                });
            } catch (e) { }

        }
        if (chart == "stream") {
            try {
                spinner_display(chart + "-sideview")
                const update = (data) => {
                    spinner_hide_display(chart + "-sideview")
                    const stream = createStreamGraph(chart + "-sideview", false);
                    stream(data)
                    d3.selectAll("#stream-sideview path")
                        .attr("transform", "translate(-400, -500) scale(5)");
                }
                get_chart_data('stream', { average: 'DAILY' }, update)
            } catch (e) { }

        }

        if (chart == "heatmap") {
            try {
                spinner_display(chart + "-sideview")
                get_heatmap_data(data => {
                    spinner_hide_display(chart + "-sideview");
                    draw_heat_map(data, "heatmap-sideview");
                    d3.selectAll("#heatmap-sideview rect")
                        .attr("transform", "translate(0, -50) scale(5)");
                });
            } catch (e) { }

        }
        if (chart == "map") {
            try {
                spinner_display(chart + "-sideview")
                get_map_data(data => {
                    spinner_hide_display(chart + "-sideview");
                    draw_map(data, "map-sideview");
                });
            } catch (e) { }

        }
    })
}

// Give order to the sideview
function changeCharts() {

    if (currentSlide == 0) {
        // Personal -> Density, Stream, Line bar charts
        charts = ["linebar", "density", "circle", "stream", "map", "heatmap"]
        d3.select("#density-sideview").classed("remove-display", false).style("order", 0);
        d3.select("#stream-sideview").classed("remove-display", false).style("order", 1);
        d3.select("#linebar-sideview").classed("remove-display", false).style("order", 2);
        d3.select("#circle-sideview").classed("remove-display", true);
        d3.select("#heatmap-sideview").classed("remove-display", true);
        d3.select("#map-sideview").classed("remove-display", true);
        loadSideViewCharts(["density", "stream", "linebar"])
    }
    if (currentSlide == 1) {
        // Commercial -> Circular bar, heatmap
        d3.select("#density-sideview").classed("remove-display", true).style("order", 0);
        d3.select("#stream-sideview").classed("remove-display", true).style("order", 1);
        d3.select("#linebar-sideview").classed("remove-display", true).style("order", 2);
        d3.select("#circle-sideview").classed("remove-display", false).style("order", 3);
        d3.select("#heatmap-sideview").classed("remove-display", false).style("order", 4);
        d3.select("#map-sideview").classed("remove-display", true);
        loadSideViewCharts(["circle", "heatmap"])
    }
    if (currentSlide == 2) {
        // Map -> 
        d3.select("#density-sideview").classed("remove-display", true).style("order", 0);
        d3.select("#stream-sideview").classed("remove-display", true).style("order", 1);
        d3.select("#linebar-sideview").classed("remove-display", true).style("order", 2);
        d3.select("#circle-sideview").classed("remove-display", true).style("order", 3);
        d3.select("#map-sideview").classed("remove-display", false).style("order", 4);
        d3.select("#heatmap-sideview").classed("remove-display", true).style("order", 5);
        loadSideViewCharts(["map"])
    }
    if (currentSlide == 3) {
        // Mixed -- based on tempId chart (onFocus variable)
        for (const slide of slides) {
            slide.style.transform = `translateX(-${(slideWidth * 26) * currentSlide}px)`;
        }
        // reset all then set order
        d3.select("#density-sideview").classed("remove-display", false).style("order", 0);
        d3.select("#stream-sideview").classed("remove-display", false).style("order", 1);
        d3.select("#circle-sideview").classed("remove-display", false).style("order", 2);
        d3.select("#heatmap-sideview").classed("remove-display", false).style("order", 3);
        d3.select("#map-sideview").classed("remove-display", false).style("order", 4);
        d3.select("#linebar-sideview").classed("remove-display", false).style("order", 5);
        if (onFocus == "stream") {
            // Plot chart then change order
            loadSideViewCharts(["density", "stream", "circle", "heatmap", "map"])
            // show map on sideview first and then rest
            d3.select("#stream-sideview").classed("remove-display", false).style("order", 5);
            d3.select("#map-sideview").classed("remove-display", false).style("order", 1);
            d3.select("#linebar-sideview").classed("remove-display", false).style("order", 2);
            d3.select("#density-sideview").classed("remove-display", false).style("order", 3);
            d3.select("#circle-sideview").classed("remove-display", false).style("order", 4);
            d3.select("#heatmap-sideview").classed("remove-display", false).style("order", 0);
        }
        if (onFocus == "density") {
            loadSideViewCharts(["density", "stream", "circle", "map"])
            // show map on sideview first and then rest
            d3.select("#map-sideview").classed("remove-display", false).style("order", 1);
            d3.select("#stream-sideview").classed("remove-display", false).style("order", 2);
            d3.select("#linebar-sideview").classed("remove-display", false).style("order", 3);
            d3.select("#density-sideview").classed("remove-display", false).style("order", 5);
            d3.select("#circle-sideview").classed("remove-display", false).style("order", 4);
            d3.select("#heatmap-sideview").classed("remove-display", false).style("order", 3);
        }
        if (onFocus == "heatmap") {
            loadSideViewCharts(["density", "stream", "circle", "map"])
            // show map on sideview first and then rest
            d3.select("#map-sideview").classed("remove-display", false).style("order", 0);
            d3.select("#stream-sideview").classed("remove-display", false).style("order", 3);
            d3.select("#linebar-sideview").classed("remove-display", false).style("order", 2);
            d3.select("#density-sideview").classed("remove-display", false).style("order", 4);
            d3.select("#circle-sideview").classed("remove-display", false).style("order", 1);
            d3.select("#heatmap-sideview").classed("remove-display", false).style("order", 5);
        }
        if (onFocus == "map") {
            loadSideViewCharts(["density", "stream", "circle", "map"])
            // show map on sideview first and then rest
            d3.select("#map-sideview").classed("remove-display", false).style("order", 0);
            d3.select("#stream-sideview").classed("remove-display", false).style("order", 1);
            d3.select("#linebar-sideview").classed("remove-display", false).style("order", 2);
            d3.select("#density-sideview").classed("remove-display", false).style("order", 2);
            d3.select("#circle-sideview").classed("remove-display", false).style("order", 3);
            d3.select("#heatmap-sideview").classed("remove-display", false).style("order", 4);
        }
        if (onFocus == "circle") {
            loadSideViewCharts(["density", "stream", "circle", "map"])
            // show map on sideview first and then rest
            d3.select("#map-sideview").classed("remove-display", false).style("order", 5);
            d3.select("#stream-sideview").classed("remove-display", false).style("order", 2);
            d3.select("#linebar-sideview").classed("remove-display", false).style("order", 1);
            d3.select("#density-sideview").classed("remove-display", false).style("order", 0);
            d3.select("#circle-sideview").classed("remove-display", false).style("order", 3);
            d3.select("#heatmap-sideview").classed("remove-display", false).style("order", 4);
        }
        if (onFocus == "linebar") {
            loadSideViewCharts(["density", "stream", "circle", "map"])
            // show map on sideview first and then rest
            d3.select("#map-sideview").classed("remove-display", false).style("order", 3);
            d3.select("#stream-sideview").classed("remove-display", false).style("order", 1);
            d3.select("#linebar-sideview").classed("remove-display", false).style("order", 5);
            d3.select("#density-sideview").classed("remove-display", false).style("order", 2);
            d3.select("#circle-sideview").classed("remove-display", false).style("order", 0);
            d3.select("#heatmap-sideview").classed("remove-display", false).style("order", 4);
        }

    }
}
