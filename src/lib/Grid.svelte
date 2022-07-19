<script lang="ts">
  let START_NODE_ROW = 10;
  let START_NODE_COL = 10;
  let FINISH_NODE_ROW = 25;
  let FINISH_NODE_COL = 25;
  let grid = [40, 40];
  $: MAX_col = `repeat(${grid[1]}, 1fr)`;
  $: MAX_row = `repeat(${grid[0]}, 1fr)`;
  let nodeGrid = [];
  let currentNode = null;

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
    console.log(nodeGrid);
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
        const visitedNodesInOrder = startDijkstra();
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(
          nodeGrid[FINISH_NODE_COL][FINISH_NODE_ROW]
        );
        animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
        break;

      default:
        break;
    }
  }

  function startDijkstra() {
    const visitedNodesInOrder = [];
    nodeGrid[START_NODE_COL][START_NODE_ROW].distance = 0;
    console.log(
      "Start node distance: " +
        nodeGrid[START_NODE_COL][START_NODE_ROW].distance
    );
    //currentNode.distance = 0;
    const unvisitedNodes = getAllNodes(nodeGrid);

    while (!!unvisitedNodes.length) {
      console.log("Started traverse grid...");
      sortNodesByDistance(unvisitedNodes);
      const closestNode = unvisitedNodes.shift();
      console.log("Distance of current node: " + closestNode.distance);
      // If we encounter a wall, we skip it.
      if (closestNode.isWall) continue;
      // If the closest node is at a distance of infinity,
      // we must be trapped and should therefore stop.
      if (closestNode.distance === Infinity) return visitedNodesInOrder;
      closestNode.isVisited = true;
      //addVisitedClass(closestNode);
      visitedNodesInOrder.push(closestNode);
      if (closestNode === nodeGrid[FINISH_NODE_COL][FINISH_NODE_ROW]) {
        console.log("Found finish node");
        return visitedNodesInOrder;
      }
      updateUnvisitedNeighbors(closestNode, nodeGrid);
    }
  }

  function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
  }

  function addVisitedClass(node) {
    let element = document.getElementById(node.col + "_" + node.row);
    element.classList.add("visited");
  }

  function addShortestNodeClass(node) {
    let element = document.getElementById(node.col + "_" + node.row);
    element.classList.add("shortest");
  }

  function updateUnvisitedNeighbors(node, grid) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
      neighbor.distance = node.distance + 1;
      neighbor.previousNode = node;
    }
  }

  function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const { col, row } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter((neighbor) => !neighbor.isVisited);
  }

  function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid) {
      for (const node of row) {
        nodes.push(node);
      }
    }
    return nodes;
  }

  function getNodesInShortestPathOrder(finishNode) {
    console.log("Started to find shortest path");

    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    console.log(
      "previous node: " +
        currentNode.previousNode.col +
        " ---- " +
        currentNode.previousNode.row
    );
    while (currentNode !== null) {
      console.log(
        "Current node coords: " + currentNode.col + " -- " + currentNode.row
      );
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
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
</script>

<button on:click={() => startSearch("dijkstra")}>Start</button>
<div class="grid">
  <div
    class="container"
    style="grid-template-rows: {MAX_row} ; grid-template-columns: {MAX_col};"
  >
    {#each nodeGrid as currRow, i (i)}
      {#each currRow as currNode, j (j)}
        <div
          id="{i}_{j}"
          class:visited={false}
          class:shortest={false}
          class:finish={currNode.isFinish}
          class:start={currNode.isStart}
        />
      {/each}
    {/each}
  </div>
</div>

<style>
  .container {
    display: grid;
    border: 1px solid #999;
    border-radius: 2px;
    width: 100%;
    height: 800px;
    grid-gap: 1px;
    background: #999;
  }

  .container div {
    background: #fff;
  }

  .container div.visited {
    background: var(--clrVisited);
  }

  .container div.shortest {
    background: rgba(255, 106, 136, 0.842);
  }

  .container div.finish {
    background: red;
  }

  .container div.start {
    background: green;
  }
</style>
