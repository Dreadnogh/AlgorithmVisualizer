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
  let reset = 0;
  let runningTimeouts = [];

  let mouseDown = false;
  createGrid();
  //Setup 2D grid array
  function createGrid() {
    nodeGrid = [];
    for (let i = 0; i < grid[0]; i++) {
      let currentRow = [];
      for (let j = 0; j < grid[1]; j++) {
        currentNode = createNode(i, j);
        currentRow.push(currentNode);
      }
      nodeGrid.push(currentRow);
    }
  }

  function resetBoard() {
    runningTimeouts.forEach((t) => clearTimeout(t));
    createGrid();
    reset++;
  }

  function clearPath() {
    runningTimeouts.forEach((t) => clearTimeout(t));
    nodeGrid.forEach((e) =>
      e.forEach((n) => {
        n.isVisited = false;
        n.distance = Infinity;
        n.previousNode = null;
      })
    );
    reset++;
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

  function startSearch() {
    let algorithm = document.getElementById("algSelector") as HTMLSelectElement;
    switch (algorithm.value) {
      case "":
        alert("Select an algorithm");
        break;
      case "dijkstra":
        console.table(nodeGrid[10][12]);
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
        runningTimeouts.push(
          setTimeout(() => {
            animateShortestPath(nodesInShortestPathOrder);
          }, 15 * i)
        );
        return;
      }

      //Animate visited nodes
      runningTimeouts.push(
        setTimeout(() => {
          const node = visitedNodesInOrder[i];
          console.log("Current node to animate: " + node);
          if (node != undefined) addVisitedClass(node);
        }, 15 * i)
      );
    }
  }

  function animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      runningTimeouts.push(
        setTimeout(() => {
          const node = nodesInShortestPathOrder[i];
          addShortestNodeClass(node);
        }, 50 * i)
      );
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
    console.log("clicked node");
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

  document.body.onmousedown = () => {
    console.log("Fired mouse event");
    mouseDown = true;
  };

  document.body.onmouseup = () => {
    mouseDown = false;
  };
</script>

<div id="button-panel" style="padding-bottom: 5px">
  <button on:click={() => startSearch()}>Start</button>
  {#if interactState == "wall"}
    <button
      style="background-color:lightslategray; border-inline: 1rem solid black;"
      on:click={() => (interactState = "wall")}>Wall</button
    >
  {:else}
    <button on:click={() => (interactState = "wall")}>Wall</button>
  {/if}

  {#if interactState == "eraser"}
    <button
      style="background-color:lightslategray; border-inline: 1rem solid black;"
      on:click={() => (interactState = "eraser")}>Eraser</button
    >
  {:else}
    <button on:click={() => (interactState = "eraser")}>Eraser</button>
  {/if}

  <button on:click={() => clearPath()}>Clear Path</button>
  <button on:click={() => resetBoard()}>Clear Board</button>
</div>
{#key reset}
  <div
    ondragstart="return false;"
    ondrop="return false;"
    class="grid"
    style="display: flex; justify-content: center;"
  >
    <div
      class="container"
      style="grid-template-rows: {MAX_row} ; grid-template-columns: {MAX_col};"
    >
      {#each nodeGrid as currRow, i (i)}
        {#each currRow as currNode, j (j)}
          <div class="gridBox">
            <div
              class="gridNode"
              on:mousemove={(e) => interact(e)}
              on:mousedown={(e) => interact(e)}
              id="{j}_{i}"
              class:visited={false}
              class:shortest={false}
              class:finish={currNode.isFinish}
              class:start={currNode.isStart}
              class:wall={currNode.isWall}
            />
          </div>
        {/each}
      {/each}
    </div>
  </div>
{/key}

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

  .container div.gridBox {
    background-color: #ffffff;
    outline: 1px solid black;
    height: 20px;
    width: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .container div.gridNode {
    background-color: rgb(255, 255, 255);
    width: 100%;
    height: 100%;
  }

  .container div.gridNode.finish {
    background-color: red;
  }

  .container div.gridNode.start {
    background-color: green;
  }

  .container div.wall {
    background-color: rgb(46, 46, 46);
  }

  .container div:hover {
    background-color: rgb(163, 163, 163);
  }

  button {
    background-color: DodgerBlue;
    border: none;
    color: white;
    padding: 12px 16px;
    text-align: center;
    font-size: 17px;
    cursor: pointer;
    font-weight: 400;
  }

  button:hover {
    background-color: RoyalBlue;
  }

  /* ########## ANIMATION CSS ##########  */
  @keyframes shortestPathGlow {
    from {
      background-color: #ffcccc;
    }
    to {
      background-color: rgba(255, 106, 136, 0.842);
    }
  }

  @keyframes transitionColor {
    0% {
      background: rgb(0, 69, 173);
      border-radius: 100%;
      transform: scale(0.2);
    }
    50% {
      background: rgb(49, 197, 165);
      border-radius: 45%;
    }
    100% {
      background: var(--clrVisited);
      border-radius: 0%;
      transform: scale(0.9);
      /*transform: rotate(360deg);*/
    }
  }

  .container div.visited {
    background-color: var(--clrVisited);
    animation-name: transitionColor;
    animation-duration: 1.3s;
  }

  .container div.shortest {
    background-color: rgba(255, 106, 136, 0.842);
    animation-name: shortestPathGlow;
    animation-duration: 3s;
    animation-iteration-count: infinite;
  }
</style>
