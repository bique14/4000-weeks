<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { cls } from "../utils/cls";

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
