// https://www.d3indepth.com/force-layout/
// https://observablehq.com/@jkeohan/intro-to-forced-layouts
// https://www.youtube.com/watch?v=gbMiGtGcq6E&ab_channel=SwizecTeller


let width = window.innerWidth*0.8
width = width > 500 ? 500 : width
var height = width
var numNodes = 5
let scale = 0.3

margin = 20
let colors = ["none","#f5e180","#fc8997","#fecfac","#b9e9a5","#a9f5e7","#b5b7e5"]

let scenarios = {
  "AS-WAS":{
    'name':"Cetralised",
    'locs':[
      {
        'name': 'Home',
        'size':0.2,
        'x':width / 8,
        'y':height / 8,
        'color':0
      },
      {
        'name': 'WFH',
        'size':0.2,
        'x':width-(width / 8),
        'y':height / 8,
        'color':2
      },
      {
        'name': 'Coporate Office',
        'size':0.8,
        'x':width/2,
        'y':height / 2,
        'color':1
      },
      {
        'name': 'Cafe',
        'size':0.2,
        'x':width / 8,
        'y':height-(height / 8),
        'color':3
      },
    ],
    'links':[[2,1],[2,3]]
  },
  "Hybrid":{
    'name':"Cetralised",
    'locs':[
      {
        'name': 'Home',
        'size':0.2,
        'x':width / 8,
        'y':height / 8,
        'color':0
      },
      {
        'name': 'WFH',
        'size':0.4,
        'x':width-(width / 8),
        'y':height / 8,
        'color':2
      },
      {
        'name': 'Coporate Office',
        'size':0.6,
        'x':width/2,
        'y':height / 2,
        'color':1
      },
      {
        'name': 'Cafe',
        'size':0.2,
        'x':width / 8,
        'y':height-(height / 8),
        'color':3
      },
      {
        'name': 'Cowork Office',
        'size':0.2,
        'x':width-(width / 8),
        'y':height - (height / 8),
        'color':4
      },
    ],
    'links':[[1,2],[2,3],[2,4]]
  },
  "Hub":{
    'name':"Hub",
    'locs':[
      {
        'name': 'Home',
        'size':0.2,
        'x':width / 8,
        'y':height / 8,
        'color':0
      },
      {
        'name': 'WFH',
        'size':0.4,
        'x':width-(width / 8),
        'y':height / 8,
        'color':2
      },
      {
        'name': 'Coporate Office',
        'size':0.6,
        'x':width/2,
        'y':height / 2,
        'color':1
      },
      {
        'name': 'Cafe',
        'size':0.2,
        'x':width / 8,
        'y':height-(height / 8),
        'color':3
      },
      {
        'name': 'Cowork Office',
        'size':0.2,
        'x':width-(width / 8),
        'y':height - (height / 8),
        'color':4
      },
      {
        'name': 'Satellite',
        'size':0.3,
        'x':width-(width / 8),
        'y':height - (height / 2),
        'color':5
      },
      {
        'name': 'Satellite',
        'size':0.3,
        'x':width / 8,
        'y':height - (height / 2),
        'color':5
      },
      {
        'name': 'Satellite',
        'size':0.3,
        'x':width - (width / 2),
        'y':height / 8,
        'color':5
      }
    ],
    'links':[[1,2],[2,3],[2,4],[2,5],[2,6],[2,7]]
  },
}

//
// for (let i =0; i<3; i++){
//   scenarios["Hub"]["locs"].push(
//     {
//       'name': 'Satellite',
//       'size':0.3,
//       'x':Math.random()*width,
//       'y':Math.random()*height,
//       'color':5
//     }
//   );
// }


// set defaults
let centered = true
let currScenario = scenarios["AS-WAS"]
let pos=currScenario['locs']
updateLocs()
var allNodes;
let matrix;
setupNodes(numNodes)

function setupNodes(numNodes){
  allNodes = d3.range(numNodes).map(function(d) {
    return {radius: 5, sel:true, pos:pos[0], interactions:0, connections:0, loc:0 }
  })

  setupMatrix(numNodes)
}
updateColor()
// assignLocations(pos)



d3.select('#scenarios').on('change', function(){
  reset()

  currScenario = scenarios[d3.select(this).property('value')]
  pos = currScenario['locs']
  assignLocations(pos)
  updateLocs()
})

d3.select('#num').on('change', function(){
  numNodes = d3.select(this).property('value')
  setupNodes(numNodes)
  drawMatrix()
  reset()
  //
  // currScenario = scenarios[d3.select(this).property('value')]
  // pos = currScenario['locs']
  // assignLocations(pos)
  // updateLocs()
})

function assignLocations(locs){
  // d3.range(numNodes).map(function(d) {
  //   return {radius: 5, sel:true, pos:d3.randomInt(1,5)()}
  // })
  allNodes.forEach(node=>{
    let selLoc = 0
    selLoc = d3.randomInt(1,locs.length)();
    let { x , y } = locs[selLoc]
    node.pos= { x , y }
    node.loc = selLoc
  })


}


let connections;

function resetConnections(){
  connections = {}
  d3.range(numNodes).forEach((d, i) => {
    connections[i]={}
  });
}
resetConnections()

var margin = {top: 10, right: 0, bottom: 10, left: 20}
d3.select('#canvas').append("g").attr("id", "locsLinks");
d3.select('#canvas').append("g").attr("id", "locs");
d3.select('#canvas').append("g").attr("id", "links");
d3.select('#canvas').append("g").attr("id", "nodes");
d3.select('#canvas2').append("g").attr("id", "matrix")
// .attr("transform", "translate(" + margin.left + "," + margin.top + ")");;

let links = []


let m = d3.select('#matrix')
m.append("rect")
.attr('calss', 'background')
.attr('width', width)
.attr('height', height)
.attr('fill','#eee')

drawMatrix()

  // Compute index per node.

function setupMatrix(numNodes){
  matrix = []
  allNodes.forEach(function(node, i) {
    node.index = i;
    node.count = 0;
    matrix[i] = d3.range(numNodes).map(function(j) { return {x: j, y: i, z: 1}; });
  });
}



function drawMatrix(){
  var x = d3.scaleBand()
      .range([0, width])
      .domain(d3.range(numNodes));
      // z = d3.scaleOrdinal().domain([0,1000]).clamp(true),
      // c = d3.scaleOrdinal().domain(d3.range(10));

  var row = m.selectAll(".row")
      .data(matrix);

  row.exit().remove();

  let rowEnter = row.enter().append("g")
      .attr("class", "row");


  function updateRow(){
    d3.selectAll(".row").transition().attr("transform", function(d, i) {
      return "translate(0," + x(i) + ")";
    }).duration(50)
  }

  updateRow()


  rowEnter.append("line")
        .attr("x2", width);

  row = row.merge(rowEnter)



  // row.append("text")
  //       .attr("x", -6)
  //       .attr("y", function(d, i) { return x(i)/2; })
  //       .attr("dy", ".32em")
  //       .attr("text-anchor", "end")
  //       .text(function(d, i) { return i});

  // var column = m.selectAll(".column")
  //     .data(matrix)
  //   .enter().append("g")
  //     .attr("class", "column")
  //     .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });
  //
  // column.exit().remove()
  //
  // column.append("line")
  //     .attr("x1", -width)
  //     .merge(column);
  //



  function row(row) {
    var cell = d3.select(this).selectAll(".cell")
        .data(row)
      .enter().append("rect")
        .attr("class", "cell")
        .attr("x", function(d) {
          console.log(x(d.x));
          return x(d.x);
        })
        .attr("width", 20)
        .attr("height", 20)
        // .attr("width", width/numNodes)
        // .attr("height", width/numNodes)
        // .style("fill-opacity", function(d) { return z(d.z); })
        .style("fill", function(d) { return "blue"});
        // // .on("mouseover", mouseover)
        // // .on("mouseout", mouseout);

    cell.exit().remove()
  }

}



// ----
function updateLinks() {
  var u =  d3.select('#links')
    .selectAll('line')
    .data(links)

    u.enter()
    .append('line')
    .merge(u)
    .attr('x1', function(d) {
      return allNodes[d.source]["x"]
    })
    .attr('y1', function(d) {
      return allNodes[d.source]["y"]
    })
    .attr('x2', function(d) {
      return allNodes[d.target]["x"]
    })
    .attr('y2', function(d) {
      return allNodes[d.target]["y"]
    })
    .attr('stroke', 'black')
    .attr('stroke-width', function(d){
      return d.strength*0.05
    })
    .attr("stroke-opacity", 0.5);

    u.exit().remove()


}

let selNodes = allNodes.filter((node) => node.sel)
let strength = -10
var simulation = d3.forceSimulation(selNodes)
  .force('charge', d3.forceManyBody().strength((-1/selNodes.length)*200))
  // .force('x', d3.forceX( ).x( d => pos[d.pos]['x']))
  .force('x', d3.forceX( ).x( d => d.pos.x))
  .force('y', d3.forceY( ).y( d => d.pos.y))
  // .force('center', d3.forceCenter(width/2, height/2))
  .force('collision', d3.forceCollide().radius(function(d) {
    return d.radius
  }))
  // .force('link', d3.forceLink().links(links))
  .on('tick', ticked);


function updateLocs(){
  let locs = d3.select('#locs')
    .selectAll('circle')
    .data(pos)

  locs.enter()
  .append('circle')
  .attr('fill', function(d){
      return colors[d.color]
  })
  // .attr('stroke', 'black')
  .merge(locs)
  .attr('cx', function(d) {
    return d.x
  })
  .attr('cy', function(d) {
    return d.y
  });

  locs.transition().attr('r', function(d){
    return (d.size * width * scale)
  }).duration(50)

  locs.exit().remove()

  let labels = d3.select('#locs')
  .selectAll('text')
  .data(pos)

  labels.enter()
  .append("text")
  .attr("dx", function(d){ return (d.x - (d.size*scale*width*0.5))})
  .attr("dy", function(d){return (d.y + 20 + (d.size*scale*width))})
  .text(function(d){
    return d.name
  })

  labels.exit().remove()

  let l =  d3.select('#locsLinks')
    .selectAll('line')
    .data(currScenario['links'])

    l.enter()
    .append('line')
    .merge(l)
    .attr('x1', function(d) {
      return currScenario['locs'][d[0]]['x']
    })
    .attr('y1', function(d) {
      return currScenario['locs'][d[0]]['y']
    })
    .attr('x2', function(d) {
      return currScenario['locs'][d[1]]['x']
    })
    .attr('y2', function(d) {
      return currScenario['locs'][d[1]]['y']
    })
    .attr('stroke', 'black')
    .attr('stroke-width', 4)
    .attr("stroke-opacity", 0.25);

    l.exit().remove()





}
function ticked() {
  updateLinks()
  updateLocs()

  var u =  d3.select('#nodes')
    .selectAll('circle')
    .data(allNodes)

  u.enter()
    .append('circle')
    .attr('r', 5)
    .attr('fill', function(d){
        return 'white'
    })
    .attr('stroke', 'black')
    .merge(u)
    .attr('cx', function(d) {
      return d.x
    })
    .attr('cy', function(d) {
      return d.y
    })

  u.exit().remove()

}
let showInteractions = true;


d3.select('#toggleColor').on('click', function(){
  showInteractions = !showInteractions
  updateColor()
})

function updateColor(){

  let  connColor = d3.scaleLinear().domain([1,10])
    .range(["white", "blue"])
  let  intColor = d3.scaleLinear().domain([1,10])
    .range(["white", "red"])
  d3.select('#nodes')
    .selectAll('circle')
    .data(allNodes)
    .attr('fill', function(d){

      if(showInteractions){
        return intColor(d['interactions'])
      } else {
        return connColor(d['connections'])
      }
    })
}



function addLinks(){
  let allC = 0
  let allI = 0
  allNodes.forEach((nodei, i) => {
    allNodes.forEach((nodej, j) => {
      if ( i == j || nodei.loc == 0) return;
      if(nodei.loc == nodej.loc){
        if (j in connections[i]) {
          connections[i][j]+=1
          nodei['interactions']+=1
          allI+=1
        }else{
            allI+=1
            allC+=1
          connections[i][j]=1
          nodei['interactions']+=1
          nodei['connections']+=1
        }
      }
    })
  });

  console.log("Uniq:", allC/2, "all", allI/2, JSON.stringify(connections));


  let links = []

  Object.keys(connections).forEach((source, i) => {
    Object.keys(connections[source]).forEach((target, j) => {
      links.push({source,target, strength:connections[source][target]});
    });
  });

  return links

}

function apart(){
  allNodes.forEach((node, i) => {
    node.sel = Math.random() >= 0.5
    node.loc = d3.randomInt(1,pos.length)()
    node.pos = pos[node.loc]
    // if(node.sel){
    // } else{
    //   node.loc = 0
    //   node.pos = pos[0]
    // }
  });

  links = []

  links = addLinks()



  updateColor(centered)

  selNodes = allNodes.filter((node) => node.sel)
  simulation.force('charge', d3.forceManyBody().strength(strength))
  simulation.nodes(allNodes)
  simulation.alpha(1).restart();
}



function round(){
  apart()
}


let simTimer;
let i = 1;

function updateCounts(){
  let conns = d3.select("#conns")
  let ints = d3.select("#ints")

  let allConns = allNodes.reduce((a, b) => a + b.connections, 0);
  let allInts = allNodes.reduce((a, b) => a + b.interactions, 0)

  conns.text(allConns/2)
  ints.text(allInts/2)
}

function simulate(n=5){
  let counter = d3.select("#counter")
  let number = d3.select("#n").property("value")
  if(number) n = number
  let j = 0


  simTimer = setInterval(function() {
    if (i>=n && j==1) {
      stop();
    }
    if (j == 0){
      counter.text(i)
      round()
      updateCounts()


      j=1
    } else {
      j=0
      i++
      resetNodes()
    }

  }, 2000)
}

function stop(){
  clearInterval(simTimer);
}

function resetNodes(){
  allNodes.forEach((node, i) => {
    node.sel = true
    node.pos = pos[0]
    node.loc = 0
    updateColor()

  });
  selNodes = allNodes.filter((node) => node.sel)
  simulation.force('charge', d3.forceManyBody().strength(strength))
  simulation.nodes(allNodes)
  simulation.alpha(1).restart();
}

function resetLinks(){
  links = []
  updateLinks()
}

function reset(){

  i = 1;
  d3.select("#counter").text(i)
  d3.select("#conns").text(0)
  d3.select("#ints").text(0)
  clearInterval(simTimer);
  resetConnections()
  resetLinks()

  allNodes.forEach((node, i) => {
    node.connections = 0
    node.interactions = 0
  });

  resetNodes()

  strength = -5
  console.log('reset');
}

// Vue.component('person', {
//   props: ['person'],
//   template: '<circle r=100 :cx=person.x :cy=person.y fill=none stroke=black></circle>'
//   // template: '<circle ></circle>'
// })
//
// let app = new Vue({
//   el: '#app',
//   data: {
//     persons: [],
//     state:'Centered',
//     count: 10
//   },
//   created: function(){
//     for (let id=0;id<100;id++){
//       x = d3.randomUniform(10, 200)()
//       y = d3.randomUniform(10, 200)()
//
//       this.persons.push({ id, x, y})
//     }
//   }
// })
