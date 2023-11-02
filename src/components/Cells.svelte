<script lang="ts">
  import { fade } from "svelte/transition";
  import { weeksSinceBirth } from "../utils/dob";

  export let grid: any;
  export let dateOfBirth: string;
</script>

{#each grid as row, rowIndex (row)}
  <div class="row" data-row={rowIndex}>
    {#each row as { color }, colIndex (colIndex)}
      <div
        class="cell"
        style="background-color: rgb({color.r},{color.g},{color.b})"
        data-column={colIndex}
      />
    {/each}
  </div>
{/each}
<div
  class="my-4 flex flex-col break-all text-center tracking-[0.001rem]"
  in:fade
>
  <span>
    {(weeksSinceBirth(dateOfBirth) || 0).toLocaleString()} weeks of memories sweet,
  </span>
  <span>with every step, your life's a treat!</span>
</div>
