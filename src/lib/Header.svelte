<script>
  import { selectedAlgorithm } from "./stores/algSettingsStore";
  let options = ["a*", "dijkstra", "unweighted", "weighted"];
</script>

<div class="header">
  <label style="color:black"
    >Algorithm
    <select id="algSelector" bind:value={$selectedAlgorithm}>
      <option value="" disabled selected>Select your option</option>
      {#each options as item}
        <option value={item}>{item[0].toUpperCase() + item.slice(1)}</option>
      {/each}
    </select>
  </label>
</div>

<style>
  .header {
    font-weight: bold;
    height: 30px;
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
