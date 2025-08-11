<script lang="ts">
  import ValidatedInput from '../components/ValidatedInput.svelte';
  import { setProjectProperty, engineStore } from "$lib/stores/engineStore";
  import { softValidation, softValidationVariable, strictValidation } from "../utils/util";
  import IconImageUpload from '../components/IconImageUpload.svelte';
  import { getPreference, resetPreferences, showComponentIcons, showGradient, updatePreference } from '$lib/stores/userPreferenceStore';
    import { get } from 'svelte/store';
    import GeneralForm from '../components/GeneralForm.svelte';
    import UserSettingBoolean from '../components/UserSettingBoolean.svelte';
    import UserSettingSlider from '../components/UserSettingSlider.svelte';
    import UserSettingString from '../components/UserSettingString.svelte';

  const projectID = get(engineStore).projectData.id;

  let projectName = get(engineStore).projectData.name;
  let projectAuthor = get(engineStore).projectData.author;
  let projectDescription = get(engineStore).projectData.description;

  let displayedAuthor = $state(get(engineStore).projectData.author);

  function handleNameChange(newName: string, valid: boolean) {
    if (valid && newName) {
      setProjectProperty("name", newName);;
    }
  }

  function handleAuthorChange(newAuthor: string, valid: boolean) {
    if (valid && newAuthor) {
      setProjectProperty("author", newAuthor);;
      displayedAuthor = newAuthor;
    }
  }

  function handleDescriptionChange(newDescription: string, valid: boolean) {
    if (valid && newDescription) {
      engineStore.update(state => ({
          ...state,
          projectData: { ...state.projectData, newDescription }
      }));
    };
  }

  function handleResetUserSettings() {
    resetPreferences()
  }
</script>

<div class="w-full pl-4 pr-10 p-2 flex flex-col gap-4 mt-2">
  <GeneralForm formName="Project Settings">
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
  </GeneralForm>

  <GeneralForm formName="User Settings">
    <div class="divider m-0"></div>

    <UserSettingBoolean labelText="Colored Element Cards" updateFunction={(event: any) => updatePreference("coloredElementCards", event.target.checked)}/>
    <UserSettingBoolean labelText="Show Component Icons" updateFunction={(event: any) => showComponentIcons(event.target.checked)} />
  
    <UserSettingBoolean labelText="Show Gradient" updateFunction={(event: any) => showGradient(event.target.checked)} />
    <UserSettingSlider maxRange={100} labelText="Gradient Opacity" updateFunction={(event: any) => updatePreference("gradientOpacity", event.target.value)} />

    <UserSettingSlider maxRange={100} labelText="Background Opacity" updateFunction={(event: any) => updatePreference("backgroundOpacity", event.target.value)} />
    <UserSettingSlider maxRange={window.innerWidth} labelText="Background X" updateFunction={(event: any) => updatePreference("backgroundX", event.target.value)} />
    <UserSettingSlider maxRange={window.innerHeight} labelText="Background Y" updateFunction={(event: any) => updatePreference("backgroundY", event.target.value)} />
    <UserSettingSlider maxRange={200} labelText="Background Scale" updateFunction={(event: any) => updatePreference("backgroundScale", event.target.value)} />
    <UserSettingString labelText="Background Image Link" updateFunction={(event: any) => updatePreference("backgroundImageLink", event.target.value)} />
  </GeneralForm>

  <div class="flex justify-end gap-2">
    <button class="btn btn-error z-10" onclick={handleResetUserSettings}>Reset User Settings</button>
  </div>
</div>