<script lang="ts">
  import { algoStore } from "./algoStore";
  import GridNode from "./GridNode.svelte";
  import type { Node } from "./Models/Models";
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
  let FINISH_NODE_ROW = 13;
  let FINISH_NODE_COL = 13;
  let gridSize = [40, 40];
  if (screen.width < 420) {
    gridSize = [15, 15];
  }
  $: MAX_col = `repeat(${gridSize[1]}, 1fr)`;
  $: MAX_row = `repeat(${gridSize[0]}, 1fr)`;
  let nodeGrid: Node[][] = [];
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
    for (let i = 0; i < gridSize[0]; i++) {
      let currentRow: Node[] = [];
      for (let j = 0; j < gridSize[1]; j++) {
        currentNode = createNode(i, j);
        currentRow.push(currentNode);
      }
      nodeGrid.push(currentRow);
    }
  }

  function createNode(row: number, col: number): Node {
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

  function interact(event) {
    let currNode = event.detail.currNode;
    if (!currNode) return;
    switch (interactState) {
      case "wall":
        setWall(currNode);
        break;
      case "setStart":
        setStart(currNode);
        clearPath();
        break;
      case "setFinish":
        setFinish(currNode);
        clearPath();
        break;
      case "weight":
        break;
      case "eraser":
        remove(currNode);
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
        n.distance = Infinity;
        n.previousNode = null;
        return n;
      })
    );

    reset++;
  }

  function startSearch() {
    clearPath();
    let algorithm = $algoStore;
    let visitedNodesInOrder = [];
    let nodesInShortestPathOrder = [];
    let startNode = nodeGrid[START_NODE_ROW][START_NODE_COL];
    let finishNode = nodeGrid[FINISH_NODE_ROW][FINISH_NODE_COL];
    switch (algorithm) {
      case "":
        visitedNodesInOrder = startAstar(nodeGrid, startNode, finishNode);
        nodesInShortestPathOrder = getNodesInShortestPathOrderAstar(
          finishNode,
          nodeGrid
        );
        animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
        break;
      case "dijkstra":
        visitedNodesInOrder = startDijkstra(nodeGrid, startNode, finishNode);
        nodesInShortestPathOrder = getNodesInShortestPathOrderDijkstra(
          finishNode
        );
        animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
        break;

      case "a*":
        visitedNodesInOrder = startAstar(nodeGrid, startNode, finishNode);
        nodesInShortestPathOrder = getNodesInShortestPathOrderAstar(
          finishNode,
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

  function setWall(currNode: Node) {
    let { row, col } = currNode;
    if (currNode.isFinish) return;
    if (currNode.isStart) return;
    nodeGrid[row][col].isWall = true;
  }

  function remove(currNode: Node) {
    let { row, col } = currNode;
    nodeGrid[row][col].isWall = false;
    nodeGrid[row][col].isFinish = false;
    nodeGrid[row][col].isStart = false;
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
        <GridNode {currNode} {mouseDown} on:interact={interact} />
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

  /* ########## MOBILE DEVICE ########## */
  @media only screen and (max-device-width: 480px) {
    .container {
      display: grid;
      border: 2px solid rgb(0, 0, 0);
      border-radius: 5px;
      width: 100%;
      grid-gap: 0px;
      row-gap: 0px;
      height: 400px;
      background: rgb(255, 255, 255);
    }
  }
</style>
