export function startDijkstra(nodeGrid, START_NODE, FINISH_NODE) {
  const visitedNodesInOrder = [];
  nodeGrid[START_NODE.row][START_NODE.col].distance = 0;
  const unvisitedNodes = getAllNodes(nodeGrid);
  console.log("Started traverse grid...");
  while (!!unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();
    // If node is a wall, we skip it.
    if (closestNode.isWall) {
      console.log('This node is a wall.');
      continue;
    } else {

      
      // If the closest node is at a distance of infinity,we are stuck and must break
      if (closestNode.distance === Infinity) return visitedNodesInOrder;
      closestNode.visited = true;
      
      visitedNodesInOrder.push(closestNode);
      if (closestNode === nodeGrid[FINISH_NODE.row][FINISH_NODE.col]) {
        console.log("Found finish node");
        return visitedNodesInOrder;
      }
    }
    updateUnvisitedNeighbors(closestNode, nodeGrid);
  }
}

function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
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
  return neighbors.filter((neighbor) => !neighbor.visited);
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

export function getNodesInShortestPathOrderDijkstra(finishNode) {
  console.log("Started to find shortest path");

  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;

  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
