// https://www.d3indepth.com/force-layout/
// https://observablehq.com/@jkeohan/intro-to-forced-layouts
// https://www.youtube.com/watch?v=gbMiGtGcq6E&ab_channel=SwizecTeller


let width = window.innerWidth*0.8
width = width > 500 ? 500 : width
var height = width
var numNodes = 5
let scale = 0.3
let workday = [9,18]
let workhours = 8
let lunch = [12]
let showCol = 'social';

margin = 20
let colors = ["none","#f5e180","#fc8997","#fecfac","#b9e9a5","#a9f5e7","#b5b7e5"]
let metrics = {
  'WFH':{
    'family': 0.75,
    'work': 0.5,
    'social':0.2
  },
  'Coporate Office':{
    'family': 0,
    'work': 0.9,
    'social':0.5
  },
  'Cafe':{
    'family': 0,
    'work': 0.4,
    'social':0.3
  },
  'Cowork Office':{
    'family': 0,
    'work': 0.9,
    'social':0.2
  },
  'Satellite':{
    'family': 0,
    'work': 0.9,
    'social':0.5
  },
}

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
    return { radius: 5, sel:true, pos:pos[0], metrics:{},interactions:0, connections:0, loc:0 }
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

d3.select('#colorMap').on('change', function(){
  showCol = d3.select(this).property('value')
  updateColor()
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
  let chances = []
  locs.forEach((loc, i) => {
    if (i==0) return;
    //else
    chances = chances.concat(Array(loc.size * 10).fill(i))
  });

  allNodes.forEach(node=>{
    let selLoc = 0
    let allocations = []
    selLoc = chances[d3.randomInt(0,chances.length)()]
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

  allNodes.forEach((node, i) => {
    node.metrics = {}
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
.attr('class', 'background')
.attr('width', width)
.attr('height', height)

let r = m.append("g").attr('class', 'rows');
let c = m.append("g").attr('class', 'cols');

drawMatrix()

  // Compute index per node.

function setupMatrix(numNodes){
  matrix = []
  allNodes.forEach(function(node, i) {
    node.index = i;
    node.count = 0;
    matrix[i] = d3.range(numNodes).map(function(j) { return {x: j, y: i, z: 0}; });
  });
}



function drawMatrix(){
  var x = d3.scaleBand()
      .range([0, width])
      .domain(d3.range(numNodes));
      // z = d3.scaleOrdinal().domain([0,1000]).clamp(true),
      // c = d3.scaleOrdinal().domain(d3.range(10));

  var row = r.selectAll(".row")
      .data(matrix);

  row.exit().remove();

  let rowEnter = row.enter().append("g")
      .attr("class", "row");


  function updateRow(){
    d3.selectAll(".row").transition().attr("transform", function(d, i) {
      return "translate(0," + x(i) + ")";
    }).duration(50)

    d3.selectAll(".row").each(rowCell);
    d3.selectAll(".cell").transition().attr("x", function(d) {
      return x(d.x);
    }).attr("width", width/numNodes).attr("height", width/numNodes).duration(50);

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

  var column = c.selectAll(".col")
      .data(matrix);

  column.exit().remove();

  let columnEnter = column.enter().append("g")
      .attr("class", "col");

  function updateCol(){
    d3.selectAll(".col").transition().attr("transform", function(d, i) {
      return "translate(" + x(i) + ")rotate(-90)"}).duration(50)
  }

  updateCol()

  columnEnter.append("line")
      .attr("x1", -width);

  column = column.merge(columnEnter);

  function rowCell(row) {
    var cell = d3.select(this).selectAll(".cell")
        .data(row);
    cell.exit().remove();

    let cellEnter = cell.enter();
    cellEnter.append("rect")
        .attr("class", "cell")
        .style("fill", function(d) {
          return "none"
        });

        // // .on("mouseover", mouseover)
        // // .on("mouseout", mouseout);

    cell= cell.merge(cellEnter)
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
    .attr('stroke-width', function(d){
      return d.strength*0.05
    })
    .attr('class', 'nodeLinks');

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
    .attr('class', 'locLinks');

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



function updateColor(){
  let colormaps = {
    'family': "green",
    'work': "red",
    'social': "blue"
  }

  let colorscales = {}

  for (const [key, col] of Object.entries(colormaps)){
    let dom = [0,d3.max(allNodes.map(n => n.metrics[key]))]
    if (!dom[1]) dom[1] = 1;

    // if (!dom[1] || dom[1]==0) {
    //   dom[1] = 1
    // }
    colorscales[key] = d3.scaleLinear().domain(dom).range(["white", col])
  }
  colorscales['int'] = d3.scaleLinear().domain([0,10]).range(["white", "blue"])

  d3.select('#nodes')
    .selectAll('circle')
    .data(allNodes)
    .attr('fill', function(d){
      console.log(d.metrics[showCol]);
      return d.metrics[showCol] ? colorscales[showCol](d.metrics[showCol]) : colorscales[showCol](0)
    })

    // console.log(matrix);

    var row = d3.selectAll(".row")
        .data(matrix);

    row.each(function(row){
      var cell = d3.select(this).selectAll(".cell")
          .data(row);
      cell.style("fill", function(d) {
        return colorscales['int'](d['z'])
        // return (d['z'] > 0 ? colorscales['social'](1) : colorscales['social'](0))
        // switch (showCol) {
        //   case 'conn':
        //     return (d['z'] > 0 ? connColor(1) : connColor(0))
        //     break;
        //   default:
        //     return intColor(d['z'])
        // }
      });
    })


    // console.log(d3.selectAll(".cell"))

  // d3.select('#cell')
  //   .selectAll('rect')
  //   // .style("fill-opacity", function(d) { return z(d.z); })
  //   .style("fill", function(d) {
  //     console.log('here');
  //     console.log(d);
  //     // return "blue"
  //   });
}



function addLinks(){
  let allC = 0
  let allI = 0
  allNodes.forEach((nodei, i) => {
    let loc = pos[nodei.loc]
    if (loc.name in metrics) {
      for (let i=0; i<workhours; i++){
        for (const [key, value] of Object.entries(metrics[loc.name])){
          if (!(key in nodei.metrics)) nodei.metrics[key] = 0
          if (Math.random()< value) nodei.metrics[key] += 1
        }
      }
    }

    if ( nodei.loc == 0) return;

    for (let b=0; b<nodei.metrics['social']; b++){
      let j = d3.randomInt(0,allNodes.length)()
      if (j == i) j = d3.randomInt(0,allNodes.length)()

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
        console.log(connections[i][j]);
      }
    }
    // allNodes.forEach((nodej, j) => {
    //   if ( i == j || nodei.loc == 0) return;
    //   if(nodei.loc == nodej.loc){
    //     if (j in connections[i]) {
    //       connections[i][j]+=1
    //       nodei['interactions']+=1
    //       allI+=1
    //     }else{
    //         allI+=1
    //         allC+=1
    //       connections[i][j]=1
    //       nodei['interactions']+=1
    //       nodei['connections']+=1
    //     }
    //   }
    // })
  });

  // console.log("Uniq:", allC/2, "all", allI/2, JSON.stringify(connections));


  let links = []

  Object.keys(connections).forEach((source, i) => {
    Object.keys(connections[source]).forEach((target, j) => {
      links.push({source,target, strength:connections[source][target]});
      matrix[source][target]["z"] = connections[source][target]
    });
  });

  return links

}

function apart(){

}



function round(){
  assignLocations(pos)

  links = []
  links = addLinks()



  updateColor(centered)

  selNodes = allNodes.filter((node) => node.sel)
  simulation.force('charge', d3.forceManyBody().strength(strength))
  simulation.nodes(allNodes)
  simulation.alpha(1).restart();
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
  if (i > n){
    reset()
  }
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
  setupMatrix(numNodes)


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
