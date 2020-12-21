// https://www.d3indepth.com/force-layout/
// https://observablehq.com/@jkeohan/intro-to-forced-layouts
// https://www.youtube.com/watch?v=gbMiGtGcq6E&ab_channel=SwizecTeller


var width = 400, height = 400
var numNodes = 20
var allNodes = d3.range(numNodes).map(function(d) {
  return {radius: 5, sel:true, pos:d3.randomInt(1,5)()}
})
margin = 20

var pos = [
  {'x':width / 2, 'y':height / 2},
  {'x':0.75*width, 'y':height*0.75},
  {'x':width / 4, 'y':height*0.75},
  {'x':width / 4, 'y':height / 4},
  {'x':0.75*width, 'y':height / 4},
]
let connections = {}
d3.range(numNodes).forEach((d, i) => {
  connections[i]={}

});

d3.select('#canvas').append("g").attr("id", "links");
d3.select('#canvas').append("g").attr("id", "nodes");


let links = []

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
  .force('x', d3.forceX( ).x( d => pos[d.pos]['x']))
  .force('y', d3.forceY( ).y( d => pos[d.pos]['y']))
  // .force('center', d3.forceCenter(width/2, height/2))
  .force('collision', d3.forceCollide().radius(function(d) {
    return d.radius
  }))
  // .force('link', d3.forceLink().links(links))
  .on('tick', ticked);

function ticked() {
  updateLinks()

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

function updateColor(centered){
  d3.select('#canvas')
    .selectAll('circle')
    .data(allNodes)
    .attr('fill', function(d){
      if (!centered &&d.sel) {
        return 'red'
      }else{
        return 'white'
      }

    })
}

let centered = false

function addLinks(){
  allNodes.forEach((nodei, i) => {
    if(nodei.sel){
      allNodes.forEach((nodej, j) => {
        if(nodej.sel){
          if (j in connections[i]) {
            connections[i][j]+=1
          }else{
            connections[i][j]=1
          }
        }
      })
    }
  });


  let links = []

  Object.keys(connections).forEach((source, i) => {
    Object.keys(connections[source]).forEach((target, j) => {
      links.push({source,target, strength:connections[source][target]});
    });
  });

  return links

}

function apart(){
  if(centered){
    allNodes.forEach((node, i) => {
      if(node.sel){
        node.pos = d3.randomInt(1,5)()
      }else{
        node.sel = true
      }
    });
    strength = -5

  }else{
    allNodes.forEach((node, i) => {
      let chance = Math.random()
      if(chance<0.2) {
        node.pos = 0
      }else{
        node.sel = false
      }
    });
    links = []

    links = addLinks()

  }
  updateColor(centered)

  selNodes = allNodes.filter((node) => node.sel)
  simulation.force('charge', d3.forceManyBody().strength(strength))
  simulation.nodes(allNodes)
  simulation.alpha(1).restart();
  centered =! centered
  d3.select('#state').text(function(){
    return (centered ? 'Home': 'Work')
  })
}

Vue.component('person', {
  props: ['person'],
  template: '<circle r=5 :cx=person.x :cy=person.y fill=none stroke=black></circle>'
  // template: '<circle ></circle>'
})

let app = new Vue({
  el: '#app',
  data: {
    persons: [],
    state:'Centered'
  },
  created: function(){
    for (let id=0;id<100;id++){
      x = d3.randomUniform(10, 200)()
      y = d3.randomUniform(10, 200)()

      this.persons.push({ id, x, y})
    }
  }
})
