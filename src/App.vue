<!-- eslint-disable no-undef -->
<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTelegram, faGithub } from '@fortawesome/free-brands-svg-icons'
import { ref, onMounted } from 'vue'
import {
  themeFromSourceColor,
  sourceColorFromImage,
  applyTheme,
} from '@material/material-color-utilities'
const avatar = ref(null)
const hash = ref(null)
onMounted(async () => {
  hash.value = GIT_HASH
  applyTheme(themeFromSourceColor(await sourceColorFromImage(avatar.value))),
    { target: document.documentElement }
})
const meta = ref({})
fetch('_worker')
  .then((res) => res.json())
  .then((data) => Object.assign(meta.value, data))
</script>

<template>
  <div class="flex flex-col-reverse justify-around md:h-screen md:flex-row">
    <header class="animate-fade-up px-16 pt-8 text-left md:max-w-1/2 md:pt-24">
      <h1 class="text-4xl/relaxed font-bold md:text-8xl/relaxed">Hi,</h1>
      <p class="text-2xl font-semibold md:text-5xl/tight">
        來自「{{ meta.asorg || '未至之境' }}」的朋友。
      </p>
      <div class="w-3/5 pt-30 text-4xl font-medium md:w-2/5 md:text-6xl">
        <p class="mb-3 h-3 bg-black md:mb-4 md:h-4" />
        <a
          class="rounded-full px-2 pt-1 transition-colors duration-500 hover:text-[#229ED9] focus:text-[#229ED9]"
          href="https://t.me/LittleChestW"
          rel="nofollow noreferrer"
          ><FontAwesomeIcon :icon="faTelegram"
        /></a>
        <a
          class="rounded-full px-2 pt-1"
          href="https://github.com/LittleChest"
          rel="nofollow noreferrer"
          ><FontAwesomeIcon :icon="faGithub"
        /></a>
      </div>
    </header>
    <div
      class="hover:animate-infinite hover:animate-duration-[2000ms] mx-16 mt-16 self-center bg-(--md-sys-color-primary) mask-[url(/shape.svg)] mask-cover mask-center mask-no-repeat p-1 hover:animate-spin hover:[animation-delay:1.5s] min-[480px]:max-w-1/2"
    >
      <img
        ref="avatar"
        :src="'/avatar'"
        alt="Avatar"
        class="h-1/1 w-1/1 mask-[url(/shape.svg)] mask-cover mask-center mask-no-repeat"
      />
    </div>
    <footer
      class="fixed bottom-3 left-6 text-xs font-medium text-(--md-sys-color-primary) md:bottom-4 md:left-8 md:text-sm"
      @click="$event.target.innerText = `星靈感應@${hash}`"
    >
      星靈感應 Project
    </footer>
    <footer
      class="fixed right-6 bottom-3 flex flex-col text-left text-xs font-medium text-(--md-sys-color-primary) md:right-8 md:bottom-4 md:text-sm"
    >
      <span>Colo: {{ meta.colo || '未知' }}</span>
      <span>ASN: {{ meta.asn || '未知' }}</span>
      <span @click="$event.target.innerText = `IP: ${meta.ip || '未知'}`"
        >IP: {{ meta.pseudo || meta.ip || '未知' }}</span
      >
    </footer>
  </div>
</template>

<style>
html,
body {
  height: 100%;
}

body {
  font-family:
    Google Sans,
    Noto Sans TC;
  margin: 0;
  background:
    linear-gradient(
      color-mix(in srgb, var(--md-sys-color-primary-container), transparent 75%),
      color-mix(in srgb, var(--md-sys-color-primary-container), transparent 75%)
    ),
    url(/avatar);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  backdrop-filter: blur(24px);
}
</style>
