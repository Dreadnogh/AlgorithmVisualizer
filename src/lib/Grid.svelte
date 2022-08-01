<script lang="ts">
  import { is_empty } from "svelte/internal";

  import {
    startDijkstra,
    getNodesInShortestPathOrderDijkstra,
  } from "../algorithms/Dijkstra.js";

  import {
    startAstar,
    getNodesInShortestPathOrderAstar,
  } from "../algorithms/Astar.js";
  let START_NODE_ROW = 5;
  let START_NODE_COL = 4;
  let FINISH_NODE_ROW = 14;
  let FINISH_NODE_COL = 15;
  let grid = [40, 40];
  if (screen.width < 420) {
    grid = [25, 25];
  }
  $: MAX_col = `repeat(${grid[1]}, 1fr)`;
  $: MAX_row = `repeat(${grid[0]}, 1fr)`;
  let nodeGrid = [];
  let currentNode = null;
  let interactState = "wall";
  let runningTimeouts = [];
  let mouseDown = false;
  let actionsCounter = 0;
  let animationSpeed = 15;
  let reset = 0;

  //Setup initial grid
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
      shortest: false,
    };
  }

  function interact(e, currNode) {
    switch (interactState) {
      case "wall":
        if (currNode) setWall(currNode);
        break;
      case "setStart":
        if (currNode) setStart(currNode);
        clearPath();
        break;
      case "setFinish":
        if (currNode) setFinish(currNode);
        clearPath();
        break;
      case "weight":
        break;
      case "eraser":
        if (currNode) remove(currNode);
        break;
      default:
        break;
    }
  }

  function resetBoard() {
    actionsCounter = 0;
    runningTimeouts.forEach((t) => clearTimeout(t));
    createGrid();
    reset++;
  }

  function clearPath() {
    actionsCounter = 0;
    runningTimeouts.forEach((t, i) => clearTimeout(t));
    nodeGrid = nodeGrid.map((e) =>
      e.map((n) => {
        n.isVisited = false;
        n.shortest = false;
        return n;
      })
    );
    reset++;
  }

  function startSearch() {
    let algorithm = document.getElementById("algSelector") as HTMLSelectElement;
    let visitedNodesInOrder = [];
    let nodesInShortestPathOrder = [];
    switch (algorithm.value) {
      case "":
        alert("Select an algorithm");
        break;
      case "dijkstra":
        visitedNodesInOrder = startDijkstra(
          nodeGrid,
          nodeGrid[START_NODE_ROW][START_NODE_COL],
          nodeGrid[FINISH_NODE_ROW][FINISH_NODE_COL]
        );
        nodesInShortestPathOrder = getNodesInShortestPathOrderDijkstra(
          nodeGrid[FINISH_NODE_ROW][FINISH_NODE_COL]
        );
        animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
        break;

      case "astar":
        visitedNodesInOrder = startAstar(
          nodeGrid,
          nodeGrid[START_NODE_ROW][START_NODE_COL],
          nodeGrid[FINISH_NODE_ROW][FINISH_NODE_COL]
        );
        nodesInShortestPathOrder = getNodesInShortestPathOrderAstar(
          nodeGrid[FINISH_NODE_ROW][FINISH_NODE_COL],
          nodeGrid
        );
        animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
        break;

      default:
        break;
    }
  }

  function setStart(currNode) {
    let { row, col } = currNode;
    //Remove old start
    nodeGrid[START_NODE_ROW][START_NODE_COL].isStart = false;

    //Add new start
    START_NODE_ROW = row;
    START_NODE_COL = col;
    nodeGrid[START_NODE_ROW][START_NODE_COL].isStart = true;
  }

  function setFinish(currNode) {
    let { row, col } = currNode;
    //Remove old start
    nodeGrid[FINISH_NODE_ROW][FINISH_NODE_COL].isFinish = false;

    //Add new start
    FINISH_NODE_ROW = row;
    FINISH_NODE_COL = col;
    nodeGrid[FINISH_NODE_ROW][FINISH_NODE_COL].isFinish = true;
  }

  function setWall(currNode) {
    let { row, col } = currNode;
    if (currNode.isFinish) return;
    if (currNode.isStart) return;
    nodeGrid[row][col].isWall = true;
  }

  function remove(currNode) {
    let { row, col } = currNode;
    nodeGrid[row][col].isWall = false;
    nodeGrid[row][col].isFinish = false;
    nodeGrid[row][col].isStart = false;
  }

  function getElementID(element) {
    let id = null;
    if (element instanceof TouchEvent) {
      let currentHover = element.changedTouches[0];
      let currentObj = document.elementFromPoint(
        currentHover.clientX,
        currentHover.clientY
      );
      id = currentObj.id;
    } else {
      id = element.srcElement.id;
    }
    return id;
  }

  document.body.onmousedown = () => {
    mouseDown = true;
  };

  document.body.onmouseup = () => {
    mouseDown = false;
  };

  // ################ ANIMATION ################
  function animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      //Animate shortest path nodes
      if (i === visitedNodesInOrder.length) {
        runningTimeouts.push(
          setTimeout(() => {
            animateShortestPath(nodesInShortestPathOrder);
          }, animationSpeed * i)
        );
        return;
      }

      //Animate visited nodes
      runningTimeouts.push(
        setTimeout(() => {
          actionsCounter++;
          const node = visitedNodesInOrder[i];
          if (node != undefined) addVisitedClass(node);
        }, animationSpeed * i)
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
      nodeGrid[node.row][node.col].isVisited = true;
    }
  }

  function addShortestNodeClass(node) {
    if (
      node != nodeGrid[START_NODE_ROW][START_NODE_COL] &&
      node != nodeGrid[FINISH_NODE_ROW][FINISH_NODE_COL]
    ) {
      nodeGrid[node.row][node.col].shortest = true;
    }
  }

  const states = ["wall", "eraser", "setStart", "setFinish"];
  const controls = [
    { name: "Start", func: startSearch },
    { name: "Clear Path", func: clearPath },
    { name: "Clear Board", func: resetBoard },
  ];
</script>

<div class="button-panel">
  {#each controls as { name, func }}
    <button on:click={() => func()}>{name}</button>
    <!-- content here -->
  {/each}
</div>
<div class="button-panel">
  {#each states as state}
    <button
      class:selected={interactState === state}
      on:click={() => (interactState = state)}>{state}</button
    >
  {/each}
</div>
<div class="slidecontainer">
  <p style="font-weight:bold">Animation Delay(ms): {animationSpeed}</p>
  <input
    style="max-width: 35%"
    bind:value={animationSpeed}
    type="range"
    min="1"
    max="100"
    class="slider"
    id="myRange"
  />
</div>
<p style="font-weight:bold">Actions Counter: {actionsCounter}</p>
<div
  draggable="false"
  ondragstart="return false"
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
            on:mousemove={(e) => {
              if (mouseDown) interact(e, currNode);
            }}
            on:touchmove={(e) => {
              let id = getElementID(e);
              interact(e, currNode);
            }}
            on:mousedown={(e) => interact(e, currNode)}
            class:wall={currNode.isWall}
            class:visited={currNode.isVisited}
            class:shortest={currNode.shortest}
            class:finish={currNode.isFinish}
            class:start={currNode.isStart}
          />
        </div>
      {/each}
    {/each}
  </div>
</div>

<style>
  .container {
    display: grid;
    border: 3px solid rgb(0, 0, 0);
    border-radius: 5px;
    width: 800px;
    grid-gap: 0px;
    row-gap: 0px;
    height: 800px;
    background: rgb(255, 255, 255);
  }

  .container div.gridBox {
    background-color: #ffffff;
    outline: 1px solid black;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .container div.gridNode {
    background-color: rgb(255, 255, 255);
    width: 99%;
    height: 99%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .container div.gridNode.finish {
    background-color: red;
  }

  .container div.gridNode.start {
    background-color: green;
  }

  .container div.gridNode.wall {
    animation-name: addWallAnimation;
    animation-duration: 0.2s;
    background-color: rgb(46, 46, 46) !important;
  }

  .container div.gridNode:hover {
    background-color: rgb(163, 163, 163);
  }

  .button-panel {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    flex-wrap: wrap;
    row-gap: 5px;
    column-gap: 2px;
    padding-bottom: 5px;
  }

  button {
    text-transform: capitalize;
    background-color: var(--clrBtn);
    border: none;
    color: white;
    padding: 12px 16px;
    text-align: center;
    font-size: 17px;
    cursor: pointer;
    font-weight: 400;
    min-width: 7vw;
  }

  button.selected {
    background-color: lightslategray;
    border-inline: 1rem solid var(--clrBtn);
    font-weight: bold;
  }

  button:hover {
    background-color: RoyalBlue;
  }

  p {
    color: var(--clrText);
  }

  .slider {
    -webkit-appearance: none;
    width: 100%;
    height: 15px;
    border-radius: 5px;
    background: #cccccc;
    outline: none;
    opacity: 0.7;
    -webkit-transition: 0.2s;
    transition: opacity 0.2s;
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: var(--clrBtn);
    cursor: pointer;
  }

  .slider::-moz-range-thumb {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: var(--clrBtn);
    cursor: pointer;
  }

  /* ########## ANIMATION CSS ##########  */

  @keyframes addWallAnimation {
    0% {
      background-color: rgb(211, 211, 211);
      border-radius: 100%;
      transform: scale(0.2);
    }
    50% {
      background-color: rgb(119, 119, 119);
    }
    100% {
      background-color: rgb(46, 46, 46);
      border-radius: 0%;
      transform: scale(0.9);
      /*transform: rotate(360deg);*/
    }
  }

  .container div.visited {
    background: radial-gradient(var(--clrVisited), #88fff5);
    animation-name: transitionColor;
    animation-duration: 1.5s;
  }

  @keyframes transitionColor {
    0% {
      background: rgb(251, 255, 0);
    }
    2% {
      background: rgb(0, 69, 173);
      border-radius: 100%;
      height: 10%;
      width: 10%;
      /*transform: scale(0.2);*/
    }
    50% {
      height: 80%;
      width: 80%;
      background: rgb(49, 197, 165);
    }
    100% {
      height: 100%;
      width: 100%;
      border-radius: 0%;

      /*background: var(--clrVisited);*/
      /*transform: scale(0.9);*/
    }
  }

  @keyframes shortestPathGlow {
    from {
      background: #ffcccc;
    }
    to {
      background: rgba(255, 106, 136, 0.842);
    }
  }

  .container div.shortest {
    background-color: rgba(255, 106, 136, 0.842);
    animation-name: shortestPathGlow;
    animation-duration: 3s;
    animation-iteration-count: infinite;
  }

  /* ########## MOBILE DEVICE ########## */
  @media only screen and (max-device-width: 480px) {
    .container {
      display: grid;
      grid-auto-rows: 1fr;
      border: 2px solid rgb(0, 0, 0);
      border-radius: 5px;
      width: 100%;
      grid-gap: 0px;
      row-gap: 0px;
      height: 100%;
      background: rgb(255, 255, 255);
      overflow: hidden;
    }
    .container div.gridNode {
      width: 100%px;
      height: 100%px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .container div.gridBox {
      background-color: #ffffff;
      overflow: hidden;
      height: 13px;
      width: 13px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
