<script lang="ts">
  import { loadSchema } from './utils/schemaLoader.js';
  import {
    engineStore,
    updateElement,
    deleteElement,
  } from '$lib/stores/engineStore';
  import { closeTab, reloadTab, setTabName, activeTabId } from '$lib/stores/editorTabsStore.js'
  import { debugLog, softValidation } from './utils/util.js';
  import FieldRenderer from './components/FieldRenderer.svelte';
  import ValidatedInput from './components/ValidatedInput.svelte';
  import MethodsGrid from './components/MethodsGrid.svelte';
  import RawDataModal from './components/RawDataModal.svelte';
  import ComponentModificationModal from './components/ComponentModificationModal.svelte';
  import { type Element, type Field, type Schema } from '$lib/data/_definitions.js';
    import GeneralForm from './components/GeneralForm.svelte';

  let activeElement: Element | undefined;
  let schema: Schema | undefined;

  $: {
    const engineStoreValue = $engineStore;
    const activeTabIdValue = $activeTabId;

    if (!activeTabIdValue || activeTabIdValue === 'browser') {
      debugLog("elementTabContent", `Not loading element because the active tab is browser or the active tab ID is undefined`)
      activeElement = undefined;
    } else {
      debugLog("elementTabContent", `Loading element...`)
      const element = engineStoreValue.loadedElements.find(el => el.id === activeTabIdValue);
      debugLog("elementTabContent", "Found and loaded element")
      activeElement = element;
    }
  };

  $: {
    const element = activeElement
    if (element) {
      debugLog("elementTabContent", "Loading schema...")
      schema = loadSchema(element.type);
    } else {
      schema = undefined;
    }
  };

  function getEnumValues(typeName: string): string[] {
    const resolvedSchema = typeof schema === 'function' ? schema : schema;
    const enumDef = resolvedSchema?.types?.[`enum_${typeName}`];
    return enumDef?.type === "enum" ? enumDef.values : [];
  }

  function updateField(name: string, value: any) {
    const element = activeElement
    if (!element) return;
    updateElement(element.id, {
      data: {
        ...element.data,
        [name]: value
      }
    });
  }

  function handleNameChange(newName: string, valid: boolean) {
    const element = activeElement
    if (valid && element) {
      updateElement(element.id, { name: newName });
      setTabName(element.id, newName);
      element.name = newName;
    }
  }

  function handleDeleteElement() {
    const element = activeElement
    if (element && confirm(`Are you sure you want to delete element "${element.name}" (${element.id})?`)) {
      deleteElement(element.id);
      closeTab(element.id);
    }
  }

  let showRawDataModal: boolean = false;

  function openRawDataModal() {
    showRawDataModal = true;
  }

  let showComponentModificationModal: boolean = false;

  function openComponentModificationModal() {
    showComponentModificationModal = true;
  }

  function getComponentFields(component_name: string): Field[]{
    const allComponents = schema?.components;
    const component = allComponents?.find(component => component_name == component.name)
    if (component?.fields) {
      return component?.fields;
    } else {
      return [];
    }
  }
</script>

{#if activeElement && schema}
  <div class="w-full pl-4 p-2 pb-1 flex flex-col gap-2">
    <ValidatedInput
      label="Element Name"
      value={activeElement?.name}
      validate={softValidation}
      onChange={handleNameChange}
    />

    <div class="label">
      <span class="label-text">Element ID</span>
      <div class="input w-auto opacity-60 ml-3">{activeElement.id}</div>
    </div>
    
    <div class="label">
      <span class="label-text">Element Type</span>
      <div class="input w-auto opacity-60 ml-3">{activeElement.type}</div>
    </div>
  </div>

  <div class="divider"></div>
  
  <GeneralForm formName="Element Data">
    {#if activeElement.data.components}
      {#each activeElement.data.components as componentName}
      <div class="divider mb-0 mt-0"></div>
      <div class="form space-y-3 mb-4">
        <div class="flex justify-between items-center w-full">
          <div class="text-xl font-bold">{componentName}</div>
        </div>
        {#each getComponentFields(componentName) as field }
          <FieldRenderer
          {field}
          value={activeElement.data?.[field.name]}
          {getEnumValues}
          onChange={updateField}
          />
        {/each}
      </div>
      {/each}
    {/if}
    <div class="divider mt-0"></div>
    <button class="btn btn-info w-full" onclick={openComponentModificationModal}>Modify Components</button>
  </GeneralForm>

  <div class="divider"></div>

  <div class="flex">
    <div class="text-xl font-bold p-4 z-[10] text-shadow-lg">Methods</div>
  </div>

  <MethodsGrid
    methods={activeElement.methods}
  />

  <div class="mt-6 flex justify-end gap-2">
    <button class="btn btn-base z-10" onclick={openRawDataModal}>View Raw Data</button>
    <button class="btn btn-error z-10" onclick={handleDeleteElement}>Delete Element</button>
  </div>

  <RawDataModal
    bind:showModal={showRawDataModal}
    element={activeElement}
    schema={schema}
  />

  <ComponentModificationModal
    bind:showModal={showComponentModificationModal}
  />
  
{:else}
  {#if activeElement == undefined}
    <p class="text-center text-gray-500 p-4">No element found.</p>
  {/if}

  {#if schema == undefined}
    <p class="text-center text-gray-500 p-4">No schema found.</p>
  {/if}
{/if}