<script lang="ts">
  let START_NODE_ROW = 3;
  let START_NODE_COL = 0;
  let FINISH_NODE_ROW = 10;
  let FINISH_NODE_COL = 7;
  let grid = [40, 40];
  $: MAX_col = `repeat(${grid[1]}, 1fr)`;
  $: MAX_row = `repeat(${grid[0]}, 1fr)`;
  let nodes = [];
  var currentNode = createNode(0, 0);

  //Setup 2D grid array
  for (let i = 0; i < grid[0]; i++) {
    let currentRow = [];
    for (let j = 0; j < grid[1]; j++) {
      currentNode = createNode(i, j);
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
    let START_POS = [START_NODE_COL, START_NODE_ROW];
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
