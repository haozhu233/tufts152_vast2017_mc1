var bird_path = d3.select("#birdPath");
var map_svg = d3.select("#parkMap");
var car_type_svg = d3.select("#car-type-dist");
var tsne_svg = d3.select("#tsne");
var tsne_selection = d3.select("#tsneSelection");
var tsne_intro = d3.select("#tsneIntro");

//  Bird =====================================================    
let showBird = () => {
  bird_path
  .attr('d', bird_data)
  .transition()
  .duration(1000)
  .attr("stroke-dasharray", "100,100")
  .attr("stroke-opacity", "1.0");
  d3.select("#idx-title")
  .attr("style", "cursor: pointer; background-color: black;")
  d3.select("#idx-intro")
  .attr("style", "cursor: pointer; background-color: white;")
};

let hideBird = () => {
  bird_path
  .transition()
  .duration(400)
  .attr("stroke-dasharray", "2500,2500")
  .attr("stroke-opacity", "0.0");
  //       Entirely remove d if performance is an issue
  //       setTimeout(() => {bird_path.attr('d', '')}, 600);
};

//  Map ===============================================================  
var map_node_color_scale = d3
.scale.ordinal()
.domain(["0", "1", "2", "3", "4", "5"])
.range(["#264653","#2a9d8f","#8ab17d","#e9c46a","#f4a261","#e76f51"]);

let showMap = (duration = 600) => {
  if (map_svg.select("#mapPaths").empty()) {
    map_svg
    .append("g")
    .attr("id", "mapPaths")
    .attr("stroke-opacity", "0.0")
    .selectAll('path')
    .data(map_path_data)
    .enter()
    .append("path")
    .attr("d", (d) => d.path)
    .attr("id", (d) => d.edge)
    .attr("stroke-width", "2")
    .attr("stroke", "#CDCDCD")
    .attr("fill", "transparent");
  };
  map_svg.select("#mapPaths")
  .transition()
  .ease("cubic")
  .duration(duration)
  .attr("stroke-opacity", "1.0");
  d3.select("#idx-title")
  .attr("style", "cursor: pointer; background-color: white;")
  d3.select("#idx-pattern")
  .attr("style", "cursor: pointer; background-color: white;")
  d3.select("#idx-intro")
  .attr("style", "cursor: pointer; background-color: black;")
};

let hideMap = () => {
  map_svg.select("#mapPaths")
  .transition()
  .duration(400)
  .attr("stroke-opacity", "0");
};

let showMapNodes = (duration = 600) => {
  if (map_svg.select("#mapNodes").empty()) {
    map_svg
    .append("g")
    .attr("id", "mapNodes")
    .selectAll('circle')
    .data(map_node_data)
    .enter()
    .append("circle")
    .attr("cx", (d) => d.cx)
    .attr("cy", (d) => d.cy)
    .attr("id", (d) => d.node)
    .attr("r", "4")
    .attr("fill", (d) => map_node_color_scale(d.t))
    .attr("fill-opacity", "0")
    .attr("class", (d) => "mapNodeType" + d.t)
    .on("mouseover", handleNodeMouseover)
    .on("mouseout", handleNodeMouseout);
    map_legend = map_svg
    .append("g")
    .attr("id", "mapLegend")
    .attr("fill-opacity", "0.0")
    .attr("opacity", "0.0")
    .selectAll('circle')
    .data(gate_legend_dt)
    .enter();
    map_legend
    .append("circle")
    .attr("cx", "500")
    .attr("cy", (d) => d.key * 12 + 10)
    .attr("r", "4")
    .attr("fill", (d) => d.color)
    .on("mouseover", handleLegendMouseover)
    .on("mouseout", handleLegendMouseout);
    map_legend
    .append("text")
    .attr("x", "510")
    .attr("y", (d) => d.key * 12 + 14)
    .text((d) => d.gate_type)
    .on("mouseover", handleLegendMouseover)
    .on("mouseout", handleLegendMouseout);
  };
  map_svg.select("#mapNodes")
  .selectAll("circle")
  .transition()
  .ease("cubic")
  .duration(duration)
  .attr("fill-opacity", "1.0");
  map_svg.select("#mapLegend")
  .transition()
  .ease("cubic")
  .duration(duration)
  .attr("opacity", "1.0")
  .attr("fill-opacity", "1.0");
};

let handleNodeMouseover = (d) => {
  map_svg.append("text")
  .attr("x", parseInt(d.cx) + 8)
  .attr("y", parseInt(d.cy) + 3)
  .attr("id", "mapNodeMouse-" + d.node)
  .text(d.node);
}
let handleNodeMouseout = (d) => {
  map_svg.select("#mapNodeMouse-" + d.node).remove();
};

let handleLegendMouseover = (d) => {
  map_svg.select("#mapNodes")
  .selectAll(".mapNodeType" + d.key)
  .transition()
  .duration(200)
  .attr("r", "10")
  .attr("fill-opacity", "0.7");
}
let handleLegendMouseout = (d) => {
  map_svg.select("#mapNodes")
  .selectAll(".mapNodeType" + d.key)
  .transition()
  .duration(100)
  .attr("r", "4")
  .attr("fill-opacity", "1.0");
};

let hideMapNodes = () => {
  map_svg.select("#mapNodes")
  .selectAll("circle")
  .transition()
  .duration(400)
  .attr("fill-opacity", "0.0");
  map_svg.select("#mapLegend")
  .transition()
  .duration(400)
  .attr("opacity", "0.0")
  .attr("fill-opacity", "0.0");
};



//  Car type bar plot ==========================================
var car_type_x = d3.scale.linear()
  .rangeRound([0, 460])
  .domain([0, 1]);
var car_type_z = d3.scale.ordinal()
  .range(viridis_color_7)
  .domain(["1", "2", "3", "4", "5", "6", "2P"]);
let showCarCounts = () => {
  car_type_svg_g = car_type_svg
  .selectAll("bar")
  .data(vehicle_counts)
  .enter()
  car_type_svg_g
    .append("rect")
    .attr("x", (d) => car_type_x(d.x))
    .attr("y", "15")
    .attr("width", (d) => car_type_x(d.p))
    .attr("height", "25")
    .attr("fill", (d) => car_type_z(d.key))
    .attr("stroke-width", "1")
    .attr("stroke", "white")
    .on("mouseover", (d) => {
      car_type_svg.append("text")
        .attr("x", car_type_x(d.x + d.p / 2 - 0.06))
        .attr("y", "10")
        .attr("id", "cartype-" + d.key)
        .text(d.n + " (" + d.p * 100 + "%)");
    })
    .on("mouseout", (d) => {
      car_type_svg.select("#cartype-" + d.key).remove();
    });
  car_type_svg_g
  .append("text")
  .attr("x", (d, i) => car_type_x(i/7 + 0.017))
  .attr("y", "55")
  .text((d) => d.lbl)
  .attr("stroke", (d) => car_type_z(d.key));
  car_type_svg_g
  .append("rect")
  .attr("x", (d, i) => car_type_x(i/7))
  .attr("y", "49")
  .attr("width", "5")
  .attr("height", "5")
  .attr("fill", (d) => car_type_z(d.key));
}

// t-SNE plot =======================================
var tsne_x = d3.scale.linear()
  .rangeRound([0, 600])
  .domain([-85, 85]);
var tsne_y = d3.scale.linear()
  .rangeRound([0, 600])
  .domain([-85, 85]);
var tsne_z = d3.scale.ordinal()
  .range(viridis_color_7)
  .domain(["1", "2", "3", "4", "5", "6", "2P"]);

let showTSNE = () => {
  if (tsne_svg.attr("width") == "0") {
    tsne_svg
    .attr("width", "500")
    .attr("height", "500");
  }
  if (tsne_svg.select("#tsneDots").empty()) {
    tsne_svg.append("g")
      .attr("id", "tsneDots")
      .attr("fill-opacity", "0")
      .selectAll("circle").data(per_car).enter()
      .append("circle")
      .attr("cx", (d) => tsne_x(d.x))
      .attr("cy", (d) => tsne_y(d.y))
      .attr("r", "3")
      .attr("fill", (d) => tsne_z(d.tp))
      .attr("style", "cursor: pointer;")
      .on("click", handleTsneClick);
    tsne_legend = tsne_svg
    .append("g")
    .attr("id", "tsneLegend")
    .attr("fill-opacity", "0.0")
    .attr("opacity", "0.0")
    .selectAll('circle')
    .data(vehicle_counts)
    .enter();
    tsne_legend
    .append("circle")
    .attr("cx", "500")
    .attr("cy", (d, i) => i * 12 + 10)
    .attr("r", "4")
    .attr("fill", (d) => tsne_z(d.key));
    tsne_legend
    .append("text")
    .attr("x", "510")
    .attr("y", (d, i) => i * 12 + 14)
    .text((d) => d.lbl);

    // tsne_intro
    //   .html("Click on any points on the t-SNE plot to begin exploration! <br>Double click to exit.")
    //   .attr("class", "intro")
    //   .attr("style", "opacity: 0.0; bottom:-100px;")
    //   .transition()
    //   .duration(800)
    //   .attr("style", "opacity: 0.4; bottom:0px;");
    // tsne_intro.on("click", () => {tsne_intro.remove()})
  }
  tsne_svg.select("#tsneDots")
    .transition()
    .duration(800)
    .attr("fill-opacity", "0.5");
  tsne_svg.select("#tsneLegend")
  .transition()
  .duration(800)
  .attr("opacity", "1.0")
  .attr("fill-opacity", "1.0")
  d3.select("#idx-pattern")
  .attr("style", "cursor: pointer; background-color: black;")
  d3.select("#idx-intro")
  .attr("style", "cursor: pointer; background-color: white;")
}

let hideTSNE = () => {
  tsne_svg.select("#tsneDots")
    .transition()
    .duration(400)
    .attr("fill-opacity", "0.0");
  tsne_svg.select("#tsneLegend")
  .transition()
  .duration(400)
  .attr("opacity", "0.0")
  .attr("fill-opacity", "0.0");

  setTimeout(() => {
    tsne_svg.attr("width", "0").attr("height", "0");
  }, 400)
}

const tsne_modal_table_header = [
  '# of Visits', "Total Visit Duration", "# of Camping Zones", 
  "# of General Gates", "# of Gates", "# of Ranger Stops", "# of Ranger Base"
]

let handleTsneClick = (d) => {

  var tsne_modal = tsne_selection
    .append("div")
    .attr("id", "tsneModalSurrounding")
    .attr("class", "modal")
    .on("dblclick", () => {
      tsne_selection.select("#tsneModalSurrounding").remove();
    })
    .append("div")
    .attr("id", "")
    .attr("class", "modal-content")
    .on("click", () => {});

  tsne_modal
    .append("span")
    .attr("class", "modal-close")
    .html("&times;")
    .on("click", () => {
      tsne_selection.select("#tsneModalSurrounding").remove();
    })


  // Clear content
  // tsne_selection.html("")

  var highlighted_path = [];

  // Generate summary info and table
  tsne_modal.append("div")
  .html("<strong>Car ID: </strong>" + d.id);
  tsne_modal.append("div")
  .html("<strong>Car Type: </strong>" + vehicle_type_dict[d.tp]);
  tsne_modal_table = tsne_modal.append("table").attr("class", "lightable-paper");
  tsne_tbl_thead = tsne_modal_table
  .append("thead")
  .append("tr");
  tsne_tbl_tbody = tsne_modal_table
  .append("tbody")
  .append("tr");
  for (i in tsne_modal_table_header) {
    tsne_tbl_thead.append("th").html(tsne_modal_table_header[i]);
  }
  tsne_tbl_tbody.append("td").html(d.v);
  tsne_tbl_tbody.append("td").html(d.d);
  tsne_tbl_tbody.append("td").html(d.c);
  tsne_tbl_tbody.append("td").html(d.gg);
  tsne_tbl_tbody.append("td").html(d.g);
  tsne_tbl_tbody.append("td").html(d.rs);
  tsne_tbl_tbody.append("td").html(d.rb);

  // Visit selection
  tsne_visit_dropdown = tsne_modal
  .append("div")
  .attr("class", "tsneVisitDropdown")
  .on('change', () => {
    tsne_modal.select("#tsneMapTrace").html("");
    visit_path = dt_dict[d.id + '-' + tsne_modal.select('select').property('value')];
    for (i in [...Array(visit_path.length - 1).keys()]) {
      // path_name = gate_lbl[visit_path[i]["g"]] + "_" + gate_lbl[visit_path[parseInt(i)+1]["g"]];
      path_name = visit_path[i]["g"] + "-" + visit_path[parseInt(i)+1]["g"];
      path_name = path_dict[path_name];
      tsne_map_trace
      .append("path")
      .attr("d", map_path_dict[path_name])
      .attr("id", "p" + path_name)
      .attr("stroke-width", "3")
      .attr("stroke-opacity", "0.5")
      .attr("stroke", inferno_color_256[Math.floor(parseInt(i) / (visit_path.length - 1) * 256)])
      .attr("fill", "transparent")
      .attr("transform", "translate(" + (Math.random() * 6 - 3) + "," + (Math.random() * 6 - 3) + ")");
    }

    tsne_modal.select("#tsnePathTable").remove();

    tsne_path_table = tsne_modal
    .append("table")
    .attr("id", "tsnePathTable")
    .attr("class", "lightable-paper lightable-hover")
    .attr("style", "margin-top: -300pt; margin-left: 330pt;");

    tsne_path_table_thead_tr = tsne_path_table.append("thead").append("tr");
    tsne_path_table_thead_tr.append("th").html("Timestamp");
    tsne_path_table_thead_tr.append("th").html("Stop");
    tsne_path_table_tbody = tsne_path_table.append("tbody");

    tsne_path_table_tbody_tr = tsne_path_table_tbody
      .selectAll("tr")
      .data(visit_path)
      .enter()
      .append("tr")
      .on("mouseover", handleTableMapHover)
      .on("mouseout", handleTableMapOut);
  
    tsne_path_table_tbody_tr
      .append("td")
      .html((d) => (d.t));
  
    tsne_path_table_tbody_tr
      .append("td")
      .html((d) => (gate_lbl[d.g]));
  });
  tsne_visit_dropdown
  .append("label")
  .attr("for", "tsneVisit")
  .html("Choose a visit:");

  tsne_visit_dropdown_choices = tsne_visit_dropdown
  .append("select")
  .attr("name", "tsneVisit")
  .attr("id", "tsneVisit");

  for (i in dt_time_dict[d.id]) {
    tsne_visit_dropdown_choices
    .append("option")
    .attr("value", dt_time_dict[d.id][i]['v'])
    .html(dt_time_dict[d.id][i]['t']);
  }

  tsne_map_svg = tsne_modal.append("div").append("svg")
  .attr("id", "tsnePathPlot")
  .attr("width", "400")
  .attr("height", "400")
  .attr("xmlns", "http://www.w3.org/2000/svg")
  .attr("viewBox", "0 0 600 600");

  tsne_map_svg.append("g")
    .attr("id", "tsneMapPaths")
    .selectAll('path')
    .data(map_path_data)
    .enter()
    .append("path")
    .attr("d", (d) => d.path)
    .attr("id", (d) => "p" + d.edge)
    .attr("stroke-width", "2")
    .attr("stroke", "#CDCDCD")
    .attr("fill", "transparent");

  tsne_map_svg
    .append("g")
    .attr("id", "tsneMapNodes")
    .selectAll('circle')
    .data(map_node_data)
    .enter()
    .append("circle")
    .attr("cx", (d) => d.cx)
    .attr("cy", (d) => d.cy)
    .attr("id", (d) => d.node)
    .attr("r", "8")
    .attr("fill", (d) => map_node_color_scale(d.t))
    // .attr("fill-opacity", "0")
    .attr("class", (d) => "mapNodeType" + d.t)
    .on("mouseover", (d) => {
      tsne_map_svg.append("text")
      .attr("x", parseInt(d.cx) + 8)
      .attr("y", parseInt(d.cy) + 3)
      .attr("id", "tsneMapNodeMouse-" + d.node)
      .attr("style", "font-size: 2em")
      .text(d.node);
    })
    .on("mouseout", (d) => {
      tsne_map_svg.select("#tsneMapNodeMouse-" + d.node).remove();
    });

  tsne_map_trace = tsne_map_svg
    .append("g")
    .attr("id", "tsneMapTrace");

  visit_path = dt_dict[d.id + '-0'];
  for (i in [...Array(visit_path.length - 1).keys()]) {
    // path_name = gate_lbl[visit_path[i]["g"]] + "_" + gate_lbl[visit_path[parseInt(i)+1]["g"]];
    path_name = visit_path[i]["g"] + "-" + visit_path[parseInt(i)+1]["g"];
    path_name = path_dict[path_name];
    tsne_map_trace
    .append("path")
    .attr("d", map_path_dict[path_name])
    .attr("id", "p" + path_name)
    .attr("stroke-width", "3")
    .attr("stroke-opacity", "0.5")
    .attr("stroke", inferno_color_256[Math.floor(parseInt(i) / (visit_path.length - 1) * 256)])
    .attr("fill", "transparent")
    .attr("transform", "translate(" + (Math.random() * 6 - 3) + "," + (Math.random() * 6 - 3) + ")");
  }

  tsne_path_table = tsne_modal
  .append("table")
  .attr("id", "tsnePathTable")
  .attr("class", "lightable-paper lightable-hover")
  .attr("style", "margin-top: -300pt; margin-left: 330pt;");

  tsne_path_table_thead_tr = tsne_path_table.append("thead").append("tr");
  tsne_path_table_thead_tr.append("th").html("Timestamp");
  tsne_path_table_thead_tr.append("th").html("Stop");
  tsne_path_table_tbody = tsne_path_table.append("tbody");

  tsne_path_table_tbody_tr = tsne_path_table_tbody
    .selectAll("tr")
    .data(visit_path)
    .enter()
    .append("tr")
    .on("mouseover", handleTableMapHover)
    .on("mouseout", handleTableMapOut);

  tsne_path_table_tbody_tr
    .append("td")
    .html((d) => (d.t));

  tsne_path_table_tbody_tr
    .append("td")
    .html((d) => (gate_lbl[d.g]));
}

let handleTableMapHover = (d) => {
  tsne_selection.select("#" + gate_lbl[d.g]).attr("r", "14");
}

let handleTableMapOut = (d) => {
  tsne_selection.select("#" + gate_lbl[d.g]).attr("r", "8");
}

// let handleTsneTimeChange = (d) => {
//   selectValue = tsne_selection.select('select').property('value');
//   console.log(d)

//   tsne_selection.append("div").html(selectValue);
// }



showBird();
showCarCounts();


//waypoints scroll constructor
function scroll(n, offset, funcList1, funcList2){
  return new Waypoint({
    element: document.getElementById(n),
    handler: function(direction) {
      if (direction == 'down') {
        for (func in funcList1) {
          funcList1[func]();
        }
      } else {
        for (func in funcList2) {
          funcList2[func]();
        }
      }
    },
    //start 75% from the top of the div
    offset: offset
  });
};

// triger these functions on page scroll
new scroll('intro', '50%', 
  [hideBird, showMap, showMapNodes], 
  [showBird, hideMap, hideMapNodes]);
new scroll('pattern', '50%', 
  [hideMap, hideMapNodes, showTSNE],
  [showMap, showMapNodes, hideTSNE]);
// new scroll('div6', '75%', barChart, divide);