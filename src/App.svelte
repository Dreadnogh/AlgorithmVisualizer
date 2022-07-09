<script lang="ts">
  import Header from "./lib/Header.svelte";
  import Grid from "./lib/Grid.svelte";

  let HeaderComponent;
</script>

<main>
  <Header bind:this={HeaderComponent} />
  <Grid />
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    --clrVisited: rgb(27, 203, 226);
  }

  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }
</style>
