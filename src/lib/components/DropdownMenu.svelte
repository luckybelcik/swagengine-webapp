<script>
  import { page } from '$app/stores'; // Import the SvelteKit page store
</script>

<div class="dropdown dropdown-end">
  <!-- svelte-ignore a11y_consider_explicit_label -->
  <button tabindex="0" class="btn m-1 btn-square btn-lg bg-base-300 hover:bg-base-200">
    <svg
      width="35px"
      height="35px"
      class="fill-current"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg">
    
      <g clip-path="url(#a)">
        <path d="m3 6.0009h18m-18 6h18m-18 6h18" class="stroke-current" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"/>
      </g>
    </svg>
  </button>

  <ul class="dropdown-content menu bg-base-300 rounded-box z-[1] w-52 p-2 shadow-xl">
    <li>
      <a href="/" class={$page.url.pathname === '/' ? 'active' : ''}>Home</a>
    </li>
    <li>
      <a href="/about" class={$page.url.pathname === '/about' ? 'active' : ''}>About</a>
    </li>
    </ul>
</div>