<script lang="ts">
  import Header from "./lib/Header.svelte";
  import Grid from "./lib/Grid.svelte";
  import Footer from "./lib/Footer.svelte";

  let HeaderComponent;
</script>

<main>
  <Header bind:this={HeaderComponent} />
  <Grid />
  <Footer />
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    --clrVisited: rgb(89, 212, 228);
    --clrBtn: DodgerBlue;
    --clrBackground: rgb(81, 81, 104);
    --clrText: white;
    --clrOutline: rgba(95, 95, 95, 0.555);
    --clrGridBackground: rgb(255, 255, 255);
  }

  main {
    text-align: center;
    margin: 0;
    color: var(--clrText);
  }
</style>
