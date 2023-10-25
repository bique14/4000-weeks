<script lang="ts">
  import { createEventDispatcher } from "svelte";

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

<label class="custom-file-upload">
  <input
    type="file"
    accept="image/png, image/jpg"
    on:change={_handleFileChanged}
  />
  Select Image
</label>
