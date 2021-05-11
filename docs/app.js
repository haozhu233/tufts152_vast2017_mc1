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

let updateTSNEidx = () => {
  d3.select("#idx-intro")
  .attr("style", "cursor: pointer; background-color: white;");
  d3.select("#idx-pattern")
  .attr("style", "cursor: pointer; background-color: black;");
  d3.select("#idx-pb")
  .attr("style", "cursor: pointer; background-color: white;");
}

let showTSNE = () => {
  updateTSNEidx();
  if (tsne_svg.attr("width") == "0") {
    tsne_svg
    .attr("width", "500")
    .attr("height", "500");
  }
  if (tsne_svg.select("#tsneDots").empty()) {
    tsne_svg.append("g")
      .attr("id", "tsneDots")
      .attr("transform", "")
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
    .attr("fill-opacity", "0.5")
    .attr("transform", "");
  tsne_svg.select("#tsneLegend")
  .transition()
  .duration(800)
  .attr("opacity", "1.0")
  .attr("fill-opacity", "1.0")
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
    updateRecordTrace(tsne_modal, d.id + '-' + tsne_modal.select('select').property('value'))

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

  var tsne_map_svg = showRecordMap(tsne_modal);
  updateRecordTrace(tsne_map_svg, d.id + "-0");

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

let showRecordMap = (loc_node, width="400") => {
  var tsne_map_svg = loc_node.append("svg")
  .attr("width", width)
  // .attr("height", height)
  .attr("xmlns", "http://www.w3.org/2000/svg")
  .attr("viewBox", "0 0 600 600");

  tsne_map_svg.append("g")
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

  tsne_map_svg
    .append("g")
    .attr("id", "tsneMapTrace");

  return(tsne_map_svg)
}

let updateRecordTrace = (map_svg, id) => {
  var tsne_map_trace = map_svg.select("#tsneMapTrace");

  tsne_map_trace.html("");

  visit_path = dt_dict[id];
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
  return(tsne_map_trace)
}

let showTraceSelector = (loc_node, id) => {
  visit_dropdown = loc_node
    .append("div")
    .attr("class", "visitDropdown")
    .on('change', () => {
      updateRecordTrace(loc_node, id + '-' + loc_node.select('select').property('value'))
    });
  visit_dropdown
    .append("label")
    .attr("for", "visit")
    .html("Visit: ");

  visit_dropdown_choices = visit_dropdown
    .append("select")
    .attr("name", "visit")
    .attr("id", "visit");

  for (i in dt_time_dict[id]) {
    visit_dropdown_choices
      .append("option")
      .attr("value", dt_time_dict[id][i]['v'])
      .html(dt_time_dict[id][i]['t']);
  }
}

let showRecordSummary = (loc_node, id, vid, tp) => {
  var record_summary = loc_node.append("div");

  var record_dt = dt_dict[id + "-" + vid];

  start_time = new Date(record_dt[0]["t"]);
  end_time = new Date(record_dt[record_dt.length - 1]["t"]);

  record_summary.html(
    "<strong>ID:</strong> " + id + "<br>" 
    + "<strong>Type:</strong> " + vehicle_type_dict[tp] + "<br>"
    + "<strong>Date:</strong> " + start_time.toDateString() + "<br>"
    + "<strong>Duration:</strong> " + ((end_time - start_time) / 3600000).toFixed(2) + " hr"
  );
  return(record_summary)
}

let showMultiRecordSummary = (loc_node, id, tp) => {
  var record_summary = loc_node.append("div");

  var all_records = dt_time_dict[id];


  start_date = new Date(all_records[0]["t"]);
  end_date = new Date(all_records[all_records.length - 1]["t"]);

  record_summary.html(
    "<strong>ID:</strong> " + id + "<br>" 
    + "<strong>Type:</strong> " + vehicle_type_dict[tp] + "<br>"
    + "<strong># of Visits:</strong> " + all_records.length + "<br>"
    + "<strong>Date Range:</strong> " + start_date.toDateString() + " to " 
    + end_date.toDateString()
  );
  return(record_summary)
}

let zoomPasserby = () => {
  tsne_passerby_marker = tsne_svg
    .append("g")
    .attr("id", "passerbyMarker");

  tsne_passerby_marker_enter = tsne_passerby_marker
    .selectAll('label')
    .data(passerby_samples)
    .enter();

  tsne_passerby_marker_enter
    .append("text")
    .attr("x", (d) => tsne_x(d.lx))
    .attr("y", (d) => tsne_x(d.ly - 1))
    .attr("text-anchor", "middle")
    .attr("font-weight", "bold")
    .text((d) => d.lbl);

  tsne_passerby_marker_enter
    .append("line")
    .attr("x1", (d) => tsne_x(d.x))
    .attr("x2", (d) => tsne_x(d.lx))
    .attr("y1", (d) => tsne_y(d.y))
    .attr("y2", (d) => tsne_y(d.ly))
    .attr("stroke", "black");

  tsne_passerby_marker
    .transition()
    .duration(500)
    .attr("transform", "translate(-250,-600),scale(2,2)");

  tsne_svg.select("#tsneDots")
    .transition()
    .duration(500)
    .attr("fill-opacity", "0.5")
    .attr("transform", "translate(-250,-600),scale(2,2)");

  d3.select("#idx-pattern")
  .attr("style", "cursor: pointer; background-color: white;")
  d3.select("#idx-pb")
  .attr("style", "cursor: pointer; background-color: black;")
  d3.select("#idx-dv")
  .attr("style", "cursor: pointer; background-color: white;")

}

let unzoomPasserby = () => {
  tsne_svg.select("#tsneDots")
    .transition()
    .duration(500)
    .attr("transform", "");
  tsne_svg.select("#passerbyMarker").remove();
}

let zoomDayvisitor = () => {
  tsne_dayvisitor_marker = tsne_svg
    .append("g")
    .attr("id", "dayvisitorMarker");

  tsne_dayvisitor_marker_enter = tsne_dayvisitor_marker
    .selectAll('label')
    .data(dayvisitor_samples)
    .enter();

  tsne_dayvisitor_marker_enter
    .append("text")
    .attr("x", (d) => tsne_x(d.lx))
    .attr("y", (d) => tsne_x(d.ly - 1))
    .attr("text-anchor", "middle")
    .attr("font-weight", "bold")
    .text((d) => d.lbl);

  tsne_dayvisitor_marker_enter
    .append("line")
    .attr("x1", (d) => tsne_x(d.x))
    .attr("x2", (d) => tsne_x(d.lx))
    .attr("y1", (d) => tsne_y(d.y))
    .attr("y2", (d) => tsne_y(d.ly))
    .attr("stroke", "black");

  tsne_dayvisitor_marker
    .transition()
    .duration(500)
    .attr("transform", "translate(-500,-200),scale(2,2)");

  tsne_svg.select("#tsneDots")
    .transition()
    .duration(500)
    .attr("fill-opacity", "0.5")
    .attr("transform", "translate(-500,-200),scale(2,2)");

  d3.select("#idx-pb")
  .attr("style", "cursor: pointer; background-color: white;")
  d3.select("#idx-dv")
  .attr("style", "cursor: pointer; background-color: black;")
  d3.select("#idx-wc")
  .attr("style", "cursor: pointer; background-color: white;")
}

let unzoomDayvisitor = () => {
  tsne_svg.select("#tsneDots")
    .transition()
    .duration(500)
    .attr("transform", "");
  tsne_svg.select("#dayvisitorMarker").remove();
}


let zoomWeekendCamper = () => {
  tsne_weekendcamper_marker = tsne_svg
    .append("g")
    .attr("id", "weekendcamperMarker");

  tsne_weekendcamper_marker_enter = tsne_weekendcamper_marker
    .selectAll('label')
    .data(weekendcamper_samples)
    .enter();

  tsne_weekendcamper_marker_enter
    .append("text")
    .attr("x", (d) => tsne_x(d.lx - 2))
    .attr("y", (d) => tsne_x(d.ly))
    .attr("text-anchor", "middle")
    .attr("font-weight", "bold")
    .text((d) => d.lbl);

  tsne_weekendcamper_marker_enter
    .append("line")
    .attr("x1", (d) => tsne_x(d.x))
    .attr("x2", (d) => tsne_x(d.lx))
    .attr("y1", (d) => tsne_y(d.y))
    .attr("y2", (d) => tsne_y(d.ly))
    .attr("stroke", "black");

  tsne_weekendcamper_marker
    .transition()
    .duration(500)
    .attr("transform", "translate(0,-400),scale(2,2)");

  tsne_svg.select("#tsneDots")
    .transition()
    .duration(500)
    .attr("fill-opacity", "0.5")
    .attr("transform", "translate(0,-400),scale(2,2)");

  d3.select("#idx-dv")
  .attr("style", "cursor: pointer; background-color: white;")
  d3.select("#idx-wc")
  .attr("style", "cursor: pointer; background-color: black;")
  d3.select("#idx-lc")
  .attr("style", "cursor: pointer; background-color: white;")

}

let unzoomWeekendCamper = () => {
  tsne_svg.select("#tsneDots")
    .transition()
    .duration(500)
    .attr("transform", "");
  tsne_svg.select("#weekendcamperMarker").remove();
}

let zoomLongCamper = () => {
  tsne_longcamper_marker = tsne_svg
    .append("g")
    .attr("id", "longcamperMarker");

  tsne_longcamper_marker_enter = tsne_longcamper_marker
    .selectAll('label')
    .data(longcamper_samples)
    .enter();

  tsne_longcamper_marker_enter
    .append("text")
    .attr("x", (d) => tsne_x(d.lx - 2))
    .attr("y", (d) => tsne_x(d.ly))
    .attr("text-anchor", "middle")
    .attr("font-weight", "bold")
    .text((d) => d.lbl);

  tsne_longcamper_marker_enter
    .append("line")
    .attr("x1", (d) => tsne_x(d.x))
    .attr("x2", (d) => tsne_x(d.lx))
    .attr("y1", (d) => tsne_y(d.y))
    .attr("y2", (d) => tsne_y(d.ly))
    .attr("stroke", "black");

  tsne_longcamper_marker
    .transition()
    .duration(500)
    .attr("transform", "translate(-500,-100),scale(2,2)");

  tsne_svg.select("#tsneDots")
    .transition()
    .duration(500)
    .attr("fill-opacity", "0.5")
    .attr("transform", "translate(-500,-100),scale(2,2)");

  d3.select("#idx-wc")
  .attr("style", "cursor: pointer; background-color: white;")
  d3.select("#idx-lc")
  .attr("style", "cursor: pointer; background-color: black;")
  d3.select("#idx-mc")
  .attr("style", "cursor: pointer; background-color: white;")
}

let unzoomLongCamper = () => {
  tsne_svg.select("#tsneDots")
    .transition()
    .duration(500)
    .attr("transform", "");
  tsne_svg.select("#longcamperMarker").remove();
}

let zoomMultiCamper = () => {
  tsne_multicamper_marker = tsne_svg
    .append("g")
    .attr("id", "multicamperMarker");

  tsne_multicamper_marker_enter = tsne_multicamper_marker
    .selectAll('label')
    .data(multicamper_samples)
    .enter();

  tsne_multicamper_marker_enter
    .append("text")
    .attr("x", (d) => tsne_x(d.lx + 1))
    .attr("y", (d) => tsne_x(d.ly + 1))
    .attr("text-anchor", "middle")
    .attr("font-weight", "bold")
    .text((d) => d.lbl);

  tsne_multicamper_marker_enter
    .append("line")
    .attr("x1", (d) => tsne_x(d.x))
    .attr("x2", (d) => tsne_x(d.lx))
    .attr("y1", (d) => tsne_y(d.y))
    .attr("y2", (d) => tsne_y(d.ly))
    .attr("stroke", "black");

  tsne_multicamper_marker
    .transition()
    .duration(500)
    .attr("transform", "translate(0, -200),scale(2,2)");

  tsne_svg.select("#tsneDots")
    .transition()
    .duration(500)
    .attr("fill-opacity", "0.5")
    .attr("transform", "translate(0, -200),scale(2,2)");

  d3.select("#idx-lc")
  .attr("style", "cursor: pointer; background-color: white;")
  d3.select("#idx-mc")
  .attr("style", "cursor: pointer; background-color: black;")
  d3.select("#idx-fc")
  .attr("style", "cursor: pointer; background-color: white;")
}

let unzoomMultiCamper = () => {
  tsne_svg.select("#tsneDots")
    .transition()
    .duration(500)
    .attr("transform", "");
  tsne_svg.select("#multicamperMarker").remove();
}

let zoomForeverCamper = () => {
  tsne_forevercamper_marker = tsne_svg
    .append("g")
    .attr("id", "forevercamperMarker");

  tsne_forevercamper_marker_enter = tsne_forevercamper_marker
    .selectAll('label')
    .data(forevercamper_samples)
    .enter();

  tsne_forevercamper_marker_enter
    .append("text")
    .attr("x", (d) => tsne_x(d.lx + 2))
    .attr("y", (d) => tsne_x(d.ly + 1))
    .attr("text-anchor", "middle")
    .attr("font-weight", "bold")
    .text((d) => d.lbl);

  tsne_forevercamper_marker_enter
    .append("line")
    .attr("x1", (d) => tsne_x(d.x))
    .attr("x2", (d) => tsne_x(d.lx))
    .attr("y1", (d) => tsne_y(d.y))
    .attr("y2", (d) => tsne_y(d.ly))
    .attr("stroke", "black");

  tsne_forevercamper_marker
    .transition()
    .duration(500)
    .attr("transform", "translate(0, -200),scale(2,2)");

  tsne_svg.select("#tsneDots")
    .transition()
    .duration(500)
    .attr("fill-opacity", "0.5")
    .attr("transform", "translate(0,-200),scale(2,2)");

  d3.select("#idx-mc")
  .attr("style", "cursor: pointer; background-color: white;")
  d3.select("#idx-fc")
  .attr("style", "cursor: pointer; background-color: black;")
}

let unzoomForeverCamper = () => {
  tsne_svg.select("#tsneDots")
    .transition()
    .duration(500)
    .attr("transform", "");
  tsne_svg.select("#forevercamperMarker").remove();
}


showBird();
showCarCounts();

var passerby1 = showRecordMap(d3.select("#passerby1"), "100%");
updateRecordTrace(passerby1, passerby_samples[0]['id'] + "-0");
showRecordSummary(d3.select("#passerby1"), passerby_samples[0]['id'], "0", passerby_samples[0]['tp']);
var passerby2 = showRecordMap(d3.select("#passerby2"), "100%");
updateRecordTrace(passerby2, passerby_samples[1]['id'] + "-0");
showRecordSummary(d3.select("#passerby2"), passerby_samples[1]['id'], "0", passerby_samples[1]['tp']);
var passerby3 = showRecordMap(d3.select("#passerby3"), "100%");
updateRecordTrace(passerby3, passerby_samples[2]['id'] + "-0");
showRecordSummary(d3.select("#passerby3"), passerby_samples[2]['id'], "0", passerby_samples[2]['tp']);

var dayvisitor1 = showRecordMap(d3.select("#dayvisitor1"), "100%");
updateRecordTrace(dayvisitor1, dayvisitor_samples[0]['id'] + "-0");
showRecordSummary(d3.select("#dayvisitor1"), dayvisitor_samples[0]['id'], "0", dayvisitor_samples[0]['tp']);
var dayvisitor2 = showRecordMap(d3.select("#dayvisitor2"), "100%");
updateRecordTrace(dayvisitor2, dayvisitor_samples[1]['id'] + "-0");
showRecordSummary(d3.select("#dayvisitor2"), dayvisitor_samples[1]['id'], "0", dayvisitor_samples[1]['tp']);
var dayvisitor3 = showRecordMap(d3.select("#dayvisitor3"), "100%");
updateRecordTrace(dayvisitor3, dayvisitor_samples[2]['id'] + "-0");
showRecordSummary(d3.select("#dayvisitor3"), dayvisitor_samples[2]['id'], "0", dayvisitor_samples[2]['tp']);

var weekendcamper1 = showRecordMap(d3.select("#weekendcamper1"), "100%");
updateRecordTrace(weekendcamper1, weekendcamper_samples[0]['id'] + "-0");
showRecordSummary(d3.select("#weekendcamper1"), weekendcamper_samples[0]['id'], "0", weekendcamper_samples[0]['tp']);
var weekendcamper2 = showRecordMap(d3.select("#weekendcamper2"), "100%");
updateRecordTrace(weekendcamper2, weekendcamper_samples[1]['id'] + "-0");
showRecordSummary(d3.select("#weekendcamper2"), weekendcamper_samples[1]['id'], "0", weekendcamper_samples[1]['tp']);
var weekendcamper3 = showRecordMap(d3.select("#weekendcamper3"), "100%");
updateRecordTrace(weekendcamper3, weekendcamper_samples[2]['id'] + "-0");
showRecordSummary(d3.select("#weekendcamper3"), weekendcamper_samples[2]['id'], "0", weekendcamper_samples[2]['tp']);

var longcamper1 = showRecordMap(d3.select("#longcamper1"), "100%");
updateRecordTrace(longcamper1, longcamper_samples[0]['id'] + "-0");
showRecordSummary(d3.select("#longcamper1"), longcamper_samples[0]['id'], "0", longcamper_samples[0]['tp']);
var longcamper2 = showRecordMap(d3.select("#longcamper2"), "100%");
updateRecordTrace(longcamper2, longcamper_samples[1]['id'] + "-0");
showRecordSummary(d3.select("#longcamper2"), longcamper_samples[1]['id'], "0", longcamper_samples[1]['tp']);
var longcamper3 = showRecordMap(d3.select("#longcamper3"), "100%");
updateRecordTrace(longcamper3, longcamper_samples[2]['id'] + "-0");
showRecordSummary(d3.select("#longcamper3"), longcamper_samples[2]['id'], "0", longcamper_samples[2]['tp']);

showTraceSelector(d3.select("#multicamper1"), multicamper_samples[0]['id']);
var multicamper1 = showRecordMap(d3.select("#multicamper1"), "100%");
updateRecordTrace(multicamper1, multicamper_samples[0]['id'] + "-0");
showMultiRecordSummary(d3.select("#multicamper1"), multicamper_samples[0]['id'], multicamper_samples[0]['tp']);
showTraceSelector(d3.select("#multicamper2"), multicamper_samples[1]['id']);
var multicamper2 = showRecordMap(d3.select("#multicamper2"), "100%");
updateRecordTrace(multicamper2, multicamper_samples[1]['id'] + "-0");
showMultiRecordSummary(d3.select("#multicamper2"), multicamper_samples[1]['id'], multicamper_samples[1]['tp']);
showTraceSelector(d3.select("#multicamper3"), multicamper_samples[2]['id']);
var multicamper3 = showRecordMap(d3.select("#multicamper3"), "100%");
updateRecordTrace(multicamper3, multicamper_samples[2]['id'] + "-0");
showMultiRecordSummary(d3.select("#multicamper3"), multicamper_samples[2]['id'], multicamper_samples[2]['tp']);

var forevercamper1 = showRecordMap(d3.select("#forevercamper1"), "100%");
updateRecordTrace(forevercamper1, forevercamper_samples[0]['id'] + "-0");
showRecordSummary(d3.select("#forevercamper1"), forevercamper_samples[0]['id'], "0", forevercamper_samples[0]['tp']);

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
new scroll('passerby', '50%', 
  [zoomPasserby],
  [unzoomPasserby, updateTSNEidx]);
new scroll('dayvisitor', '50%', 
  [unzoomPasserby, zoomDayvisitor],
  [unzoomDayvisitor, zoomPasserby]);
new scroll('weekendcamper', '50%', 
  [unzoomDayvisitor, zoomWeekendCamper],
  [unzoomWeekendCamper, zoomDayvisitor]);
new scroll('longcamper', '50%', 
  [unzoomWeekendCamper, zoomLongCamper],
  [unzoomLongCamper, zoomWeekendCamper]);
new scroll('multicamper', '50%', 
  [unzoomLongCamper, zoomMultiCamper],
  [unzoomMultiCamper, zoomLongCamper]);
new scroll('forevercamper', '50%', 
  [unzoomMultiCamper, zoomForeverCamper],
  [unzoomForeverCamper, zoomMultiCamper]);
// new scroll('div6', '75%', barChart, divide);