<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let mouseDown = false;
  export let currNode;
  let oldNode = null;
  function interact(e, currNode) {
    oldNode = currNode;
    dispatch("interact", {
      e,
      currNode,
    });
  }
</script>

<div class="gridBox">
  <div
    id={currNode.row + "_" + currNode.col}
    class="gridNode"
    on:mousemove={(e) => {
      if (mouseDown) interact(e, currNode);
    }}
    on:mousedown={(e) => interact(e, currNode)}
    class:wall={currNode.isWall}
    class:visited={currNode.isVisited}
    class:shortest={currNode.shortest}
    class:finish={currNode.isFinish}
    class:start={currNode.isStart}
  />
</div>

<style>
  div.gridBox {
    background: var(--clrGridBackground);
    outline: 1px solid var(--clrOutline);
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  div.gridNode {
    background: var(--clrGridBackground);
    width: 100%;
    height: 100%;
  }

  div.gridNode.finish {
    background-color: red;
  }

  div.gridNode.start {
    background-color: green;
  }

  div.gridNode:hover {
    background-color: rgb(163, 163, 163);
  }

  div.gridNode.wall {
    animation-name: addWallAnimation;
    animation-duration: 0.2s;
    background-color: rgb(46, 46, 46) !important;
  }

  div.visited {
    background: radial-gradient(var(--clrVisited), #88fff5);
    animation-name: transitionColor;
    animation-duration: 1.5s;
  }

  div.shortest {
    background-color: rgba(255, 106, 136, 0.842);
    animation-name: shortestPathGlow;
    animation-duration: 3s;
    animation-iteration-count: infinite;
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
      height: 100%;
      width: 100%;
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
</style>
