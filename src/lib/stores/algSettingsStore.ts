import { writable } from "svelte/store";

export let animationSpeed = writable(15);
export let interactState = writable("wall");
export let selectedAlgorithm = writable("");
