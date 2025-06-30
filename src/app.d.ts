// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};

declare module '*.svg?component' {
  import type { SvelteComponentTyped } from 'svelte';
  const content: SvelteComponentTyped;
  export default content;
}