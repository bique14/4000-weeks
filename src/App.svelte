<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import html2canvas from "html2canvas";
  import toast, { Toaster } from "svelte-french-toast";

  import { ENDPOINT_URL } from "./utils/env";

  import Disclaimer from "./components/Disclaimer.svelte";
  import InputDate from "./components/InputDate.svelte";
  import InputFile from "./components/InputFile.svelte";
  import Cells from "./components/Cells.svelte";

  import { weeksSinceBirth } from "./utils/dob";
  import { createArray } from "./utils/array";

  import "./app.css";

  const numRows: number = 77;
  const numColumns: number = 52;
  const lastRowColumns: number = 48; // Number of columns in the last row

  let userConsent: boolean = false;

  let isFetchError = false;
  let fileName = "";
  let base64Image = "";
  let dateOfBirth = "";
  let colors: any = [[]];

  let imageContainerRef: HTMLDivElement;

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
            (weeksSinceBirth(dateOfBirth) || 0)
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
    try {
      isFetchError = false;
      const response = await fetch(`${ENDPOINT_URL}/upload`, {
        method: "POST",
        body: JSON.stringify({ image: base64Image }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      colors = result;
    } catch (e: any) {
      console.error("💥", e);
      isFetchError = true;
      toast.error("It didn't works! Try again later.", {
        position: "bottom-center",
      });
    }
  };

  const onCaptureClick = async () => {
    const canvas = await html2canvas(imageContainerRef);
    canvas.toBlob((blob: any) => {
      const description: string = "Here is my journey!";
      shareImage(blob, "4000 weeks of me", description);
    });
  };

  const shareImage = async (blob: Blob, title: string, text: string) => {
    try {
      if (navigator.share) {
        await navigator.share({
          files: [
            new File([blob], "4000-weeks-of-me.png", { type: blob.type }),
          ],
          title: title,
          text: text,
        });
      } else {
        throw new Error("Web Share API is not available.");
      }
    } catch (error) {
      console.error("Error sharing image:", error);
    }
  };
</script>

<Toaster />
{#if !Boolean(userConsent)}
  <Disclaimer on:click={onConsentClick} />
{:else}
  <div class="wrapper">
    <h1 class="text-3xl my-4">4,000 weeks of life</h1>
    {#if fileName && !isFetchError}
      <span class="italic text-[#999999] text-center whitespace-nowrap">
        you can select a new image or change the date of birth.
      </span>
    {/if}
    <div class="flex gap-8 py-4">
      <InputFile on:fileChanged={handleFileChanged} />
      {#if !isFetchError}
        <InputDate
          hasFile={fileName.length}
          on:dateChanged={handleDateChanged}
        />
      {/if}
    </div>

    <div style="min-width: 21px; min-height: 21px">
      {#if fileName && !isFetchError}
        <span
          class="block max-w-[400px] overflow-hidden text-ellipsis whitespace-nowrap"
          in:fade
        >
          file name : {fileName}
        </span>
      {/if}
    </div>

    {#if fileName && !isFetchError}
      <div
        bind:this={imageContainerRef}
        in:fade
        style="margin: 1rem 0; padding: 2rem"
      >
        <Cells {grid} {dateOfBirth} />
      </div>

      <!-- {#if dateOfBirth} -->
      <button
        class="-mt-4 rounded p-2 text-white bg-[rgb(167,205,90)]"
        on:click={onCaptureClick}
      >
        Share Image
      </button>
      <!-- {/if} -->
    {/if}
  </div>
{/if}
