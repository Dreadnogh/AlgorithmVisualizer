<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let startPressed = false;
  function startSearch() {
    startPressed = true;
  }
</script>

<div class="header">
  <label
    >Algorithm
    <select id="algSelector">
      <option value="" disabled selected>Select your option</option>
      <option value="astar">A*</option>
      <option value="dijkstra">Dijkstra</option>
      <option value="unweighted">Unweighted</option>
      <option value="weighted">Weighted</option>
    </select>
  </label>
</div>

<style>
  .header {
    font-weight: bold;
    height: 40px;
    background: rgb(0, 188, 221);
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    align-content: center;
    flex-direction: row;
    width: 100%;
  }
</style>
