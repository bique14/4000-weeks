<script lang="ts">
  import InputDate from "./lib/InputDate.svelte";
  import "./app.css";

  const numRows: number = 77;
  const numColumns: number = 52;
  const lastRowColumns: number = 48; // Number of columns in the last row

  let dateOfBirth = "";
  let base64Image = "";
  let colors: any = [[]];

  $: grid = calculateGrid(dateOfBirth);
  $: {
    if (base64Image) {
      fetchImagePixels(base64Image);
    }
  }
  $: console.log("colors", colors);

  // Function to create an array with the specified length
  const createArray = (length: number) => {
    return Array.from({ length }, (_, i) => i);
  };

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

  const weeksSinceBirth = (dateOfBirth: string) => {
    // Parse the date of birth string into a Date object
    const parts = dateOfBirth.split("/");
    const birthDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);

    // Get the current date
    const currentDate = new Date();

    // Calculate the time difference in milliseconds
    const timeDifference = currentDate.getTime() - birthDate.getTime();

    // Calculate the number of weeks
    const millisecondsInAWeek = 1000 * 60 * 60 * 24 * 7;
    const weeks = Math.floor(timeDifference / millisecondsInAWeek);

    return weeks;
  };

  const handleDateChanged = (event: any) => {
    dateOfBirth = event.detail;
  };

  const handleFileChanged = (event: any) => {
    const { files } = event.target;
    const selectedFile = files[0];

    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = function (event: any) {
        base64Image = event.target.result;
      };

      reader.readAsDataURL(selectedFile);
    }
  };

  const fetchImagePixels = async (base64Image: string) => {
    const response = await fetch("http://localhost:5000/upload", {
      method: "POST", // or 'GET', 'PUT', etc.
      body: JSON.stringify({ image: base64Image }), // Send the base64 image as JSON
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    console.log("result", result);
    colors = result;
  };
</script>

<div class="wrapper">
  <h1>4,000 weeks of life</h1>
  <input
    type="file"
    accept="image/png, image/jpg"
    on:change={handleFileChanged}
  />
  <InputDate on:dateChanged={handleDateChanged} />
  <div style="margin: 1rem 0;">
    {#each grid as row, rowIndex (row)}
      <div class="row" data-row={rowIndex}>
        {#each row as color, colIndex (colIndex)}
          <div
            class="cell"
            style="background-color: rgb({color.color.r},{color.color.g},{color
              .color.b})"
            data-column={colIndex}
          />
        {/each}
      </div>
    {/each}
  </div>
</div>
