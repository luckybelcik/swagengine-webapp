<script lang="ts">
  import ValidatedInput from '../components/ValidatedInput.svelte';
  import { setProjectProperty, engineStore } from "$lib/stores/engineStore";
  import { snakeCaseToCapitalized, softValidation, softValidationVariable, strictValidation } from "../utils/util";
  import IconImageUpload from '../components/IconImageUpload.svelte';
  import { addImage, removeImage, resetPreferences, showComponentIcons, showGradient, userPreferenceStore } from '$lib/stores/userPreferenceStore';
    import { get } from 'svelte/store';
    import GeneralForm from '../components/GeneralForm.svelte';
    import UserSetting from '../components/UserSetting.svelte';
    import AddImageInput from '../components/AddImageInput.svelte';
    import { ONEKO_SKINS } from '$lib/data/_constant_data';

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

  console.log($userPreferenceStore.images["thingy"])
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
    <UserSetting settingType="toggle" labelText="Colored Element Cards" updateFunctionOrProperty={"coloredElementCards"}/>
    <UserSetting settingType="toggle" labelText="Show Component Icons" updateFunctionOrProperty={(event: any) => showComponentIcons(event.target.checked)} />
  
    <div class="divider m-0">Background Gradient</div>
    <UserSetting settingType="toggle" labelText="Show Gradient" updateFunctionOrProperty={(event: any) => showGradient(event.target.checked)} />
    <UserSetting settingType="slider" maxRange={100} labelText="Gradient Opacity" updateFunctionOrProperty={"gradientOpacity"} />
    
    <div class="divider m-0">Images</div>
    {#if Object.entries($userPreferenceStore.images) && Object.entries($userPreferenceStore.images).length > 0}
      {#each Object.entries($userPreferenceStore.images) as [name, image] (name)}
      <div class="collapse collapse-bright collapse-arrow">
        <input type="checkbox" class="collapse-toggle"/>
        <div class="collapse-title">
          <div class="text-2xl font-bold w-full">{snakeCaseToCapitalized(name)}</div>
        </div>
        <div class="collapse-content flex flex-col gap-2">
          {#if typeof window !== "undefined"}
            <UserSetting settingType="slider" imageToUpdate={name} maxRange={100} labelText="Opacity" updateFunctionOrProperty={"Opacity"} />
            <UserSetting settingType="slider" imageToUpdate={name} maxRange={window.innerWidth} labelText="X" updateFunctionOrProperty={"X"} />
            <UserSetting settingType="slider" imageToUpdate={name} minRange={-200} maxRange={window.innerHeight} labelText="Y" updateFunctionOrProperty={"Y"} />
            <UserSetting settingType="slider" imageToUpdate={name} maxRange={200} labelText="Scale" updateFunctionOrProperty={"Scale"} />
            <UserSetting settingType="slider" imageToUpdate={name} maxRange={360} labelText="Rotation" updateFunctionOrProperty={"Rotation"} />
            <UserSetting settingType="toggle" imageToUpdate={name} labelText="Flipped" updateFunctionOrProperty={"Flipped"} />
            <UserSetting settingType="toggle" imageToUpdate={name} labelText="On Top" updateFunctionOrProperty={"OnTop"} />
            <UserSetting settingType="string" imageToUpdate={name} labelText="Image Link" updateFunctionOrProperty={"ImageLink"} />
            <div>
              <UserSetting settingType="string" imageToUpdate={name} labelText="Hover Link" updateFunctionOrProperty={"HoverLink"} />
              <div class="text-xs opacity-60">If you get softlocked, use ` (backtick) to disable the hoverability and lower all image opacities</div>
            </div>
            <button class="btn btn-error z-10 w-30" onclick={()=>removeImage(name)}>Delete Image</button>
          {/if}
        </div>
      </div>
      {/each}
    {:else}
      <div>No Images loaded</div>
    {/if}
    <AddImageInput/>

    <div class="divider m-0">Sillies</div>
    <UserSetting settingType="toggle" labelText="Oneko" updateFunctionOrProperty={"oneko"}/>
    <UserSetting settingType="option" labelText="Oneko Skin" updateFunctionOrProperty={"onekoSkin"} optionsArray={Object.keys(ONEKO_SKINS)}/>
  </GeneralForm>

  <div class="flex justify-end gap-2">
    <button class="btn btn-error z-10" onclick={handleResetUserSettings}>Reset User Settings</button>
  </div>
</div>