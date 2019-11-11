// 1ST TABLE
// country population object for data normalization
// population for year 2007
const population = {
  Belgique: 10580000,
  Bulgarie: 7530000,
  "Rép.tchèque": 10680000,
  Danemark: 5475000,
  Allemagne: 82310000,
  "Estonie(¹)": 1342000,
  Irlande: 4340000,
  "Grèce(²)": 11400000,
  "Espagne(³)": 44780000,
  France: 63600000,
  Croatie: 4100000,
  "Italie(⁴)": 58220000,
  Chypre: 776333,
  "Lettonie(⁵)": 1800000,
  Lituanie: 2700000,
  Luxembourg: 776333,
  Hongrie: 10045401,
  Malte: 407832,
  "Pays­Bas(⁶)": 16360000,
  Autriche: 8280000,
  Pologne: 38130000,
  Portugal: 10530000,
  Roumanie: 21130000,
  Slovénie: 2000000,
  Slovaquie: 5398000,
  "Finlande(⁷)": 5277000,
  Suède: 9113000,
  "Islande(⁸)": 312000,
  Liechtenstein: 38547,
  Norvège: 4800000,
  "Suisse(⁷)": 7593494,
  Monténégro: 620145,
  ARYdeMacédoine: 2038514,
  Serbie: 7382000,
  "Turquie(⁹)": 69730000
};

// get data from the table
let table = document.getElementById("table1");
let tableArr1 = [];
// skip 1st one as it's the div with the country numbers inside
for (let i = 2; i < table.rows.length; i++) {
  let PopNormalizer = population[table.rows[i].cells[1].innerHTML];
  tableArr1.push({
    country: table.rows[i].cells[1].innerHTML,
    // need to convert from local comma separeted numbers to dot separated numbers before parsing
    // normalizing by pop to get crime rate / person
    data2002:
      (parseFloat(table.rows[i].cells[2].innerHTML.replace(",", ".")) * 1000) /
      PopNormalizer,
    data2003:
      (parseFloat(table.rows[i].cells[3].innerHTML.replace(",", ".")) * 1000) /
      PopNormalizer,
    data2004:
      (parseFloat(table.rows[i].cells[4].innerHTML.replace(",", ".")) * 1000) /
      PopNormalizer,
    data2005:
      (parseFloat(table.rows[i].cells[5].innerHTML.replace(",", ".")) * 1000) /
      PopNormalizer,
    data2006:
      (parseFloat(table.rows[i].cells[6].innerHTML.replace(",", ".")) * 1000) /
      PopNormalizer,
    data2007:
      (parseFloat(table.rows[i].cells[7].innerHTML.replace(",", ".")) * 1000) /
      PopNormalizer,
    data2008:
      (parseFloat(table.rows[i].cells[8].innerHTML.replace(",", ".")) * 1000) /
      PopNormalizer,
    data2009:
      (parseFloat(table.rows[i].cells[9].innerHTML.replace(",", ".")) * 1000) /
      PopNormalizer,
    data2010:
      (parseFloat(table.rows[i].cells[10].innerHTML.replace(",", ".")) * 1000) /
      PopNormalizer,
    data2011:
      (parseFloat(table.rows[i].cells[11].innerHTML.replace(",", ".")) * 1000) /
      PopNormalizer,
    data2012:
      (parseFloat(table.rows[i].cells[12].innerHTML.replace(",", ".")) * 1000) /
      PopNormalizer
  });
}

// make a div to inject our svg
const div1 = document.createElement("div");
div1.classList.add("canvas1");

// inject our div at the right spot in the DOM
const table1 = document.getElementById("table1");
table1.before(div1);

// create select button and inject before our svg
const button = document.createElement("select");
button.setAttribute("id", "selectButton");
div1.append(button);

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

// color for graph bars
const color = "#2873e6";
const hoverColor = "#e67428";

// List of groups for selection button
const group = [
  "2002",
  "2003",
  "2004",
  "2005",
  "2006",
  "2007",
  "2008",
  "2009",
  "2010",
  "2011",
  "2012"
];

// add the options to the button
d3.select("#selectButton")
  .selectAll()
  .data(group)
  .enter()
  .append("option")
  .text(d => d) // text showed in the menu
  .attr("value", d => `data${d}`); // corresponding value returned by the button

// set pageload default dataYear
let dataYear = "data2002";

// listen to selection
button.addEventListener("change", e => {
  dataYear = e.target.value;
  update(tableArr1);
});

// create axes groups
const xAxisGroup = graph
  .append("g")
  .attr("transform", `translate(0, ${graphHeight})`);
const yAxisGroup = graph.append("g");

// create a y axis scale
const y = d3
  .scaleLinear()
  // .domain([0, d3.max(tableArr1, d => (d[dataYear] ? d[dataYear] : 0))])
  .domain([0, 0.16])
  .range([graphHeight, 0]);

// create band scale
const x = d3
  .scaleBand()
  .domain(tableArr1.map(item => item.country))
  .range([0, 670])
  .paddingInner(0.2)
  .paddingOuter(0.2);

// create the axes
const xAxis = d3.axisBottom(x);
const yAxis = d3
  .axisLeft(y)
  .ticks(10)
  .tickFormat(d => d + " infractions per capita");

// tooltip setup
// http://labratrevenge.com/d3-tip/
const tip = d3
  .tip()
  .attr("class", "d3-tip") // for styling
  .html(d => {
    let country = d.country.includes("(") ? d.country.split("(")[0] : d.country;
    let content = `<div class="name">${country}</div>`;
    content += `<div class="infractions">${d[dataYear].toFixed(
      4
    )} infractions per capita</div>`;
    return content;
  });

graph.call(tip);

// update function
const update = tableArr1 => {
  // in case we want to update the domains later:
  // // update domain for y axis
  // y.domain([0, d3.max(tableArr1, d => (d[dataYear] ? d[dataYear] : 0))]); // handling NaN
  // // update domain for x axis
  // x.domain(tableArr1.map(item => item.country));

  console.log(tableArr1);
  // join the data to rects
  const rects = graph.selectAll("rect").data(tableArr1);

  // remove unneeded shapes with the exit selection
  rects.exit().remove();

  // add attributes to rects already in the DOM
  rects
    .attr("width", x.bandwidth)
    .attr("fill", color)
    .attr("x", d => x(d.country));

  // append the enter selection to DOM
  rects
    .enter()
    .append("rect")
    .attr("width", x.bandwidth)
    .attr("height", d => graphHeight - y(d[dataYear] ? d[dataYear] : 0)) // starting condition
    .attr("fill", color)
    .attr("x", d => x(d.country))
    .attr("y", d => y(d[dataYear] ? d[dataYear] : 0)) // starting condition
    .merge(rects) // pass in the current selection and apply the rest to both the enter selection and the current selection already in the DOM
    .transition()
    .duration(500)
    .attr("y", d => y(d[dataYear] ? d[dataYear] : 0)) // ending condition for transition
    .attr("height", d => graphHeight - y(d[dataYear] ? d[dataYear] : 0)); // ending condition

  // call the axis
  // rotate the text on bottom axis
  // by default it rotates around the middle of the text (the text anchor by default)
  xAxisGroup
    .call(xAxis)
    .selectAll("text")
    .attr("transform", "rotate(-40)")
    .attr("text-anchor", "end");

  yAxisGroup.call(yAxis);

  // add events
  graph
    .selectAll("rect")
    .on("mouseover", (d, i, n) => {
      tip.show(d, n[i]); // n[i] is effectively "this"; those are the 2 args expected by show()
      handleMouseOver(d, i, n);
    })
    .on("mouseout", (d, i, n) => {
      tip.hide();
      handleMouseOut(d, i, n);
    });
};

update(tableArr1);

// event handlers
const handleMouseOver = (d, i, n) => {
  d3.select(n[i]) // gets us the element we hover over
    .transition("changeFill") // name the transitions so they don't bug out by interacting with one another
    .duration(300)
    .attr("fill", hoverColor);
};

const handleMouseOut = (d, i, n) => {
  d3.select(n[i]) // gets us the element we hover over
    .transition("changeFill")
    .duration(300)
    .attr("fill", color);
};
