export interface Node {
    row: number,
      col: number,
      isStart: boolean,
      isFinish: boolean,
      isVisited: boolean,
      distance: number,
      isWall: boolean,
      previousNode: Node,
      shortest: boolean,
}

export interface Grid {
    nodes: Node[],
}