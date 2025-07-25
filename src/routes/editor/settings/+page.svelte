<script lang="ts">
  import ValidatedInput from '../components/ValidatedInput.svelte';
  import { getProjectID, getProjectAuthor, getProjectName, setProjectName, setProjectAuthor, getProjectDescription, setProjectDescription } from "$lib/stores/engineStore";
  import { softValidation, softValidationVariable, strictValidation } from "../utils/validation";
  import IconImageUpload from '../components/IconImageUpload.svelte';
    import { getPreference, updatePreference, userPreferenceStore } from '$lib/stores/userPreferenceStore';

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

<div class="w-full pl-4 pr-10 p-2 flex flex-col gap-4 mt-2">
  <div class="collapse collapse-arrow form relative bg-base-200">
    <input type="checkbox" />
    <div class="collapse-title">
      <div class="text-2xl font-bold w-full">Project Settings</div>
    </div>
    <div class="collapse-content flex flex-col gap-2">
      <div class="divider m-0"></div>
      <ValidatedInput
        label="Project Name"
        value={projectName}
        validate={softValidation}
        onChange={handleNameChange}
      />

      <div>
        <div class="label">
          <span class="label-text">Project ID</span>
        </div>
        <div class="input w-auto opacity-60 ml-3">{projectID}</div>
      </div>

      <ValidatedInput
        label="Project Author"
        value={projectAuthor}
        validate={strictValidation}
        onChange={handleAuthorChange}
      />

      <div>
        <div class="label">
          <span class="label-text">Project Path</span>
        </div>
        <div class="input w-auto opacity-60 ml-3">{displayedAuthor.toLowerCase()}.{projectID}</div>
      </div>

      <ValidatedInput
        label="Project Description"
        value={projectDescription}
        validate={softValidationVariable}
        onChange={handleDescriptionChange}
        maxCharacters={512}
        minCharacters={1}
        bigInput={true}
      />

      <div>
        <IconImageUpload />
      </div>
    </div>
  </div>

  <div class="collapse collapse-arrow form relative bg-base-200">
    <input type="checkbox" />
    <div class="collapse-title">
      <div class="text-2xl font-bold w-full">User Settings</div>
    </div>
    <div class="collapse-content flex flex-col gap-2">
      <div class="divider m-0"></div>

      <div>
        <div class="label">
          <span class="label-text">Colored Element Cards</span>
        </div>
        <input class="ml-3 toggle toggle-primary" type="checkbox" checked={getPreference("coloredElementCards")} onchange={(event: any) => updatePreference("coloredElementCards", event.target.checked)} />
      </div>

      <div>
        <div class="label">
          <span class="label-text">Show Component Icons</span>
        </div>
        <input class="ml-3 toggle toggle-primary" type="checkbox" checked={getPreference("showComponentIcons")} onchange={(event: any) => updatePreference("showComponentIcons", event.target.checked)} />
      </div>
    </div>
  </div>
</div>