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
<span
  class="my-4 block break-all text-center tracking-[0.001rem]"
  style="font-variant: normal !important;  -webkit-font-variant: normal !important; font-variant-ligatures: none !important;  -webkit-font-variant-ligatures: none !important; "
  in:fade
>
  {(weeksSinceBirth(dateOfBirth) || 0).toLocaleString()} weeks of memories sweet,
  <br />with every step, your life's a treat!
</span>
