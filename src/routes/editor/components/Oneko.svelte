<script lang="ts">
    import { ONEKO_SKINS } from "$lib/data/_constant_data";
    import { userPreferenceStore } from "$lib/stores/userPreferenceStore";
  import { onDestroy, onMount } from "svelte";
    import { debugLog } from "../utils/util";
    import { staticDataStore } from "$lib/stores/staticDataStore";

  let kittyElement: HTMLDivElement | undefined = $state();

  let kittyKind: keyof typeof ONEKO_SKINS = $derived($userPreferenceStore.preferences.onekoSkin);
  let kittenImageUrl = $derived(ONEKO_SKINS[kittyKind]);

  $effect(() => {
    kittenImageUrl = ONEKO_SKINS[kittyKind];
  })

  const animationDirections = [
    'runbottomright',
    'rundown',
    'runbottomleft',
    'runleft',
    'runtopleft',
    'runup',
    'runtopright',
    'runright',
  ];

  const kittySpeed = 10;
  const runAnimationInterval = 0.25;
  const wakeUpAnimationInterval = 0.75;
  const sleepAnimationInterval = 1;
  const goToSleepAnimationInterval = 1.5;

  const timeToGetSleepy = 3000;
  const timeToSleep = 1000;
  const timeToWakeUp = 250;

  let mouseX = $state(0)
  let mouseY = $state(0)
  let kittyX = $state(-50);
  let kittyY = $state(500);
  let currentAnimation = $state('sleep');
  let kittyState = $state('state-sleep');
  let lastState = $state('');
  let lastFrameState = $state('');
  let animationInterval = $state(0.25);
  let transitionTimeoutId : any | undefined;
  
  function updateKittyState() {
    if (!$userPreferenceStore.preferences.oneko && kittyElement) {
        kittyElement.style.opacity = '0';
        return;
    } else if (kittyElement) {
        kittyElement.style.opacity = '1';
    }

    if (kittyState != lastFrameState) {
      debugLog("oneko", "Current Oneko state:", kittyState, "|| Last Oneko state:", lastState);
    }

    const dx = mouseX - kittyX;
    const dy = mouseY - kittyY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // immediate conditional state changes

    if (distance > 50) {
      switch (kittyState) {
        case "state-sleep": changeState("state-waking-up", true); break;
        case "state-standing": changeState("state-running", true); break;
        default: break;
      }
    } else {
      switch (kittyState) {
        case "state-running": changeState("state-standing", true); break;
        default: break;
      }
    }

    // functionality (position change, animation change, delayed state change)

    switch (kittyState) {
      case "state-running": {
        kittyX += (dx / distance) * kittySpeed;
        kittyY += (dy / distance) * kittySpeed;

        let angle = Math.atan2(dy, dx);
        
        let degrees = angle * (180 / Math.PI);
        if (degrees < 0) {
          degrees += 360;
        }

        degrees -= 22.5;
        if (degrees < 0) {
          degrees += 360;
        }

        const directionIndex = Math.floor(degrees / 45);
        currentAnimation = animationDirections[directionIndex];
        animationInterval = runAnimationInterval;
      }; break;

      case "state-standing": {
        currentAnimation = "standing"
        transitionState("state-go-to-sleep", timeToGetSleepy);
      }; break;

      case "state-go-to-sleep": {
        currentAnimation = "gotosleep"
        animationInterval = goToSleepAnimationInterval;
        transitionState("state-sleep", timeToSleep);
      }; break;

      case "state-sleep": {
        currentAnimation = "sleep"
        animationInterval = sleepAnimationInterval;
      }; break;

      case "state-waking-up": {
        currentAnimation = "wakeup"
        animationInterval = wakeUpAnimationInterval;
        transitionState("state-standing", timeToWakeUp);
      }; break;

      default: break;
    }

    lastFrameState = kittyState;
  }

  function transitionState(state: string, delay: number) {
    if ($staticDataStore.isOnekoTransitioningState) {
      return;
    }

    $staticDataStore.isOnekoTransitioningState = true;
    debugLog("oneko", "Oneko transitioning state to", state, "from", kittyState, "in", delay, "ms")
    transitionTimeoutId = setTimeout(() => {
        changeState(state, false);
        transitionTimeoutId = undefined;
        $staticDataStore.isOnekoTransitioningState = false;
    }, delay);
  }

  function changeState(state: string, shouldClearTimeout: boolean) {
    lastState = kittyState;
    kittyState = state;
    if (shouldClearTimeout) clearTimeout(transitionTimeoutId);
  }

  function handleMouseMove(event: MouseEvent) {
    mouseX = event.clientX;
    mouseY = event.clientY;
  }

  function handleAnimationIteration() {
    updateKittyState()
    setTimeout(() => updateKittyState(), (runAnimationInterval * 1000) / 2);
  }

  onMount(() => {
    window.addEventListener('mousemove', handleMouseMove);
    if (kittyElement) {
      kittyElement.addEventListener('animationiteration', handleAnimationIteration);
    }
  });

  onDestroy(() => {
    if (kittyElement) {
      kittyElement.removeEventListener('animationiteration', handleAnimationIteration);
    }
  });
</script>

<div bind:this={kittyElement} 
class="kitty-sprite fixed z-[10000]" 
style="animation: {currentAnimation} {animationInterval}s steps(2) infinite;
left: {kittyX}px;
top: {kittyY}px;
background-image: url('{kittenImageUrl}');">
</div>

<style>
  @import '../css/onekoanimations.css';

  .kitty-sprite {
    width: 32px;
    height: 32px;
    background-repeat: no-repeat;
    pointer-events: none;
    transform: translate(-50%, -50%);
  }
</style>