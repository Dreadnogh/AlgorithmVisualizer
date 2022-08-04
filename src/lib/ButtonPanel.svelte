<script>
  import { animationSpeed, interactState } from "./stores/algSettingsStore";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  function startSearch() {
    dispatch("startSearch");
  }
  function clearPath() {
    dispatch("clearPath");
  }
  function resetBoard() {
    dispatch("resetBoard");
  }

  export let actionsCounter = 0;
  const states = ["wall", "eraser", "setStart", "setFinish"];
  const controls = [
    { name: "Start", func: startSearch },
    { name: "Clear Path", func: clearPath },
    { name: "Clear Board", func: resetBoard },
  ];
</script>

<div class="button-panel">
  {#each controls as { name, func }}
    <button on:click={() => func()}>{name}</button>
  {/each}
</div>
<div class="button-panel">
  {#each states as state}
    <button
      class:selected={$interactState === state}
      on:click={() => ($interactState = state)}>{state}</button
    >
  {/each}
</div>

<div class="slidecontainer">
  <p style="font-weight:bold">Animation Delay(ms): {$animationSpeed}</p>
  <input
    style="max-width: 35%"
    bind:value={$animationSpeed}
    type="range"
    min="1"
    max="100"
    class="slider"
    id="myRange"
  />
</div>
<p style="font-weight:bold">Actions Counter: {actionsCounter}</p>

<style>
  .button-panel {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    flex-wrap: wrap;
    row-gap: 5px;
    column-gap: 2px;
    padding-bottom: 5px;
  }

  button {
    text-transform: capitalize;
    background-color: var(--clrBtn);
    border: none;
    color: white;
    padding: 12px 16px;
    text-align: center;
    font-size: 17px;
    cursor: pointer;
    font-weight: 400;
    min-width: 7vw;
  }

  button.selected {
    background-color: lightslategray;
    border-inline: 1rem solid var(--clrBtn);
    font-weight: bold;
  }

  button:hover {
    background-color: RoyalBlue;
  }

  p {
    color: var(--clrText);
  }

  .slider {
    -webkit-appearance: none;
    width: 100%;
    height: 15px;
    border-radius: 5px;
    background: #cccccc;
    outline: none;
    opacity: 0.7;
    -webkit-transition: 0.2s;
    transition: opacity 0.2s;
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: var(--clrBtn);
    cursor: pointer;
  }

  .slider::-moz-range-thumb {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: var(--clrBtn);
    cursor: pointer;
  }
</style>
