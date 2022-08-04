<script>
  import { selectedAlgorithm } from "./stores/algSettingsStore";
  let options = ["a*", "dijkstra", "unweighted", "weighted"];
</script>

<div class="header">
  <label
    >Algorithm
    <select id="algSelector" bind:value={$selectedAlgorithm}>
      <option value="" disabled selected>Select your option</option>
      {#each options as item}
        <option value={item}>{item}</option>
      {/each}
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
