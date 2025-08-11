<script lang="ts">
  import ValidatedInput from '../components/ValidatedInput.svelte';
  import { setProjectProperty, engineStore } from "$lib/stores/engineStore";
  import { softValidation, softValidationVariable, strictValidation } from "../utils/util";
  import IconImageUpload from '../components/IconImageUpload.svelte';
  import { getPreference, resetPreferences, showComponentIcons, showGradient, updatePreference } from '$lib/stores/userPreferenceStore';
    import { get } from 'svelte/store';
    import GeneralForm from '../components/GeneralForm.svelte';
    import UserSetting from '../components/UserSetting.svelte';

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
    <div class="divider m-0">Element Card</div>
    <UserSetting settingType="toggle" labelText="Colored Element Cards" updateFunction={"coloredElementCards"}/>
    <UserSetting settingType="toggle" labelText="Show Component Icons" updateFunction={(event: any) => showComponentIcons(event.target.checked)} />
  
    <div class="divider m-0">Background Gradient</div>
    <UserSetting settingType="toggle" labelText="Show Gradient" updateFunction={(event: any) => showGradient(event.target.checked)} />
    <UserSetting settingType="slider" maxRange={100} labelText="Gradient Opacity" updateFunction={"gradientOpacity"} />
    
    <div class="divider m-0">Background Image</div>
    <UserSetting settingType="slider" maxRange={100} labelText="Background Opacity" updateFunction={"backgroundOpacity"} />
    <UserSetting settingType="slider" maxRange={window.innerWidth} labelText="Background X" updateFunction={"backgroundX"} />
    <UserSetting settingType="slider" minRange={-200} maxRange={window.innerHeight} labelText="Background Y" updateFunction={"backgroundY"} />
    <UserSetting settingType="slider" maxRange={200} labelText="Background Scale" updateFunction={"backgroundScale"} />
    <UserSetting settingType="slider" maxRange={360} labelText="Background Rotation" updateFunction={"backgroundRotation"} />
    <UserSetting settingType="toggle" labelText="Background Flipped" updateFunction={"backgroundFlipped"} />
    <UserSetting settingType="toggle" labelText="Background On Top" updateFunction={"backgroundOnTop"} />
    <UserSetting settingType="string" labelText="Background Image Link" updateFunction={"backgroundImageLink"} />
  </GeneralForm>

  <div class="flex justify-end gap-2">
    <button class="btn btn-error z-10" onclick={handleResetUserSettings}>Reset User Settings</button>
  </div>
</div>