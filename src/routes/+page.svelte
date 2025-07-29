<script lang="ts">
  import { setProjectAuthor, setProjectID, setProjectName } from "$lib/stores/engineStore";
  import { strictValidation, softValidation } from "./editor/utils/util";
  import { goto } from "$app/navigation";
  import FormModal from "./editor/components/FormModal.svelte";

  let showCreateProjectModal = $state(false);

  let ErrorMessage = $state('');
  let ErrorField = $state('');

  function openCreateProjetModal() {
    showCreateProjectModal = true
  }

  function closeCreateProjectModal() {
    showCreateProjectModal = false
  }

  function handleCreateProject(values: Record<string, string>) {
    ErrorMessage = "";
    ErrorField = '';

    const projectName = values.projectName.trim();
    const projectID = values.projectId.trim().toLowerCase().replace(/ /g, "_");
    const projectAuthor = values.projectAuthor.trim().toLowerCase().replace(/ /g, "_");

    let validation = softValidation(projectName);
    if (validation !== "safe") {
      ErrorMessage = validation;
      ErrorField = 'projectName';
      return;
    }

    validation = strictValidation(projectID);
    if (validation !== "safe") {
      ErrorMessage = validation;
      ErrorField = 'projectId';
      return;
    }

    validation = strictValidation(projectAuthor);
    if (validation !== "safe") {
      ErrorMessage = validation;
      ErrorField = 'projectAuthor';
      return;
    }

    try {
      closeCreateProjectModal();
      setProjectName(projectName);
      setProjectID(projectID);
      setProjectAuthor(projectAuthor);
      goto("/editor");
    } catch (error: any) {
      console.error("Error creating element:", error);
      ErrorMessage = `Failed to create element: ${error.message ?? String(error)}`;
    }
  }
</script>

{#if showCreateProjectModal}
  <FormModal
    title="New Project"
    show={showCreateProjectModal}
    onClose={closeCreateProjectModal}
    onSubmit={handleCreateProject}
    fields={[
      { name: "projectName", label: "Project Name", placeholder: "e.g., New Project", 
        description: "The project name is used for display purposes, it's what people will see." },
      { name: "projectId", label: "Project ID", placeholder: "e.g., new_project",
        description: "The project ID is used for identifying it in code, etc. The project ID should be unique." },
      { name: "projectAuthor", label: "Author", placeholder: "You!",
        description: "The Author is used mainly to give you credit, and as to avoid issues with project ID multiplication." }
    ]}
    errorMessage={ErrorMessage}
    errorField={ErrorField}
  />
{/if}

<div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
  <span class="text-8xl text-primary text-center">
    REDBUD
  </span>
  <span class="text-2xl mt-2 text-center">
    A tool for development with the SWAGENGINE
  </span>
</div>

<div class="absolute top-3/4 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
  <h1 class="text-xl text-center">
    Designed for both developers and modders. The go-to way of command, entity, item, and tile creation. Select a project or create one to start. For more information, visit the About page.
  </h1>
</div>

<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
  <div class="flex w-full">
    <button class="btn btn-outline btn-xl">
      Select Project
      <svg 
        class="stroke-current" 
        width="24px" 
        height="24px" 
        stroke-width="2" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        >
        <path d="M18 6H20M22 6H20M20 6V4M20 6V8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M21.4 20H2.6C2.26863 20 2 19.7314 2 19.4V11H21.4C21.7314 11 22 11.2686 22 11.6V19.4C22 19.7314 21.7314 20 21.4 20Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M2 11V4.6C2 4.26863 2.26863 4 2.6 4H8.77805C8.92127 4 9.05977 4.05124 9.16852 4.14445L12.3315 6.85555C12.4402 6.94876 12.5787 7 12.722 7H14" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
    </button>
    <div class="divider divider-horizontal">OR</div>
    <button class="btn btn-outline btn-xl" onclick={openCreateProjetModal}>
      Create Project
      <svg
        class="stroke-current"
        width="24px"
        height="24px"
        viewBox="0 0 24 24"
        stroke-width="2"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        >
        <path d="M1.99219 19H4.99219M7.99219 19H4.99219M4.99219 19V16M4.99219 19V22" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M7 2L16.5 2L21 6.5V19" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M11 22H16.5C17.3284 22 18 21.3284 18 20.5V8.74853C18 8.5894 17.9368 8.43679 17.8243 8.32426L14.6757 5.17574C14.5632 5.06321 14.4106 5 14.2515 5H4.5C3.67157 5 3 5.67157 3 6.5V13" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M14 5V8.4C14 8.73137 14.2686 9 14.6 9H18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
    </button>
  </div>
</div>