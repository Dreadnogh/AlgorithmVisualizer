<script lang="ts">
  import GridNode from "./GridNode.svelte";
  import type { Node } from "./Models/Models";
  import {
    animationSpeed,
    interactState,
    selectedAlgorithm,
  } from "./stores/algSettingsStore";

  import {
    startDijkstra,
    getNodesInShortestPathOrderDijkstra,
  } from "../algorithms/Dijkstra.js";

  import {
    startAstar,
    getNodesInShortestPathOrderAstar,
  } from "../algorithms/Astar.js";

  import ButtonPanel from "./buttonPanel.svelte";
  import { each } from "svelte/internal";

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
  let oldNode = null;
  let runningTimeouts = [];
  let mouseDown = false;
  let actionsCounter = 0;

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

  document.body.onmousedown = () => {
    mouseDown = true;
  };

  document.body.onmouseup = () => {
    mouseDown = false;
  };

  function interact(event) {
    let currNode = event.detail.currNode;
    if (!currNode || currNode === oldNode) return;
    oldNode = currNode;
    switch ($interactState) {
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
  }

  function startSearch() {
    clearPath();
    let algorithm = $selectedAlgorithm;
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

  // ################ ANIMATION ################
  function animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
    let animSpeed = $animationSpeed;

    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      //Animate shortest path nodes
      if (i === visitedNodesInOrder.length) {
        runningTimeouts.push(
          setTimeout(() => {
            animateShortestPath(nodesInShortestPathOrder);
          }, animSpeed * i)
        );
        return;
      }

      //Animate visited nodes
      runningTimeouts.push(
        setTimeout(() => {
          actionsCounter++;
          const node = visitedNodesInOrder[i];
          if (node != undefined) addVisitedClass(node);
        }, animSpeed * i)
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
</script>

<ButtonPanel
  on:startSearch={startSearch}
  on:clearPath={clearPath}
  on:resetBoard={resetBoard}
  {actionsCounter}
/>
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
