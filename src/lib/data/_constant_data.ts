import type { ComponentWithIcon, EditorTab, EngineStore } from "./_definitions";

export const LOCAL_STORAGE_KEY_PREFERENCES = 'swaggappAutosavePreferences';
export const ENGINE_VERSION = '0.0.1';
export const WEBAPP_VERSION = '0.0.11';

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

    logEngineStore: true,
    logUserPreferenceStore: true,
    logMainEditorLayout: true,
    logElementTabContent: true,
    logComponentCard: true,
    logSchemaLoader: true,
    logOneko: false,

    currentProjectIdKey: '',
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

export const INITIAL_STATIC_DATA_STORE: Record<string, any> = {
  isOnekoTransitioningState: false,
}

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

export const TYPE_ICON_SVGS = {
  item: `<svg width="100%" height="100%" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path d="M7.936,11.97a1,1,0,1,0-1.415,1.414l.373.372L3.3,17.35a1.024,1.024,0,0,0,0,1.448l1.9,1.9a1.024,1.024,0,0,0,1.448,0l3.593-3.593.372.372a1,1,0,0,0,1.414-1.415Z"></path> <polygon points="14.3 3 9.015 10.928 13.071 14.985 21 9.7 21 3 14.3 3"></polygon> </svg>`,
  tile: `<svg width="100%" height="100%" viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg"> <path d="m28 26.641 22.078-12.539c-0.3519-0.3516-0.7738-0.6328-1.2893-0.9141l-16.523-9.4218c-1.4531-0.8204-2.8594-1.2657-4.2657-1.2657-1.4062 0-2.8125 0.4453-4.2656 1.2657l-16.523 9.4218c-0.5156 0.2813-0.9375 0.5625-1.2891 0.9141zm-1.5937 26.859v-24.047l-22.008-12.563c-0.1172 0.5157-0.1875 1.0782-0.1875 1.7813v18.258c0 3.3984 1.1953 4.6641 3.375 5.9063l18.352 10.453c0.1641 0.0937 0.3047 0.1641 0.4688 0.2109zm3.1875 0c0.1641-0.0468 0.3047-0.1172 0.4688-0.2109l18.352-10.453c2.1797-1.2422 3.3749-2.5079 3.3749-5.9063v-18.258c0-0.7031-0.0701-1.2656-0.1872-1.7813l-22.008 12.563z"/> </svg>`,
  entity: `<svg width="100%" height="100%" viewBox="0 -32 576 576" xmlns="http://www.w3.org/2000/svg"> <path d="M298.06,224,448,277.55V496a16,16,0,0,1-16,16H368a16,16,0,0,1-16-16V384H192V496a16,16,0,0,1-16,16H112a16,16,0,0,1-16-16V282.09C58.84,268.84,32,233.66,32,192a32,32,0,0,1,64,0,32.06,32.06,0,0,0,32,32ZM544,112v32a64,64,0,0,1-64,64H448v35.58L320,197.87V48c0-14.25,17.22-21.39,27.31-11.31L374.59,64h53.63c10.91,0,23.75,7.92,28.62,17.69L464,96h64A16,16,0,0,1,544,112Zm-112,0a16,16,0,1,0-16,16A16,16,0,0,0,432,112Z"/> </svg>`,
  command: `<svg width="100%" height="100%" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"> <path d="m8.01 0.85858-2 14 1.9799 0.2828 2-14-1.9799-0.28284z"/> <path d="M12.5 11.5L11.0858 10.0858L13.1716 8L11.0858 5.91422L12.5 4.5L16 8L12.5 11.5Z"/> <path d="M2.82843 8L4.91421 10.0858L3.5 11.5L0 8L3.5 4.5L4.91421 5.91422L2.82843 8Z"/> </svg>`,
  boss: `<svg width="100%" height="100%" viewBox="0 0 464.3 464.3" xmlns="http://www.w3.org/2000/svg"> <ellipse cx="241.65" cy="80.058" rx="25.109" ry="23.54"/> <path d="m9.592 253.94 36.538 20.549c0.317 1.122 0.683 2.203 1.016 3.316l-15.729 22.752c-5.105 7.389-2.495 16.111 5.853 19.411 9.917 3.926 23.166 9.08 34.847 13.355 7.194 11.339 15.314 21.679 24.239 30.799-14.802 21.362-26.564 43.992-28.645 71.231-1.252 16.387 24.223 16.265 25.459 0 1.553-20.338 10.803-38.091 22.134-54.575 11.152 8.348 23.191 14.948 35.863 19.647v9.657c0 4.91 2.455 17.192 0.325 21.671-7.007 14.745 14.94 27.678 21.988 12.851 3.707-7.795 3.609-15.469 3.211-23.931-0.211-4.552-0.187-9.128-0.179-13.705 6.17 0.935 12.429 1.504 18.793 1.504 20.476 0 40.025-5.015 57.989-14.046 1.496 2.032 2.999 4.048 4.438 6.153 10.218 14.973 10.819 29.938 10.86 47.503 0.033 16.42 25.499 16.42 25.459 0-0.041-17.411-0.154-35.026-8.462-50.722-3.008-5.682-6.609-11.144-10.421-16.477 11.006-8.218 21.118-18.135 30.222-29.377 37.773 5.267 67.735 31.685 76.823 70.255 3.764 15.981 28.312 9.202 24.556-6.771-10.348-43.967-43.683-75.913-85.423-86.325 19.346-32.376 31.108-72.45 32.189-115.98 0.431-0.317 0.862-0.593 1.301-0.935l98.957-78.4c4.593-3.642 7.779-7.657 9.73-11.795-34.668 0.382-77.734 1.122-105.53 1.203-1.325 0-2.471-0.26-3.471-0.699-6.178-2.666-6.267-12.42-0.317-15.387 1.081-0.536 2.317-0.886 3.796-0.894 28.003-0.081 71.499-0.837 106.3-1.211-2.309-5.755-7.267-10.99-14.867-14.883-31.685-16.216-77.693-40.049-111.81-58.883-10.941-17.078-28.686-26.897-57.428-26.897-158.65 0-220.57 60.712-237.83 144.02l-16.395 2.26c-11.778 1.626-15.834 10.567-9.063 19.964l20.094 27.881c-0.057 2.707-0.114 5.422-0.114 8.153 0 0.374 0.024 0.748 0.024 1.122l-29.117 20.37c-11.062 7.738-10.249 19.492 1.798 26.263zm232.05-209c20.687 0 37.456 15.721 37.456 35.115s-16.769 35.115-37.456 35.115-37.456-15.72-37.456-35.115c0-19.386 16.769-35.115 37.456-35.115z"/> </svg>`
}