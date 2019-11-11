// 1ST TABLE

// get data from the table
let table = document.getElementById("table1");
let tableArr1 = [];
// skip 1st one as it's the div with the country numbers inside
for (let i = 2; i < table.rows.length; i++) {
  tableArr1.push({
    country: table.rows[i].cells[1].innerHTML,
    // need to convert from local comma separeted numbers to dot separated numbers before parsing
    data2002: parseFloat(table.rows[i].cells[2].innerHTML.replace(",", ".")),
    data2003: parseFloat(table.rows[i].cells[3].innerHTML.replace(",", ".")),
    data2004: parseFloat(table.rows[i].cells[4].innerHTML.replace(",", ".")),
    data2005: parseFloat(table.rows[i].cells[5].innerHTML.replace(",", ".")),
    data2006: parseFloat(table.rows[i].cells[6].innerHTML.replace(",", ".")),
    data2007: parseFloat(table.rows[i].cells[7].innerHTML.replace(",", ".")),
    data2008: parseFloat(table.rows[i].cells[8].innerHTML.replace(",", ".")),
    data2009: parseFloat(table.rows[i].cells[9].innerHTML.replace(",", ".")),
    data2010: parseFloat(table.rows[i].cells[10].innerHTML.replace(",", ".")),
    data2011: parseFloat(table.rows[i].cells[11].innerHTML.replace(",", ".")),
    data2012: parseFloat(table.rows[i].cells[12].innerHTML.replace(",", "."))
  });
}
console.log(tableArr1);

// make a div to inject our svg
const div1 = document.createElement("div");
div1.classList.add("canvas1");

// inject our div at the right spot in the DOM
const table1 = document.getElementById("table1");
table1.before(div1);

// create the svg
const svg = d3
  .select(".canvas1")
  .append("svg")
  .attr("width", 800)
  .attr("height", 600);

// create margins and dimentions
// extra margins left and bot for our legends
const margin = { top: 20, right: 20, bottom: 100, left: 130 };
const graphWidth = 600 - margin.left - margin.right;
const graphHeight = 600 - margin.top - margin.bottom;

// create graph group inside the svg container
const graph = svg
  .append("g")
  .attr("width", graphWidth)
  .attr("height", graphHeight)
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// create axes groups
const xAxisGroup = graph
  .append("g")
  .attr("transform", `translate(0, ${graphHeight})`);
const yAxisGroup = graph.append("g");

// join the data to rects
const rects = graph.selectAll("rect").data(tableArr1);

// create a y axis scale
const y = d3
  .scaleLinear()
  .domain([0, d3.max(tableArr1, d => d.data2002)])
  .range([graphHeight, 0]);

// create band scale
const x = d3
  .scaleBand()
  .domain(tableArr1.map(item => item.country))
  .range([0, 670])
  .paddingInner(0.2)
  .paddingOuter(0.2);

// add attributes to rects already in the DOM
rects
  .attr("width", x.bandwidth)
  .attr("height", d => graphHeight - y(d.data2002))
  .attr("fill", "orange")
  .attr("x", d => x(d.country))
  .attr("y", d => y(d.data2002));

// append the enter selection to DOM
rects
  .enter()
  .append("rect")
  .attr("width", x.bandwidth)
  .attr("height", d => graphHeight - y(d.data2002))
  .attr("fill", "grey")
  .attr("x", d => x(d.country))
  .attr("y", d => y(d.data2002));

console.log(rects);

// create and call the axes
const xAxis = d3.axisBottom(x);
const yAxis = d3
  .axisLeft(y)
  .ticks(10)
  .tickFormat(d => d + " Infractions (milliers)");

xAxisGroup.call(xAxis);
yAxisGroup.call(yAxis);

// rotate the text on bottom axis
// by default it rotates around the middle of the text (the text anchor by default)
xAxisGroup
  .selectAll("text")
  .attr("transform", "rotate(-40)")
  .attr("text-anchor", "end")
  .attr("fill", "grey");
