<script>
  import { setDarkMode, setTheme, updatePreference, userPreferenceStore } from "$lib/stores/userPreferenceStore";

  let selectedTheme = $derived($userPreferenceStore.preferences.theme);

  $effect(() => {
    setTheme(selectedTheme);
    updatePreference("theme", selectedTheme)
  });
</script>
<div class="dropdown dropdown-end">
  <div tabindex="0" role="button" class="btn m-1 mr-0 btn-square btn-lg bg-base-300 hover:bg-base-200">
    <svg
      width="33px" height="33px" version="1.0" class="fill-current" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
      <path d="m19.316 22.738 15.656 15.656c1.7579 1.7578 3.586 1.4766 5.2266-0.164l11.625-11.578c1.6407-1.6406 1.8984-3.4687 0.1407-5.2265l-2.3674-2.3438c-2.7888 2.4844-10.617 8.0625-11.836 6.8438-0.3984-0.3984-0.0703-0.75 0.1641-0.9844 2.5781-2.6484 6.0234-6.8672 6.4688-11.109l-12.352-12.352c-1.4531-1.0805-3.6094-0.6805-4.7813 0.2578-2.3671 3.3515-2.3203 8.9531-7.9453 15.656-1.5469 1.875-1.8047 3.5391 0 5.3438zm-13.828 30.094c3.0938 3.0469 6.9843 3.1406 9.75 0.375 2.1797-2.1562 4.4531-7.9453 6.0234-10.641l6.5625 6.5391c1.875 1.875 3.961 1.9219 5.7188 0.164l1.4765-1.5c1.7578-1.7578 1.711-3.8437-0.1406-5.7187l-18.586-18.586c-1.875-1.8984-3.9375-1.9453-5.7188-0.1406l-1.4765 1.4766c-1.8047 1.7812-1.7578 3.8203 0.1406 5.7187l6.5156 6.5391c-2.6718 1.5703-8.4844 3.8672-10.641 6.0234-2.8359 2.8125-2.6953 6.7266 0.375 9.75zm3.1875-3.3047c-0.7734-0.7968-0.7969-2.0625 0-2.8593 0.8203-0.7969 2.0859-0.7969 2.8828 0 0.7969 0.8203 0.7969 2.039 0 2.8593s-2.0625 0.8438-2.8828 0z"/>
    </svg>
  </div>
  
  <ul class="dropdown-content bg-base-300 rounded-box w-25 p-2 z-[9999] shadow-2xl space-y-2">
    <li>
      <input
        type="radio"
        name="selector"
        class="btn btn-block font-normal relative z-[9999]"
        aria-label="Sunset"
        value="sunset"
        bind:group={selectedTheme}
        onclick={() => {
          setDarkMode(true)}}/>
    </li>
    <li>
      <input
        type="radio"
        name="selector"
        class="btn btn-block font-normal relative z-[9999]"
        aria-label="Valentine"
        value="valentine"
        bind:group={selectedTheme}
        onclick={() => {
          setDarkMode(false)}}/>
    </li>
    <li>
      <input
        type="radio"
        name="selector"
        class="btn btn-block font-normal relative z-[9999]"
        aria-label="Black"
        value="black"
        bind:group={selectedTheme}
        onclick={() => {
          setDarkMode(true)}}/>
    </li>
    <li>
      <input
        type="radio"
        name="selector"
        class="btn btn-block font-normal relative z-[9999]"
        aria-label="Coffee"
        value="coffee"
        bind:group={selectedTheme}
        onclick={() => {
          setDarkMode(true)}}/>
    </li>
    <li>
      <input
        type="radio"
        name="selector"
        class="btn btn-block font-normal relative z-[9999]"
        aria-label="Silk"
        value="silk"
        bind:group={selectedTheme}
        onclick={() => {
          setDarkMode(false)}}/>
    </li>
  </ul>
</div>