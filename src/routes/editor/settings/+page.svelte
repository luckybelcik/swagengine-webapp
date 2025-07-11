<script lang="ts">
  import { getProjectAuthor, getProjectID, getProjectName, setProjectName } from "$lib/stores/engineStore";
    import { nameValidation } from "../utils/validation";

  const projectID = getProjectID();

  let NameErrorMessage = $state('');
  let AuthorErrorMessage = $state('');
  let DescriptionErrorMessage = $state('');

  function handleNameChange(event) {
    const name = event.target.value;
    const validation = nameValidation(name);
    
    if (validation !== 'safe') {
      NameErrorMessage = validation;
      return;
    }
  
    NameErrorMessage = '';
  
    setProjectName(name)
  }

  function handleAuthorChange(event) {
    const author = event.target.value;
    const validation = nameValidation(author);
    
    if (validation !== 'safe') {
      AuthorErrorMessage = validation;
      return;
    }
  
    AuthorErrorMessage = '';
  
    setProjectName(author)
  }
</script>

<label class="form-control w-full pl-4">
  <div class="label">
    <span class="label-text">Project Name</span>
  </div>
  <input
    type="text"
    class="input input-bordered w-auto ml-3 {NameErrorMessage ? 'input-error' : ''}"
    value={getProjectName()}
    onchange={handleNameChange}
  />
</label>

{#if NameErrorMessage}
  <div class="label">
    <span class="label-text-alt text-error">{NameErrorMessage}</span>
  </div>
{/if}

<div class="w-full pl-4 p-2 pb-1">
  <div class="label">
    <span class="label-text">Project ID</span>
  </div>
  <div class="input w-auto opacity-60 ml-3">{projectID}</div>
</div>

<label class="form-control w-full pl-4">
  <div class="label">
    <span class="label-text">Project Author</span>
  </div>
  <input
    type="text"
    class="input input-bordered w-auto ml-3 {AuthorErrorMessage ? 'input-error' : ''}"
    value={getProjectAuthor()}
    onchange={handleAuthorChange}
  />
</label>

{#if AuthorErrorMessage}
  <div class="label">
    <span class="label-text-alt text-error">{AuthorErrorMessage}</span>
  </div>
{/if}