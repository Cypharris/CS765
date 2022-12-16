const ageGroupings = [
  {
    category: 'Age: 15-35',
    value: 63789,
  },
  {
    category: 'Age: 36-55',
    value: 85794,
  },
  {
    category: 'Age: 56-85',
    value: 78872,
  }
];

const empGroupings = [
  {
    category: 'Employed',
    value: 14127,
  },
  {
    category: 'Unemployed',
    value: 10168,
  },
  {
    category: 'Not in labor force',
    value: 77160,
  }
];

const sexGroupings = [
  {
    category: 'Male',
    value: 100791,
  },
  {
    category: 'Female',
    value: 127664,
  }
];

const educationGroupings = [
  {
    category: 'Grade 1-8',
    value: 10028,
  },
  {
    category: 'High School',
    value: 82106,
  },
  {
    category: 'Undergraduate',
    value: 107743,
  },
  {
    category: 'Graduate',
    value: 28578,
  }

];

const childGroupings = [
  {
    category: 'Children: 0-4',
    value: 226795,
  },
  {
    category: 'Children: 5-8',
    value: 1634,
  },
  {
    category: 'Children: 9-12',
    value: 26,
  }
];

const partnerGroupings = [
  {
    category: 'Life Partner Present',
    value: 121355,
  },
  {
    category: 'No Life Partner',
    value: 107100,
  }
];

const yearGroupings = [
  {
    category: 'Year: 2003-2008',
    value: 85645,
  },
  {
    category: 'Year: 2009-2014',
    value: 74292,
  },
  {
    category: 'Year: 2015-2021',
    value: 68518,
  }
];

function updateBasicChart(selectedVar) {

  // const data = {'sample1':sample1, 'sample2':sample2}
  const data = {'Age':ageGroupings, 'Employment Status':empGroupings, 'Sex':sexGroupings
  , 'Education Level':educationGroupings, 'Number of Children':childGroupings, 'Life Partner':partnerGroupings, 
  'Surveyed Year':yearGroupings}
  
  const svg = d3version5.select("#svg_basic");
  svg.selectAll('*').remove();
  const svgContainer = d3version5.select('#container');
  
  const margin = 80;
  const width = 700 - 2 * margin;
  const height = 500 - 2 * margin;

  const chart = svg.append('g')
    .attr('transform', `translate(${margin}, ${margin})`);

  const xScale = d3version5.scaleBand()
    .range([0, width])
    .domain(data[selectedVar].map((s) => s.category))
    .padding(0.3)
  
  const yScale = d3version5.scaleLinear()
    .range([height, 0])
    .domain([0, 250000]);

  const makeYLines = () => d3version5.axisLeft()
    .scale(yScale)

  chart.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3version5.axisBottom(xScale))
    .selectAll("text")  
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");

  chart.append('g')
    .call(d3version5.axisLeft(yScale));


  chart.append('g')
    .attr('class', 'grid')
    .call(makeYLines()
      .tickSize(-width, 0, 0)
      .tickFormat('')
    )

  const barGroups = chart.selectAll()
    .data(data[selectedVar])
    .enter()
    .append('g')

  barGroups
    .append('rect')
    .attr('class', 'bar')
    .attr('x', (g) => xScale(g.category))
    .attr('y', (g) => yScale(g.value))
    .attr('height', (g) => height - yScale(g.value))
    .attr('width', xScale.bandwidth())
    .on('mouseenter', function (actual, i) {
        d3version5.selectAll('.value')
        .attr('opacity', 0)

        d3version5.select(this)
        .transition()
        .duration(300)
        .attr('opacity', 0.6)
        .attr('x', (a) => xScale(a.category) - 5)
        .attr('width', xScale.bandwidth() + 6)

      const y = yScale(actual.value)

      line = chart.append('line')
        .attr('id', 'limit')
        .attr('x1', 0)
        .attr('y1', y)
        .attr('x2', width)
        .attr('y2', y)

      barGroups.append('text')
        .attr('class', 'divergence')
        .attr('x', (a) => xScale(a.category) + xScale.bandwidth() / 2)
        .attr('y', (a) => yScale(a.value) - 10)
        .style("fill", "#000000")
        .attr('text-anchor', 'middle')
        .text((a, idx) => {
          const divergence = (a.value - actual.value).toFixed(1)
          
          let text = ''
          if (divergence > 0) text += '+'
          text += `${divergence}`

          return idx !== i ? text : '';
        })

    })
    .on('mouseleave', function () {
        d3version5.selectAll('.value')
        .attr('opacity', 1)

        d3version5.select(this)
        .transition()
        .duration(300)
        .attr('opacity', 1)
        .attr('x', (a) => xScale(a.category))
        .attr('width', xScale.bandwidth())

      chart.selectAll('#limit').remove()
      chart.selectAll('.divergence').remove()
    })

  barGroups 
    .append('text')
    .attr('class', 'value')
    .attr('x', (a) => xScale(a.category) + xScale.bandwidth() / 2)
    .attr('y', (a) => yScale(a.value) - 10)
    .attr('text-anchor', 'middle')
    .text((a) => `${a.value}`)
  
  svg
    .append('text')
    .attr('class', 'label')
    .attr('x', -(height / 2) - margin)
    .attr('y', (margin / 2.4) - 10)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('Size')

  svg.append('text')
    .attr('class', 'label')
    .attr('x', width / 2 + margin)
    .attr('y', height + margin * 2)
    .attr('text-anchor', 'middle')
    .text(selectedVar)

  // svg.append('text')
  //   .attr('class', 'title')
  //   .attr('x', width / 2 + margin)
  //   .attr('y', 40)
  //   .attr('text-anchor', 'middle')
  //   .text('Most loved programming languages in 2018')
}

updateBasicChart('Sex');

const setData = [];
var combinations = null;
var colorsList = ["lightblue", "lightgreen,", "purple", "steelblue", "darkred", "darkgreen"];
// var queriesList = [{ name: "queryStr", color: colorsList[0], set: combinations.find((d) => d["name"] === "(Age: 15-35 ∩ Male)") }];
var queriesList = [];

function updateUpsetPlot(call_func) {

const sets = UpSetJS.asSets(setData);

if (call_func == "initial" || call_func == "fetchSet" ){
  console.log(call_func)
    combinations = UpSetJS.generateCombinations(sets, {
      "type": "intersection",
      "min": 1,
      "empty": false,
      "limit": 100,
      "order": "cardinality",
    });
}

console.log(combinations);         //###### cardinality filter, can do same for the degree ######

const props = {
  sets: sets,
  width: 1300,
  height: 600,
  combinations: combinations,
  queries: queriesList,
  selection: null,
  setName: 'Categories',
  combinationName: 'Intersectional Groupings Size'
}
console.log(props);
console.log(queriesList);

props.onHover = (set) => {
  props.selection = set;
  UpSetJS.render(document.getElementById("upset-plot"), props);
};
UpSetJS.render(document.getElementById("upset-plot"), props);
}


var setNames = ['Graduate',
'Undergraduate',
'High School',
'Grade 1-8',
'Age: 56-85',
'Age: 36-55',
'Age: 15-35',
'Male',
'Female',
'Children: 0-4',
'Children: 5-8',
'Children: 9-12',
'Income: 0-1500',
'No income',
'Income: 1501-3000',
'Year: 2003-2008',
'Year: 2009-2014',
'Year: 2015-2021'];

function addVariable(varName) {
  for(i = 0; i < data.length; i++) {
      if(data[i].name == varName) {
          data.splice(i, 1);
          updateUpsetPlot();
          return;
      }
  }
  for(j = 0; j < completeData.length; j++) {
      if(completeData[j].name == varName) {
          data.push(completeData[j]);
          updateUpsetPlot();
          return;
      }
  }
  
}

async function processFile(setName){
  fetch('https://ouynwl.deta.dev/set/', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({'setName': setName})
})
.then(response => response.json())
.then(response => {
  console.log(response);
  return response["elems"]
})
}

async function fetchInitialSets(){
  var initialSetNames = [
    'Age: 56-85',
    'Age: 36-55',
    'Age: 15-35',
    'Male',
    'Female']

  for (let i = 0; i < initialSetNames.length; i++) {
    const currSet = initialSetNames[i];
    const response = await fetch('https://ouynwl.deta.dev/set/', {
                      method: "POST",
                      headers: { 'Accept': 'application/json',
                      'Content-Type': 'application/json'},
                      body: JSON.stringify({'setName': currSet})
                      });
    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        console.log(message);
    }
    
    let setReceived = await response.json();
    setData.push(setReceived);
  }

  updateUpsetPlot("initial");
}

async function fetchSet(setName){
  console.log("Cliked " + setName);
  for(i = 0; i < setData.length; i++) {
    if(setData[i]["name"] == setName) {
      setData.splice(i, 1);
        updateUpsetPlot("fetchSet");
        return;
    }
  }

  console.log("Fetching " + setName);
  const response = await fetch('https://ouynwl.deta.dev/set/', {
    method: "POST",
    headers: { 'Accept': 'application/json',
    'Content-Type': 'application/json'},
    body: JSON.stringify({'setName': setName})
    });

    if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    console.log(message);
    }

    let setReceived = await response.json();
    setData.push(setReceived);
    queriesList = [];
    updateUpsetPlot("fetchSet");
    return;
}

fetchInitialSets("initial");

function updateCombinationsSize(){
  degree = document.getElementById("combinations-input").value;
  for(var i = 0; i < combinations.length; i++){
    if(combinations[i].degree < degree ){
        combinations.splice(i, 1);
        i--;
    }
    updateUpsetPlot("degree");
}
}

function updateGroupingsSize(){
  combindationsSize = document.getElementById("groupings-input").value;
  for(var i = 0; i < combinations.length; i++){
        if(combinations[i].cardinality < combindationsSize ){
            combinations.splice(i, 1);
            i--;
        }
    }
    updateUpsetPlot("cardinality");
}

function updateQuery(){
  query = document.getElementById("query-input").value;
  queryList = query.split(",");

  queryStr = "("
  for (let i = 0; i < queryList.length; i++) {
    const element = queryList[i];
    if(i != queryList.length - 1){
      queryStr += element + " ∩ ";
    }
    else{
      queryStr += element + ")";
    }
  }
  // queriesList.push({ name: queryStr, color: colorsList[0], set: combinations.find((d) => d["name"] === queryStr) })
  queriesList.push({ name: "queryStr", color: colorsList[0], set: combinations.find((d) => d["name"] === "(Age: 15-35 ∩ Male)")});
  colorsList.splice(0,1);
  // console.log(queriesList);
  updateUpsetPlot("initial");
  return;
}