<script lang="ts">
  import ValidatedInput from '../components/ValidatedInput.svelte';
  import { getProjectID, getProjectAuthor, getProjectName, setProjectName, setProjectAuthor, getProjectDescription, setProjectDescription } from "$lib/stores/engineStore";
  import { softValidation, softValidationVariable } from "../utils/validation";
  import IconImageUpload from '../components/IconImageUpload.svelte';

  const projectID = getProjectID();

  let projectName = getProjectName();
  let projectAuthor = getProjectAuthor();
  let projectDescription = getProjectDescription();

  let displayedAuthor = $state(getProjectAuthor());

  function handleNameChange(newName: string, valid: boolean) {
    if (valid && newName) {
      setProjectName(newName);
    }
  }

  function handleAuthorChange(newAuthor: string, valid: boolean) {
    if (valid && newAuthor) {
      setProjectAuthor(newAuthor);
      displayedAuthor = newAuthor;
    }
  }

  function handleDescriptionChange(newDescription: string, valid: boolean) {
    if (valid && newDescription) {
      setProjectDescription(newDescription);
    }
  }
</script>

<ValidatedInput
  label="Project Name"
  value={projectName}
  validate={softValidation}
  onChange={handleNameChange}
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
  validate={softValidation}
  onChange={handleAuthorChange}
/>

<div class="w-full pl-4 p-2 pb-1">
  <div class="label">
    <span class="label-text">Project Path</span>
  </div>
  <div class="input w-auto opacity-60 ml-3">{displayedAuthor}.{projectID}</div>
</div>

<ValidatedInput
  label="Project Description"
  value={projectDescription}
  validate={softValidationVariable}
  onChange={handleDescriptionChange}
  maxCharacters={100}
  minCharacters={1}
/>

<div class="w-full pl-4 p-2 pb-1">
  <IconImageUpload />
</div>