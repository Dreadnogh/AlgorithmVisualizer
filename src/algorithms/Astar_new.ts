function init(grid) {
  for (var x = 0; x < grid.length; x++) {
    for (var y = 0; y < grid[x].length; y++) {
      grid[x][y].f = null;
      grid[x][y].g = null;
      grid[x][y].h = null;
      grid[x][y].debug = "";
    }
  }
}

export function startAstar(grid, start, end) {
  init(grid);
  let visitedNodesInOrder = [];
  var openList = [];
  var closedList = [];
  openList.push(start);

  while (openList.length > 0) {
    // Grab the lowest f(x) to process next
    var lowInd = 0;
    for (var i = 0; i < openList.length; i++) {
      if (openList[i].f < openList[lowInd].f) {
        lowInd = i;
      }
    }
    var currentNode = openList[lowInd];
    visitedNodesInOrder.push(currentNode);
    // End case -- result has been found, return the traced path
    if (currentNode.col == end.col && currentNode.row == end.row) {
      console.log("done");
      return visitedNodesInOrder;
    }

    // Normal case -- move currentNode from open to closed, process each of its neighbors
    //remove currentNode from openlist
    let index = openList.indexOf(currentNode);
    openList.splice(index, 1);

    closedList.push(currentNode);
    let neighbors = getNeighbors(grid, currentNode);

    for (var i = 0; i < neighbors.length; i++) {
      var neighbor = neighbors[i];
      if (closedList.includes(neighbor) || neighbor.isWall) {
        // not a valid node to process, skip to next neighbor
        continue;
      }

      // g score is the shortest distance from start to current node, we need to check if
      //   the path we have arrived at this neighbor is the shortest one we have seen yet
      var gScore = currentNode.g + 1; // 1 is the distance from a node to it's neighbor
      var gScoreIsBest = false;

      if (!openList.includes(neighbor)) {
        // This the the first time we have arrived at this node, it must be the best
        // Also, we need to take the h (heuristic) score since we haven't done so yet

        gScoreIsBest = true;
        neighbor.h = heuristic(neighbor, end);
        openList.push(neighbor);
      } else if (gScore < neighbor.g) {
        // We have already seen the node, but last time it had a worse g (distance from start)
        gScoreIsBest = true;
      }

      if (gScoreIsBest) {
        // Found an optimal (so far) path to this node.   Store info on how we got here and
        //  just how good it really is...
        neighbor.previousNode = currentNode;
        neighbor.g = gScore;
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.debug =
          "F: " +
          neighbor.f +
          "<br />G: " +
          neighbor.g +
          "<br />H: " +
          neighbor.h;
      }
    }
  }

  // No result was found -- empty array signifies failure to find path
  return [];
}

function heuristic(pos0, pos1) {
  // This is the Manhattan distance
  var d1 = Math.abs(pos1.row - pos0.row);
  var d2 = Math.abs(pos1.col - pos0.col);
  return d1 + d2;
}

function getNeighbors(grid, node) {
  var neighbors = [];
  const { col, row } = node;

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors;
}

export function getNodesInShortestPathOrderAstar(finishNode, nodeGrid) {
  console.log("Started to find shortest path");

  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
