<script lang="ts">
  let START_NODE_ROW = 1;
  let START_NODE_COL = 3;
  let FINISH_NODE_ROW = 10;
  let FINISH_NODE_COL = 7;
  let grid = [40, 40];
  $: MAX_col = `repeat(${grid[1]}, 1fr)`;
  $: MAX_row = `repeat(${grid[0]}, 1fr)`;
  let nodes = [];
  let currentNode = null;
  let currentPaths = [];
  let previousNode = null;

  //Setup 2D grid array
  for (let i = 0; i < grid[0]; i++) {
    let currentRow = [];
    for (let j = 0; j < grid[1]; j++) {
      currentNode = createNode(j, i);
      currentRow.push(currentNode);
    }
    nodes.push(currentRow);
  }

  function createNode(row: number, col: number) {
    console.log(nodes);
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
        startDijkstra();
        break;

      default:
        break;
    }
  }

  function startDijkstra() {
    currentNode = nodes[START_NODE_COL][START_NODE_ROW];
    currentNode.distance = 0;

    var interval = setInterval(() => {
      addVisitedClass();
      console.log("Current node: " + currentNode.col + " " + currentNode.row);
      currentPaths = [];
      addPaths();
      previousNode = currentNode;
      currentNode = currentPaths.pop();
      currentNode.previousNode = previousNode;
      if (currentNode !== undefined) {
        if (currentNode.isFinish) {
          console.log("Clear interval");
          clearInterval(interval);
          return;
        }
      }
      console.log("iteration done");
    }, 25);
  }

  function addVisitedClass() {
    currentNode.isVisited = true;
    let element = document.getElementById(
      currentNode.col + "_" + currentNode.row
    );
    element.classList.add("visited");
  }

  function addPaths() {
    //Up
    let up = nodes[currentNode.col + 1][currentNode.row];
    if (up !== undefined && up.isVisited == false) {
      currentPaths.push(up);
    }
    //Down
    let down = nodes[currentNode.col - 1][currentNode.row];
    if (down !== undefined && down.isVisited == false) {
      currentPaths.push(down);
    }
    //Right
    let right = nodes[currentNode.col][currentNode.row + 1];
    if (right !== undefined && right.isVisited == false) {
      currentPaths.push(right);
    }
    //Left
    let left = nodes[currentNode.col][currentNode.row - 1];
    if (left !== undefined && left.isVisited == false) {
      currentPaths.push(left);
    }
    console.log("ey");
  }
</script>

<button on:click={() => startSearch("dijkstra")}>Start</button>
<div class="grid">
  <div
    class="container"
    style="grid-template-rows: {MAX_col} ; grid-template-columns: {MAX_row};"
  >
    {#each nodes as currRow, i (i)}
      {#each currRow as currNode, j (j)}
        <div
          id="{i}_{j}"
          class:visited={currNode.isVisited}
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

  .container div.finish {
    background: red;
  }

  .container div.start {
    background: green;
  }
</style>
