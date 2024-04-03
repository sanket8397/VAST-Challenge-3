// import { get_map_data } from "../util/get_data.js";

var last_selected_path, last_selected_area;

const venueBuildingMap = [
 {
   "venueId": 0,
   "buildingId": 662
 },
 {
   "venueId": 450,
   "buildingId": 943
 },
 {
   "venueId": 900,
   "buildingId": 262
 },
 {
   "venueId": 1350,
   "buildingId": 123
 },
 {
   "venueId": 442,
   "buildingId": 556
 },
 {
   "venueId": 443,
   "buildingId": 29
 },
 {
   "venueId": 444,
   "buildingId": 1012
 },
 {
   "venueId": 892,
   "buildingId": 502
 },
 {
   "venueId": 893,
   "buildingId": 164
 },
 {
   "venueId": 894,
   "buildingId": 238
 },
 {
   "venueId": 1342,
   "buildingId": 429
 },
 {
   "venueId": 1343,
   "buildingId": 489
 },
 {
   "venueId": 1344,
   "buildingId": 585
 },
 {
   "venueId": 1798,
   "buildingId": 953
 },
 {
   "venueId": 1799,
   "buildingId": 234
 },
 {
   "venueId": 1800,
   "buildingId": 627
 },
 {
   "venueId": 445,
   "buildingId": 304
 },
 {
   "venueId": 446,
   "buildingId": 308
 },
 {
   "venueId": 447,
   "buildingId": 58
 },
 {
   "venueId": 448,
   "buildingId": 964
 },
 {
   "venueId": 449,
   "buildingId": 181
 },
 {
   "venueId": 895,
   "buildingId": 164
 },
 {
   "venueId": 896,
   "buildingId": 619
 },
 {
   "venueId": 897,
   "buildingId": 875
 },
 {
   "venueId": 898,
   "buildingId": 917
 },
 {
   "venueId": 899,
   "buildingId": 86
 },
 {
   "venueId": 1345,
   "buildingId": 991
 },
 {
   "venueId": 1346,
   "buildingId": 27
 },
 {
   "venueId": 1347,
   "buildingId": 679
 },
 {
   "venueId": 1348,
   "buildingId": 124
 },
 {
   "venueId": 1349,
   "buildingId": 888
 },
 {
   "venueId": 1801,
   "buildingId": 160
 },
 {
   "venueId": 1802,
   "buildingId": 714
 },
 {
   "venueId": 1803,
   "buildingId": 213
 },
 {
   "venueId": 1804,
   "buildingId": 101
 },
 {
   "venueId": 1805,
   "buildingId": 285
 }
]
function draw_map(buildingPolygons, parentDiv, isUpdate = false) {
  var mapExtent = { minX: -5000, minY: -200, maxX: 2800, maxY: 8000 };
  var viewExtent = { minX: -5000, minY: -400, maxX: 3000, maxY: 8200 };

  if (parentDiv == "tempId" && !isUpdate) {
    addMapFilters();
    addMapLegends();
  }

  if (venueId != null) {
    show_location(venueId);
  }

  var building_types = ["Residental", "Commercial", "School"];
  var buidling_colors = ["green", "pink", "gold"];

  var building_color = d3
    .scaleOrdinal()
    .domain(building_types)
    .range(buidling_colors);

  // var business_types = ["Pub", "Restaurant", "School", "NotDefined"];
  // var business_colors = ["blue", "red", "gold", "white"];

  var buildings_color_map = { "Pub": "blue", "Restaurant": "red", "School": "gold", "NotDefined": "white" };

  var checkboxes = document.querySelectorAll("#map_checkboxes input[type=checkbox]");
  let business_types = ["NotDefined"];
  checkboxes.forEach(function (checkbox) {
    if (checkbox.checked) {
      business_types.push(checkbox.value);
    }
  });
  var business_colors = [];
  for (var i in business_types) {
    business_colors.push(buildings_color_map[business_types[i]]);
  }



  var business_color = d3
    .scaleOrdinal()
    .domain(business_types)
    .range(business_colors);

  var map_div = d3.select("#" + parentDiv);
  var width = +map_div.style("width").replace("px", "");
  var height = +map_div.style("height").replace("px", "");

  var max_income = get_max_income(buildingPolygons.features);
  var min_income = get_min_income(buildingPolygons.features);

  var opacity_scale = d3.scaleLinear().domain([min_income, max_income]).range([0.2, 0.8]);

  var map_options = document.getElementsByName("map_options");
  var map_type;
  for (let i = 0; i < map_options.length; i++) {
    if (map_options[i].checked) {
      map_type = map_options[i].value;
      break;
    }
  }

  var projection = d3
    .geoIdentity()
    .reflectY(true)
    .fitSize([width, height], buildingPolygons);

  // Create a path generator for the polygons
  var path = d3.geoPath().projection(projection);

  var svg = d3
    .select("#chart_svg_" + parentDiv)
    .style("width", width + "px")
    .style("height", height + "px");

  svg.selectAll("*").remove();
  // Add the polygons to the map
  svg
    .selectAll("path")
    .data(buildingPolygons.features)
    .enter()
    .append("path")
    .attr("class","myMapOfYugoslavia")
    .attr("id", function (d) {
      return +d.properties.id;
    })
    .attr("d", path)
    .attr("fill", function (d) {
      var building_type = d.properties.type;
      var color;
      // if (building_type == 'Residental' | building_type == 'School'){
      //     color = building_color(building_type);
      // }
      // else{
      //     color = business_color(d.properties['business_type'])
      // }
      if (map_type == 'basic_map') {
        color = building_color(building_type);
      }
      if (map_type == 'finance_map') {
        if (business_types.includes(d.properties['business_type']))
          color = business_color(d.properties['business_type']);
        else
          color = "white";
      }
      return color;
    })
    .attr("stroke", "black")
    .attr("stroke-width", 0.2)
    .attr("fill-opacity", function (d) {
      if (map_type == 'basic_map') {
        return 0.2;
      }
      if (map_type == 'finance_map') {
        if (d.properties['income'] > 0)
          return opacity_scale(d.properties['income']);
      }
      return 0.2;
    })
    .on("mouseover", function (d, i) {
      tooltip_string = "Building ID: " + (i.properties.id + " ").split(".")[0];
      var tooltip_income = i.properties.income;
      if (tooltip_income != 0 && tooltip_income != undefined)
        tooltip_string = tooltip_string + "<br>" + "Income: " + (tooltip_income + " ").split(".")[0]; 
      tooltip.html(tooltip_string)
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
    }).on("dblclick",(d,i)=>{
      tooltip.html(``).style("visibility", "hidden");
      const venueId = venueBuildingMap.find(d => d.buildingId == i.properties.id).venueId
      

      plotHeatmap(venueId )
  });
  // .on("click", function (i, d) {
  //   d3.select(this).attr("fill", "gray");
  // });

  var zoom = d3
    .zoom()
    .scaleExtent([1, 8])
    .on("zoom", function (event) {
      svg.selectAll(".myMapOfYugoslavia").attr("transform", event.transform);
    });

  svg.call(zoom);

  svg.selectAll("path").on("click", (event, d) => {

    var path_id = +d.properties.id;

    var selected_path = document.getElementById('' + path_id);
    d3.select(selected_path).attr("fill-opacity", 1);
    d3.select(last_selected_path).style("fill", function (d) {
      var building_type = get_area_type(buildingPolygons.features, last_selected_area);
      var color;
      if (map_type == 'basic_map') {
        color = building_color(building_type);
      }
      if (map_type == 'finance_map') {
        color = business_color(get_business_type(buildingPolygons.features, last_selected_area))
      }
      if (venueId != null) {
        color = business_color(get_business_type(buildingPolygons.features, last_selected_area));
      }
      return color;
    })
      .attr("fill-opacity", function (d) {
        var income = get_income(buildingPolygons.features, last_selected_area)
        if (income > 0)
          return opacity_scale(income);
        return 0.2;
      });
    last_selected_path = selected_path;
    last_selected_area = path_id;

    width = width;
    height = height;
    const bounds = event.target.getBBox();
    const dx = bounds.width;
    const dy = bounds.height;
    const x = bounds.x + dx / 2;
    const y = bounds.y + dy / 2;
    const scale = Math.max(
      1,
      Math.min(8, 0.9 / Math.max(dx / width, dy / height))
    );
    const translate = [width / 2 - scale * x, height / 2 - scale * y];
    svg
      .transition()
      .duration(500)
      .call(
        zoom.transform,
        d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
      );
  });

}

function get_max_income(data) {
  var max_income = d3.max(data, function (d) {
    return +d.properties.income;
  })
  return max_income;
}

function get_min_income(data) {
  var min_income = d3.min(data, function (d) {
    if (+d.properties.income == 0)
      return Number.MAX_SAFE_INTEGER;
    return +d.properties.income;
  })
  return min_income;
}


function get_business_type(data, areaId) {
  var fd = data.filter(area => +area.properties['id'] == areaId);
  return fd[0].properties['business_type'];
}

function get_area_type(data, areaId) {
  var fd = data.filter(area => +area.properties['id'] == areaId);
  return fd[0].properties['type'];
}

function get_income(data, areaId) {
  var fd = data.filter(area => +area.properties['id'] == areaId);
  return +fd[0].properties['income'];
}

function show_location(location_id = 442) {
  get_building(data => {
    building_id = data;
    var a = document.getElementById('' + building_id);
    const clickEvent = new Event("click");
    a.dispatchEvent(clickEvent);
  }, location_id);

}

function addMapFilters() {
  // Add map filters
  let filter_container = document.querySelector(".filter-container")
  const optionLength = 2;
  let innerHTML = [
    `<input type="radio" name="map_options" value="basic_map" id="basic_map" checked> Basic Map`,
    `<input type="radio" name="map_options" value="finance_map" id="finance_map"> Finance Map`
  ]


  for (let i = 0; i < optionLength; i++) {
    const label = document.createElement("label")
    label.innerHTML = innerHTML[i]
    filter_container.appendChild(label)
  }
  let newInner = document.createElement("div");
  newInner.setAttribute("id", "map_checkboxes");
  newInner.innerHTML = `<label>
    <input class="map-checkbox" type="checkbox" name="Pubs_Map" value="Pub" checked> Pubs
    </label>
    <label>
    <input class="map-checkbox" type="checkbox" name="Restaurants_Map" value="Restaurant" checked> Restaurants
    </label>
    <label>
    <input class="map-checkbox" type="checkbox" name="Schools_Map" value="School" checked> Schools
    </label>`
  filter_container.appendChild(newInner)
  mapFiltersFunctionality();
}

function addMapLegends(){
  let legend_container = document.querySelector(".legend-container")

  const remove_legend = document.querySelectorAll(".legend-options-container");
  for (let i = 0; i < remove_legend.length; i++) {
    remove_legend[i].remove();
  }

  var map_options = document.getElementsByName("map_options");
  var map_type;
  for (let i = 0; i < map_options.length; i++) {
    if (map_options[i].checked) {
      map_type = map_options[i].value;
      break;
    }
  }
  const optionLength = 3;
  let legend_items = [
    `Residental`,
    `Commercial`,
    `School`
  ]
  let legend_colors = ["green", "pink", "gold"];
 // "Pub": "blue", "Restaurant": "red", "School": "gold"
  if (map_type == 'finance_map') {
    legend_items = [
      `Pub`,
      `Restaurant`,
      `School`
    ]
  }

  if (map_type == 'finance_map') {
    legend_colors = ["blue", "red", "gold"];
  }

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
