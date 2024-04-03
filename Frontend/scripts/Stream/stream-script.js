// import { get_chart_data } from "../util/get_data.js";

function createStreamGraph(parentDiv, isUpdate) {
    var margin = { top: 20, right: 30, bottom: 0, left: 30 };
    var streamSvg;
    var stream_div = d3.select("#" + parentDiv);

    if (parentDiv == "tempId" && isUpdate) {
        addStreamFilters()
        addStreamLegends()
    }

    var width = +stream_div.style("width").replace("px", "");
    var height = +stream_div.style("height").replace("px", "");
    streamSvg = d3.select("#chart_svg_" + parentDiv)
        .style("width", width + margin.left + margin.right + "px")
        .style("height", height + "px")
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // This is the time scale, look into changing it to scaleTime
    const xScale = d3.scaleTime().range([0, width - margin.left - margin.right]);

    // These are the ticks which appear on the graph showing time
    const ticks = streamSvg.append("g").attr("transform", `translate(0,${height * 0.8})`);

    const color = d3.scaleOrdinal().domain(['cost', 'wage', 'education', 'shelter', 'recreation', 'food']).range(['red', 'green', 'skyblue', 'blue', 'pink', 'yellow']);

    const yScale = d3.scaleLinear().range([height, 0]);

    if (isUpdate) {
        const dates = getCalendarDates();
        for (var elem of document.getElementsByClassName('streamRadio')) {
            elem.addEventListener("click", () => {
                let averageValue = document.querySelector('input[name="average_stream"]:checked').value;
                spinner_display("tempId")
                get_chart_data('stream', { average: averageValue, start_date: dates.start, end_date: dates.end }, updateStreamGraph);
            });
        }
        document.getElementById("detailed").addEventListener("click", () => {
            let averageValue = document.querySelector('input[name="average_stream"]:checked').value;
            spinner_display("tempId")
            get_chart_data('stream', { average: averageValue, start_date: dates.start, end_date: dates.end }, updateStreamGraph);
        });
    }
    streamSvg.on('mouseover', (d, i) => {
        const key = d.target.className.baseVal.split(" ")[1]
        tooltip.html(`${key}`)
            .style("background", "light-blue")
            .style("visibility", "visible")
            .style('x',);
    }).on("mousemove", function () { tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px"); })
        .on("mouseout", function () { tooltip.html(``).style("visibility", "hidden"); })
    const updateStreamGraph = (data) => {
        const records = data.data.data;
        let xDomain = d3.extent(records, d => { return Date.parse(d.timestamp); });
        xScale.domain([xDomain[0], xDomain[1]]);

        ticks.call(d3.axisBottom(xScale).tickSize(-height * .7)).select(".domain").remove();
        streamSvg.selectAll(".tick line").attr("stroke", "#b8b8b8");
        var keys = [];
        let detailedChecked = false;
        try {
            detailedChecked = document.getElementById('detailed').checked ? true : false;
        } catch (e) { }
        console.log(detailedChecked)
        if (detailedChecked) {
            keys = ['wage', 'education', 'shelter', 'recreation', 'food'];
        }
        else {
            keys = (['wage', 'cost']);
        }

        const dataStack = d3.stack().offset(d3.stackOffsetWiggle).keys(keys).order(d3.stackOrderNone)(records);

        var min = 0, max = 0;
        for (var d of dataStack) {
            for (var d1 of d) {
                min = Math.min(min, Math.min(d1[0], d1[1]));
                max = Math.max(max, Math.max(d1[0], d1[1]));
            }
        }
        try {
            min = document.getElementById('daily').checked ? min - 500 : min - 2000;
        } catch (e) {
            min -= 500
        }
        yScale.domain([min, max]);
        const area = d3.area()
            .x(d => xScale(Date.parse(d.data.timestamp)))
            .y0(d => yScale(d[0]))
            .y1(d => yScale(d[1]));



        // streamSvg.selectAll("path")
        //   .data(dataStack)
        //   .transition()
        //     .delay(1000)
        //     .duration(1500)
        //     .attr('fill', d=> color(d.key))
        //     .attr
        // streamSvg.selectAll('.myArea').data(dataStack).remove()
        streamSvg.selectAll('.myArea')
            .data(dataStack, d => d.key)
            .join(
                enter => {
                    enter.append('path')
                        .attr('class', d => `myArea ${d.key}`)
                        .style('fill', d => color(d.key))
                        .attr('opacity', 0)
                        .transition().duration(1000)
                        .attr('opacity', 1)
                        .attr('d', area);
                },
                update => {
                    update
                        .attr('opacity', 0)
                        .attr('d', area)
                        .transition()
                        .attr('opacity', 1)
                        .duration(1000)
                        .end();
                },
                exit => exit.transition().remove()
            );
    };
    spinner_hide_display("tempId");
    return updateStreamGraph;
}
function removeFilters() {
    const removeElements = document.querySelectorAll(".filter-container > *:not(h2)");
    removeElements.forEach((element) => {
        element.remove();
    });
}


function addStreamFilters() {
    // Add stream filters
    let filter_container = document.querySelector(".filter-container")
    const optionLength = 3;
    let innerHTML = [`<div class="option"><input type="radio" class="streamRadio" id="daily" name="average_stream" value="DAILY" checked><label for="daily">Daily Average</label><br></div>`,
        `<div class="option"><input type="radio" class="streamRadio" id="monthly" name="average_stream" value="MONTHLY"><label for="monthly">Monthly Average</label><br></div>`,
        `<div class="option"><input id="detailed" type="checkbox" /><label for='detailed'>Detailed View</label><br></div>`]
    for (let i = 0; i < optionLength; i++) {
        let newInner = document.createElement("div");
        newInner.setAttribute("class", "option");
        newInner.innerHTML = innerHTML[i]
        filter_container.appendChild(newInner)
    }

}

function addStreamLegends(){
    let legend_container = document.querySelector(".legend-container")
    const remove_legend = document.querySelectorAll(".legend-options-container");
    for (let i = 0; i < remove_legend.length; i++) {
        remove_legend[i].remove();
    }
    const optionLength = 6;

    let legend_items = [
      `cost`,
      `wage`,
      `education`,
      `shelter`,
      `recreation`,
      `food`
    ]
    
    legend_colors = ['red', 'green', 'skyblue', 'blue', 'pink', 'yellow']

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
