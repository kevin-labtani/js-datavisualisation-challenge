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

