<script lang="ts">
  import {
    startDijkstra,
    getNodesInShortestPathOrder,
  } from "../algorithms/Dijkstra.js";

  let START_NODE_ROW = 10;
  let START_NODE_COL = 10;
  let FINISH_NODE_ROW = 25;
  let FINISH_NODE_COL = 25;
  let grid = [40, 40];
  $: MAX_col = `repeat(${grid[1]}, 1fr)`;
  $: MAX_row = `repeat(${grid[0]}, 1fr)`;
  let nodeGrid = [];
  let currentNode = null;
  let interactState = "wall";

  let mouseDown = false;

  document.body.onmousedown = () => {
    mouseDown = true;
  };

  document.body.onmouseup = () => {
    mouseDown = false;
  };

  //Setup 2D grid array
  for (let i = 0; i < grid[0]; i++) {
    let currentRow = [];
    for (let j = 0; j < grid[1]; j++) {
      currentNode = createNode(i, j);
      currentRow.push(currentNode);
    }
    nodeGrid.push(currentRow);
  }

  function createNode(row: number, col: number) {
    return {
      row: row,
      col: col,
      isStart: row === START_NODE_ROW && col === START_NODE_COL,
      isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
      isVisited: false,
      distance: Infinity,
      isWall: false,
      previousNode: null,
    };
  }

  function startSearch(Algorithm) {
    switch (Algorithm) {
      case "dijkstra":
        const visitedNodesInOrder = startDijkstra(
          nodeGrid,
          nodeGrid[START_NODE_COL][START_NODE_ROW],
          nodeGrid[FINISH_NODE_COL][FINISH_NODE_ROW]
        );
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(
          nodeGrid[FINISH_NODE_COL][FINISH_NODE_ROW]
        );
        animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
        break;

      default:
        break;
    }
  }

  // ANIMATION
  function animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    console.log("Started to animate visited nodes");
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      //Animate shortest path nodes
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, 15 * i);
        return;
      }

      //Animate visited nodes
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        console.log("Current node to animate: " + node);
        if (node != undefined) addVisitedClass(node);
      }, 15 * i);
    }
  }

  function animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        addShortestNodeClass(node);
      }, 50 * i);
    }
  }

  function addVisitedClass(node) {
    if (
      node != nodeGrid[START_NODE_ROW][START_NODE_COL] &&
      node != nodeGrid[FINISH_NODE_ROW][FINISH_NODE_COL]
    ) {
      let element = document.getElementById(node.col + "_" + node.row);
      element.classList.add("visited");
    }
  }

  function addShortestNodeClass(node) {
    if (
      node != nodeGrid[START_NODE_ROW][START_NODE_COL] &&
      node != nodeGrid[FINISH_NODE_ROW][FINISH_NODE_COL]
    ) {
      let element = document.getElementById(node.col + "_" + node.row);
      element.classList.add("shortest");
    }
  }

  function interact(e) {
    switch (interactState) {
      case "wall":
        setWall(e);
        break;
      case "setStart":
        break;
      case "setFinish":
        break;
      case "weight":
        break;
      case "eraser":
        remove(e);
        break;
      default:
        break;
    }
  }

  function remove(e) {
    if (mouseDown) {
      let id = e.srcElement.id;
      let nodeCol = id.split("_")[0];
      let nodeRow = id.split("_")[1];
      let node = nodeGrid[nodeRow][nodeCol];

      node.isWall = false;
      node.isFinish = false;
      node.isStart = false;
      document.getElementById(id).classList.remove("wall");
      document.getElementById(id).classList.remove("finish");
      document.getElementById(id).classList.remove("start");
      console.log("node classes erased " + id);
    }
  }

  function setWall(e) {
    if (mouseDown) {
      let id = e.srcElement.id;
      let nodeCol = id.split("_")[0];
      let nodeRow = id.split("_")[1];
      let node = nodeGrid[nodeRow][nodeCol];

      node.isWall = true;
      document.getElementById(id).classList.add("wall");
      console.log("Wall added to: " + id);
    }
  }

  function removeWall(e) {
    if (mouseDown) {
      let id = e.srcElement.id;
      let nodeCol = id.split("_")[0];
      let nodeRow = id.split("_")[1];
      let node = nodeGrid[nodeRow][nodeCol];

      node.isWall = false;
      document.getElementById(id).classList.remove("wall");
      console.log("Wall removed at: " + id);
    }
  }
</script>

<button on:click={() => startSearch("dijkstra")}>Start</button>
<button on:click={() => (interactState = "wall")}>Wall</button>
<button on:click={() => (interactState = "eraser")}>Eraser</button>
<div class="grid" style="display: flex; justify-content: center;">
  <div
    class="container"
    style="grid-template-rows: {MAX_row} ; grid-template-columns: {MAX_col};"
  >
    {#each nodeGrid as currRow, i (i)}
      {#each currRow as currNode, j (j)}
        <div
          on:mousemove={(e) => interact(e)}
          id="{i}_{j}"
          class:visited={false}
          class:shortest={false}
          class:finish={currNode.isFinish}
          class:start={currNode.isStart}
          class:wall={false}
        />
      {/each}
    {/each}
  </div>
</div>

<style>
  .container {
    display: grid;
    border: 1px solid rgb(0, 0, 0);
    border-radius: 2px;
    width: 800px;
    grid-gap: 0px;
    row-gap: 0px;
    height: 800px;
    background: rgb(255, 255, 255);
  }

  .container div {
    background: #fff;
    outline: 1px solid black;
    height: 20px;
    width: 20px;
  }

  @keyframes transitionColor {
    from {
      background: rgb(67, 34, 255);
      width: 10px;
      height: 10px;
      border-radius: 100%;
    }
    to {
      background: var(--clrVisited);
      border-radius: 0%;
      widows: 20px;
      height: 20px;
      transform: rotate(360deg);
    }
  }

  @keyframes shortestPathGlow {
    from {
      background-color: #ffcccc;
    }
    to {
      background-color: rgba(255, 106, 136, 0.842);
    }
  }

  .container div.visited {
    background: var(--clrVisited);
    animation-name: transitionColor;
    animation-duration: 1.3s;
  }

  .container div.shortest {
    background: rgba(255, 106, 136, 0.842);
    animation-name: shortestPathGlow;
    animation-duration: 3s;
    animation-iteration-count: infinite;
  }

  .container div.finish {
    background: red;
  }

  .container div.start {
    background: green;
  }

  .container div.wall {
    background: rgb(46, 46, 46);
  }
</style>
