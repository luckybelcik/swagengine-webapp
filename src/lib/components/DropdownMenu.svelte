<script>
  import { page } from '$app/state'; // Import the SvelteKit page store
</script>

<div class="dropdown dropdown-end">
  <div tabindex="0" role="button" class="btn m-1 ml-0 btn-square btn-lg bg-base-300 hover:bg-base-200">
    <svg
      width="35px" height="35px" class="fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#a)">
        <path d="m3 6.0009h18m-18 6h18m-18 6h18" class="stroke-current" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>
      </g>
    </svg>
</div>

  <ul class="dropdown-content menu bg-base-300 rounded-box z-[1] w-25 p-2 shadow-2xl mr-1 space-y-2">
    <li>
      <a href="/" class="text-center btn-block btn {page.url.pathname === '/' ? 'active' : ''}">Home</a>
    </li>
    <li>
      <a href="/about" class="text-center btn-block btn {page.url.pathname === '/about' ? 'active' : ''}">About</a>
    </li>
  </ul>
</div>