<script lang="ts">
  import ValidatedInput from '$lib/components/ValidatedInput.svelte';
  import { getProjectID, getProjectAuthor, getProjectName, setProjectName, setProjectAuthor } from "$lib/stores/engineStore";
  import { nameValidation } from "../utils/validation";

  const projectID = getProjectID();

  let projectName = getProjectName();
  let projectAuthor = getProjectAuthor();

  function handleNameChange(event) {
    if (event.detail.valid) {
      setProjectName(event.detail.value);
    }
  }

  function handleAuthorChange(event) {
    if (event.detail.valid) {
      setProjectAuthor(event.detail.value);
    }
  }
</script>

<ValidatedInput
  label="Project Name"
  value={projectName}
  validate={nameValidation}
  on:change={handleNameChange}
/>

<div class="w-full pl-4 p-2 pb-1">
  <div class="label">
    <span class="label-text">Project ID</span>
  </div>
  <div class="input w-auto opacity-60 ml-3">{projectID}</div>
</div>

<ValidatedInput
  label="Project Author"
  value={projectAuthor}
  validate={nameValidation}
  on:change={handleAuthorChange}
/>
