import type { ComponentWithIcon, EditorTab, EngineStore } from "./_definitions";

export const LOCAL_STORAGE_KEY_PREFERENCES = 'swaggappAutosavePreferences';
export const CURRENT_PROJECT_ID_KEY = 'new_project';
export const ENGINE_VERSION = '0.0.1';
export const WEBAPP_VERSION = '0.0.10';

export const FIXED_ELEMENT_TYPES = ['item', 'entity', 'tile', 'command', 'boss'] as const;
export const FIXED_ENTITY_METHOD_HOOKS = ['OnSpawn', 'OnDeath', 'OnHit', 'OnTick'] as const;
export const FIXED_ITEM_METHOD_HOOKS = ['OnUse', 'OnEquip', 'OnUnequip', 'OnPickup'] as const;
export const FIXED_TILE_METHOD_HOOKS = ['OnPlace', 'OnBreak', 'OnStep'] as const;

export const COMPONENTS_WITH_ICONS = ['sword_component', 'pickaxe_component', 'axe_component', 'shovel_component', 'hammer_component', 'consumable_component', 'durability_component'] as const;
export const COMPONENT_ICONS: Record<ComponentWithIcon, string> = {
  "sword_component": `<svg class="fill-current" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><g><path transform="rotate(-90 8 8)" d="m16 0h-3l-9.2929 9.2929-1.5-1.5-1.4142 1.4142 2.2929 2.2929-1.5023 1.5023c-0.02764-0.0015-0.05548-0.0023-0.0835-0.0023-0.82843 0-1.5 0.6716-1.5 1.5s0.67157 1.5 1.5 1.5 1.5-0.6716 1.5-1.5c0-0.028-7.7e-4 -0.0559-0.00229-0.0835l1.5023-1.5023 2.2929 2.2929 1.4142-1.4142-1.5-1.5 9.2929-9.2929v-3z" /></g></svg>`,
  "pickaxe_component": `<svg class="fill-current" aria-hidden="true" role="img" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M61.501 55.155L26.109 19.77l1.613-1.614a2.245 2.245 0 0 0 .597-2.096C37.728 8.44 47.494 4.102 54.763 4.074C47.283-.331 34.92 2.448 23.59 10.84l-.647-.647a2.257 2.257 0 0 0-3.188 0l-1.613 1.612l-3.489-3.487c-.35-.348-.791-.499-1.279-.499c-2.761 0-7.043 4.855-5.064 6.815l3.501 3.5l-1.618 1.618a2.262 2.262 0 0 0 0 3.186l.649.648C2.448 34.911-.332 47.271 4.074 54.747c.031-7.266 4.369-17.03 11.989-26.435a2.252 2.252 0 0 0 2.095-.596l1.619-1.617l35.404 35.396c.348.352.788.505 1.276.505c2.743 0 7.005-4.869 5.044-6.845"/></svg>`,
  "axe_component": `<svg class="fill-current" version="1.1" viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><g transform="rotate(-90 256 256)"><path d="m457.81 161.94-7.94-7.94 2.064-2.064c11.314-11.315 11.314-29.661 0-40.976-11.315-11.314-29.661-11.314-40.976 0l-2.064 2.064-7.94-7.94c-4.409-4.409-11.557-4.409-15.966 0l-1.128 1.128c-23.59-26.138-37.856-59.321-40.622-94.339-0.276-3.487-1.957-6.712-4.657-8.935-2.701-2.223-6.188-3.251-9.663-2.853-55.445 6.338-99.446 50.341-105.78 105.78-0.397 3.474 0.635 6.958 2.857 9.658s5.447 4.386 8.932 4.662c35.019 2.766 68.2 17.032 94.338 40.623l-1.129 1.128c-4.409 4.409-4.409 11.557 0 15.966l7.94 7.94-276.69 276.69c-11.314 11.315-11.314 29.661 0 40.976 11.317 11.315 29.661 11.315 40.976 0l276.69-276.69 7.94 7.94c4.409 4.409 11.557 4.409 15.966 0l56.856-56.856c4.409-4.409 4.409-11.557 1e-3 -15.966z"/></g></svg>`,
  "shovel_component": `<svg class="fill-current" version="1.1" viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><g transform="rotate(-90 256 256)"><path d="m506.74 84.812-79.553-79.553c-7.009-7.011-18.377-7.01-25.389-1e-3l-30.468 30.468c-23.011 23.011-27.7 57.49-14.109 85.199l-204.46 204.46-38.396-38.396c-4.402-4.401-11.538-4.401-15.941 0l-63.685 63.685c-28.409 28.409-40.506 69.269-32.144 108.57l6.877 32.315c1.171 5.502 5.469 9.8 10.972 10.971l32.315 6.877c39.298 8.364 80.158-3.735 108.57-32.145l63.685-63.685c4.402-4.401 4.401-11.538 0-15.941l-38.396-38.396 204.43-204.43c27.281 13.445 61.82 9.27 85.226-14.136l30.468-30.468c7.008-7.01 7.008-18.376-3e-3 -25.387zm-55.857 30.468c-14.958 14.958-39.177 14.975-54.152 0.012-4e-3 -4e-3 -7e-3 -8e-3 -0.011-0.012s-8e-3 -7e-3 -0.012-0.011c-14.922-14.934-14.918-39.224 0.011-54.152l17.773-17.773 54.164 54.164-17.773 17.772z"/></g></svg>`,
  "hammer_component": `<svg class="fill-current" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="m9.972 2.508a0.5 0.5 0 0 0-0.16-0.556l-0.178-0.129a5.009 5.009 0 0 0-2.076-0.783c-1.343-0.178-3.054 0.189-4.718 2.093h-1.054a0.5 0.5 0 0 0-0.354 0.147l-1.286 1.287a0.5 0.5 0 0 0 0 0.706l2.571 2.579a0.5 0.5 0 0 0 0.708 0l1.286-1.29a0.5 0.5 0 0 0 0.146-0.353v-0.639l8.387 8.873a0.5 0.5 0 0 0 0.756 0.057l1.5-1.5a0.5 0.5 0 0 0 0.017-0.689l-9.129-8.63c0.747-0.456 1.772-0.839 3.112-0.839a0.5 0.5 0 0 0 0.472-0.334z"/></svg>`,
  "consumable_component": `<svg class="fill-current" version="1.1" viewBox="0 0 220.72 220.72" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="m199.4 126.34c-2.348 23.011-14.692 41.948-22.068 53.262-1.641 2.517-3.058 4.69-3.792 6.068-1.355 2.541-2.083 4.749-2.853 7.086-1.439 4.37-3.071 9.322-8.431 15.507-6.658 7.683-18.026 12.456-29.668 12.456-3.718 0-7.315-0.489-10.692-1.454-4.938-1.411-8.713-3.382-11.536-5.351-2.823 1.968-6.6 3.939-11.536 5.351-3.376 0.965-6.974 1.454-10.692 1.454-11.641 0-23.009-4.772-29.668-12.456-5.36-6.185-6.991-11.138-8.431-15.508-0.771-2.337-1.497-4.545-2.853-7.085-0.733-1.376-2.15-3.549-3.791-6.065-7.376-11.314-19.722-30.251-22.07-53.265-3.224-31.596 13.656-54.733 46.311-63.479 5.079-1.36 10.094-2.05 14.907-2.05 8.304 0 15.185 2.043 20.651 4.72 0.104-4.206-0.407-12.757-4.865-23.738-4.732-11.656-7.812-15.079-8.538-15.776-3.048-1.617-4.669-5.188-3.701-8.646 1.117-3.988 5.251-6.317 9.245-5.2 5.434 1.521 10.959 9.365 16.893 23.98 0.035 0.085 0.065 0.168 0.099 0.253l0.812-0.773c0.631-6.475 4.27-22.413 24.427-31.68 5.704-2.623 11.789-3.953 18.085-3.953 16.698 0 29.402 9.422 29.936 9.823 1.844 1.388 2.945 3.547 2.987 5.855 0.032 1.807-0.341 18.035-23.237 31.158-6.377 3.655-13.459 5.508-21.049 5.508h-3e-3c-8.937 0-16.815-2.614-21.879-4.823l-5.343 5.088c0.939 5.168 1.166 9.46 1.13 12.606 5.358-2.521 12.02-4.403 19.994-4.403 4.813 0 9.829 0.689 14.907 2.05 32.658 8.747 49.537 31.885 46.312 63.48z"/></svg>`,
  "durability_component": `<svg class="fill-current" version="1.1" viewBox="0 0 271.26 271.26" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="m157.66 243.02v-71.985c27.26-7.387 52.179-31.393 49.308-65.275l-10-101.26c-0.252-2.558-2.404-4.508-4.975-4.508h-47.955l-12.52 26.719 21.958 9.223c1.967 0.825 3.538 2.44 4.311 4.43 0.772 1.989 0.703 4.241-0.19 6.178l-17.733 38.42c-1.29 2.793-4.11 4.597-7.186 4.597h-3e-3c-1.147 0-2.26-0.245-3.308-0.729-3.96-1.827-5.696-6.537-3.868-10.498l14.3-30.983-22.001-9.241c-1.976-0.829-3.55-2.452-4.32-4.452-0.77-1.999-0.689-4.259 0.22-6.199l12.868-27.465h-47.238c-2.571 0-4.723 1.95-4.976 4.509l-10.005 101.31c-1.515 17.403 3.411 32.937 14.247 44.921 8.595 9.507 20.936 16.634 35.066 20.317v71.964c-25.016 3.741-42.726 18.776-43.51 19.452-1.584 1.364-2.152 3.569-1.425 5.529 0.728 1.959 2.597 3.26 4.688 3.26h124.49c2.09 0 3.96-1.3 4.688-3.26 0.727-1.96 0.159-4.165-1.425-5.529-0.784-0.676-18.494-15.71-43.51-19.452z"/></svg>`,
};

export const DEFAULT_ICON_URL = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.publicdomainpictures.net%2Fpictures%2F30000%2Ft2%2Fred-apple-isolated.jpg&f=1&nofb=1&ipt=ccc6435a12be9f52147d442ddea931d20151cefa218c433212179795a09f55d3';
export const DEFAULT_BACKGROUND_URL = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fthfvnext.bing.com%2Fth%2Fid%2FOIP.5IzYXyLj_yLHi4hqRE6yeQHaEo%3Fcb%3Dthfvnext%26pid%3DApi&f=1&ipt=631a8892003c753614470bedf23f7a2e987b46e0e176495517fd653180a0a96d';

export const HOVER_IMAGE_DELAY_MS = 250;

export const ONEKO_SKINS = {
  'ace': 'https://raw.githubusercontent.com/MCHAMSTERYT2/onekocord/refs/heads/main/onekoskins/ace.png',
  'black': 'https://raw.githubusercontent.com/MCHAMSTERYT2/onekocord/refs/heads/main/onekoskins/black.png',
  'calico': 'https://raw.githubusercontent.com/MCHAMSTERYT2/onekocord/refs/heads/main/onekoskins/calico.png',
  'default': 'https://raw.githubusercontent.com/MCHAMSTERYT2/onekocord/refs/heads/main/onekoskins/default.png',
  'dog': 'https://raw.githubusercontent.com/danielah05/oneko.js-skins/refs/heads/main/dog.gif',
  'fox': 'https://raw.githubusercontent.com/MCHAMSTERYT2/onekocord/refs/heads/main/onekoskins/fox.png',
  'ghost': 'https://raw.githubusercontent.com/MCHAMSTERYT2/onekocord/refs/heads/main/onekoskins/ghost.png',
  'gray': 'https://raw.githubusercontent.com/MCHAMSTERYT2/onekocord/refs/heads/main/onekoskins/gray.png',
  'jess': 'https://raw.githubusercontent.com/MCHAMSTERYT2/onekocord/refs/heads/main/onekoskins/jess.png',
  'kina': 'https://raw.githubusercontent.com/MCHAMSTERYT2/onekocord/refs/heads/main/onekoskins/kina.png',
  'lucy': 'https://raw.githubusercontent.com/MCHAMSTERYT2/onekocord/refs/heads/main/onekoskins/lucy.png',
  'maia': 'https://raw.githubusercontent.com/MCHAMSTERYT2/onekocord/refs/heads/main/onekoskins/maia.png',
  'silver': 'https://raw.githubusercontent.com/MCHAMSTERYT2/onekocord/refs/heads/main/onekoskins/silver.png',
  'silversky': 'https://raw.githubusercontent.com/MCHAMSTERYT2/onekocord/refs/heads/main/onekoskins/silversky.png',
  'spirit': 'https://raw.githubusercontent.com/MCHAMSTERYT2/onekocord/refs/heads/main/onekoskins/spirit.png',
  'tora': 'https://raw.githubusercontent.com/danielah05/oneko.js-skins/refs/heads/main/tora.gif',
  'valentine': 'https://raw.githubusercontent.com/MCHAMSTERYT2/onekocord/refs/heads/main/onekoskins/valentine.png',
};

export const INITIAL_USER_PREFERENCE_STORE: Record<string, any> = {
  preferences: {
    coloredElementCards: true,
    showComponentIcons: true,

    showGradient: true,
    gradientOpacity: 20,

    hoverEffectsEnabled: true,

    isDarkMode: true,
    theme: "sunset",

    oneko: true,
    onekoSkin: 'default',
    isOnekoTransitioningState: false,
  },

  images: {
    background: {
      Opacity: 50,
      X: 251,
      Y: 0,
      Scale: 83,
      Rotation: 0,
      Flipped: false,
      OnTop: false,
      ImageLink: DEFAULT_BACKGROUND_URL,
    },
    kitten: {
      Opacity: 100,
      X: 0,
      Y: 0,
      Scale: 10,
      Rotation: 0,
      Flipped: false,
      OnTop: true,
      ImageLink: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ffreepngimg.com%2Fthumb%2Fcat%2F35912-2-black-cat-transparent-picture.png&f=1&nofb=1&ipt=12b2da0dfe2d92d0a9e18d41b01c22a78e2c2f9308f2738a0c8adc448f282f14",
      HoverLink: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ffreepngimg.com%2Fthumb%2Fcat%2F1-cat-png-image-thumb.png&f=1&nofb=1&ipt=fcc30b21832c6854ac549435646493506e128997e010239aa1d28966e52c702f"
    }
  },
}

export const INITIAL_ENGINE_STORE: EngineStore = {
  loadedElements: [
    {
      id: 'item_sword',
      type: 'item',
      name: 'Iron Sword',
      data: { components: ["base", "sword_component"] },
      methods: [{ type: 'OnUse', code: '// Called when the item is used' }],
      createdAt: new Date().toISOString(),
    },

    {
      id: 'basic_dude',
      type: 'entity',
      name: 'Basic Dude',
      data: { components: ["base", "gravity_component", "hitbox_component"] },
      methods: [{ type: 'OnSpawn', code: '// Called when the dude is spawned' }],
      createdAt: new Date().toISOString(),
    },

    {
      id: 'money_block',
      type: 'tile',
      name: 'Money Block',
      data: { components: ["base"] },
      methods: [{ type: 'OnPlace', code: '// Called when the block is placed' }],
      createdAt: new Date().toISOString(),
    },

    {
      id: 'set_money',
      type: 'command',
      name: 'Set Money',
      data: { components: ["base"] },
      methods: [],
      createdAt: new Date().toISOString(),
    },

    {
      id: 'evil_bird_dude',
      type: 'boss',
      name: 'Evil Bird Dude',
      data: { components: ["base"] },
      methods: [],
      createdAt: new Date().toISOString(),
    }
  ],
  potentialElements: [],
  projectData: {
    name: 'New Project',
    id: 'new_project',
    description: 'this is the default project description',
    author: 'Author',
    iconurl: DEFAULT_ICON_URL,
    projectVersion: '0.0.0',
    engineVersion: ENGINE_VERSION,
    webAppVersion: WEBAPP_VERSION
  }
};

export const INITIAL_TABS: EditorTab[] = [
  {
    id: 'browser',
    type: 'browser',
    name: 'Browse Elements',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
             <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
           </svg>`,
    closable: false,
  },
];

export const INT64_MIN = -9223372036854775808n;
export const INT64_MAX = 9223372036854775807n;
export const UINT64_MIN = 0n;
export const UINT64_MAX = 18446744073709551615n;

export const BIT_32_FLOAT_MAX = 3.4028234663852886e+38;
export const BIT_32_FLOAT_MIN = 1.1754943508222875e-38;

export const NUMBER_TYPE_CONFIGS = {
  u_int_8:  { min: 0, max: 255 },
  u_int_16: { min: 0, max: 65535 },
  u_int_32: { min: 0, max: 4294967295 },
  int_8:    { min: -128, max: 127 },
  int_16:   { min: -32768, max: 32767 },
  int_32:   { min: -2147483648, max: 2147483647 },
  percent:  { min: 0, max: 100 },
};