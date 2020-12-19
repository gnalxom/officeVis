// https://www.d3indepth.com/force-layout/


var width = 400, height = 400
var numNodes = 20
var allNodes = d3.range(numNodes).map(function(d) {
  return {radius: 5, sel:true, pos:d3.randomInt(1,5)()}
})

var pos = [
  {'x':width / 2, 'y':height / 2},
  {'x':width-20, 'y':height-20},
  {'x':width / 4, 'y':height-20},
  {'x':width / 4, 'y':height / 4},
  {'x':width-20, 'y':height / 4},
]


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
  .on('tick', ticked);

function ticked() {

  var u =  d3.select('#canvas')
    .selectAll('circle')
    .data(allNodes)

  u.enter()
    .append('circle')
    .attr('r', 5)
    .attr('fill', function(d){
        return 'none'
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
        return 'none'
      }

    })

}


let centered = false
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
      if(Math.random()>0.5) {
        node.sel = false
      }else{
        node.pos = 0
      }
    });

    strength = 5

  }
  updateColor(centered)

  selNodes = allNodes.filter((node) => node.sel)
  simulation.force('charge', d3.forceManyBody().strength(strength))
  simulation.nodes(selNodes)
  simulation.alpha(1).restart();
  centered =! centered


}

// function apart(){
//   console.log(centered);
//   if (centered){
//     allNodes.forEach((node, i) => {
//       if (node.sel) {
//         node.pos = d3.randomInt(1,4)()
//       }else{
//         node.sel = true
//       }
//     });
//     simulation.force('charge', d3.forceManyBody().strength((-1/selNodes.length)*200))
//   }else{
//     allNodes.forEach((node, i) => {
//       if(Math.random()>0.5) {
//         node.sel =! node.sel
//         node.pos = 0
//       }
//     });
//     simulation.force('charge', d3.forceManyBody().strength((1/selNodes.length)*250))
//   }
//   selNodes = allNodes.filter((node) => node.sel)
//
//
//
//   simulation.nodes(selNodes)
//   console.log();
//   simulation.alpha(1).restart();
//   centered =! centered
// }

Vue.component('person', {
  props: ['person'],
  template: '<circle r=5 :cx=person.x :cy=person.y fill=none stroke=black></circle>'
  // template: '<circle ></circle>'
})

let app = new Vue({
  el: '#app',
  data: {
    persons: []
  },
  created: function(){
    for (let id=0;id<100;id++){
      x = d3.randomUniform(10, 200)()
      y = d3.randomUniform(10, 200)()

      this.persons.push({ id, x, y})
    }
  }
})
