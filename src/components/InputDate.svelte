<script lang="ts">
  import IMask from "imask";
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  export let hasBase64Image: number;

  const dispatch = createEventDispatcher();

  let dateValue = "";
  let dateMask;

  let inputElement: any = undefined; // Reference to the input element

  // change to vanilla instead
  function setupMask() {
    dateMask = IMask(inputElement, {
      mask: Date, // enable date mask
      pattern: "d/`m/`Y",

      min: new Date(1945, 0, 1),
      max: new Date(2024, 0, 1),
      lazy: true,
      blocks: {
        d: {
          mask: IMask.MaskedRange,
          from: 1,
          to: 31,
          maxLength: 2,
        },
        m: {
          mask: IMask.MaskedRange,
          from: 1,
          to: 12,
          maxLength: 2,
        },
        Y: {
          mask: IMask.MaskedRange,
          from: 1900,
          to: 9999,
        },
      },
      format: (date: any) => {
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        if (day < 10) day = "0" + day;
        if (month < 10) month = "0" + month;

        const result = [day, month, year].join("/");

        dispatch("dateChanged", result);
        return result;
      },

      // define str -> date convertion
      parse: (str: any) => {
        const dateParts = str.split("/");
        const day = parseInt(dateParts[0], 10); // Parse the day as an integer
        const month = parseInt(dateParts[1], 10); // Parse the month as an integer
        const year = parseInt(dateParts[2], 10); // Parse the year as an integer

        return new Date(year, month - 1, day); // Note: Months are zero-based, so we subtract 1 from the month
      },
    });
  }

  $: {
    if (dateValue.length < 10) {
      const currentDate = new Date();
      const day = String(currentDate.getDate()).padStart(2, "0");
      const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
      const year = currentDate.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;

      dispatch("dateChanged", formattedDate);
    }
  }
</script>

{#if Boolean(hasBase64Image)}
  <input
    in:fade
    style="padding: 0.75rem 1rem; font-size: 1.25rem; text-align: center; outline: none"
    type="text"
    placeholder="DD/MM/YYYY"
    bind:this={inputElement}
    bind:value={dateValue}
    on:input={setupMask}
  />
{/if}
