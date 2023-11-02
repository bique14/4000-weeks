<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { cls } from "../utils/cls";

  export let isLoading: boolean;

  const dispatch = createEventDispatcher();

  const _handleFileChanged = (event: any) => {
    const { files } = event.target;
    const selectedFile = files[0];

    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = function (event: any) {
        dispatch("fileChanged", {
          name: selectedFile.name,
          file: event.target.result,
        });
      };

      reader.readAsDataURL(selectedFile);
    }
  };
</script>

{#if isLoading}
  <span
    class={cls(
      "border border-[#999999] text-gray-400 rounded inline-block px-4 py-3 whitespace-nowrap",
      "cursor-not-allowed"
    )}
  >
    Uploading
  </span>
{:else}
  <label
    class={cls(
      "border border-[#999999] rounded inline-block px-4 py-3 cursor-pointer whitespace-nowrap",
      "hover:bg-[rgb(167,205,90)] hover:border-[rgb(167,205,90)] hover:text-white"
    )}
  >
    <input
      class="hidden"
      type="file"
      accept="image/png, image/jpg"
      on:change={_handleFileChanged}
    />
    Select Image
  </label>
{/if}
