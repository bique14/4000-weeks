<script lang="ts">
  import { fade } from "svelte/transition";

  import Disclaimer from "./components/Disclaimer.svelte";
  import InputDate from "./components/InputDate.svelte";
  import InputFile from "./components/InputFile.svelte";

  import { weeksSinceBirth } from "./utils/dob";
  import { createArray } from "./utils/array";

  import "./app.css";
  import { onMount } from "svelte";

  const numRows: number = 77;
  const numColumns: number = 52;
  const lastRowColumns: number = 48; // Number of columns in the last row

  let fileName = "";
  let base64Image = "";
  let dateOfBirth = "";
  let colors: any = [[]];

  let userConsent: boolean = false;

  onMount(() => {
    const isConsent = sessionStorage.getItem("user_consent");
    userConsent = isConsent === "true";
  });

  $: grid = calculateGrid(dateOfBirth);
  $: {
    if (base64Image) {
      fetchImagePixels(base64Image);
    }
  }
  // $: console.log("colors", colors);

  // Generate a 2D array representing the grid
  const _grid = createArray(numRows - 1).map(() => createArray(numColumns));
  const lastRow = createArray(lastRowColumns);

  const combineGrid = [..._grid, lastRow];

  // note: all grid is 4000
  const calculateGrid = (dateOfBirth: string) => {
    return combineGrid.map((row, rowIndex) => {
      return row.map((cell, columnIndex) => {
        return {
          color:
            rowIndex * numColumns + columnIndex <
            (+weeksSinceBirth(dateOfBirth) || 0)
              ? colors[rowIndex][columnIndex]
              : { r: 255, g: 255, b: 255 },
        };
      });
    });
  };

  const onConsentClick = () => {
    sessionStorage.setItem("user_consent", JSON.stringify(true));
    userConsent = true;
  };

  const handleDateChanged = (event: any) => {
    dateOfBirth = event.detail;
  };

  const handleFileChanged = (event: any) => {
    const { name, file } = event.detail;
    base64Image = file;
    fileName = name;
  };

  const fetchImagePixels = async (base64Image: string) => {
    const response = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: JSON.stringify({ image: base64Image }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    console.log("result", result);
    colors = result;
  };
</script>

{#if !Boolean(userConsent)}
  <Disclaimer on:click={onConsentClick} />
{:else}
  <div class="wrapper">
    <h1 style="font-weight: 400">4,000 weeks of life</h1>
    <div style="display: flex; gap: 2rem; padding: 1rem 0;">
      <InputFile on:fileChanged={handleFileChanged} />
      <InputDate
        hasBase64Image={base64Image.length}
        on:dateChanged={handleDateChanged}
      />
    </div>

    <div style="min-width: 21px; min-height: 21px">
      {#if fileName}
        <span
          style="display: block; max-width: 400px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
          in:fade>file name : {fileName}</span
        >
      {/if}
    </div>
    <div style="margin: 1rem 0;">
      {#each grid as row, rowIndex (row)}
        <div class="row" data-row={rowIndex}>
          {#each row as color, colIndex (colIndex)}
            <div
              class="cell"
              style="background-color: rgb({color.color.r},{color.color
                .g},{color.color.b})"
              data-column={colIndex}
            />
          {/each}
        </div>
      {/each}
    </div>
  </div>
{/if}
