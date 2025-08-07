<!-- eslint-disable no-undef -->
<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTelegram, faGithub } from '@fortawesome/free-brands-svg-icons'
import { ref, onMounted, watch } from 'vue'
import {
  themeFromSourceColor,
  sourceColorFromImage,
  applyTheme,
} from '@material/material-color-utilities'

const avatar = ref(null)
const avatarUrl = ref('/avatar?user=81231195')
const user = ref({})
const hash = ref(null)

const applyColors = async () => {
  await new Promise((resolve) => {
    if (avatar.value.complete) {
      resolve()
    } else {
      avatar.value.onload = resolve
    }
  })

  applyTheme(themeFromSourceColor(await sourceColorFromImage(avatar.value)), {
    target: document.documentElement,
  })

  document.body.style.background = `
    linear-gradient(
      color-mix(in srgb, var(--md-sys-color-primary-container), transparent 50%),
      color-mix(in srgb, var(--md-sys-color-primary-container), transparent 50%)
    ),
    url('${avatar.value.src}') center/cover no-repeat
  `
}

onMounted(async () => {
  hash.value = GIT_HASH

  await applyColors()

  const res = await fetch('https://api.littlew.top/user', {
    credentials: 'include',
  })
  Object.assign(user.value, await res.json())

  avatarUrl.value = `/avatar?user=${user.value.id || '81231195'}`
})

watch(avatarUrl, async (newVal) => {
  if (newVal) {
    await applyColors()
  }
})
</script>

<template>
  <div class="flex flex-col-reverse justify-around md:h-screen md:flex-row">
    <header class="motion-safe:animate-fade-up px-16 pt-8 text-left md:max-w-1/2 md:pt-24">
      <h1 class="text-4xl/relaxed font-bold md:text-7xl/relaxed">Hi,</h1>
      <p class="text-2xl font-semibold md:text-5xl/tight">
        <span
          v-if="user.id"
          class="relative inline-block overflow-hidden text-(--md-sys-color-primary-container) before:absolute before:inset-0 before:z-[-1] before:[animation:slideIn_1s_forwards] before:bg-(--md-sys-color-primary) before:[--slideIn:inset_0_auto_auto_0_calc(100%)] md:text-6xl/tight"
        >
          {{ user.name || user.username }}
        </span>
        <span v-else> 來自「{{ user.asorg || '未至之境' }}」的朋友</span>
        <span>。</span>
      </p>
      <div class="w-3/5 pt-30 text-4xl font-medium md:text-6xl">
        <div class="aria-hidden mb-3 h-3 bg-black md:mb-4 md:h-4" />
        <a
          class="rounded-full px-2 pt-1 transition-colors duration-500 hover:text-[#229ED9] focus:text-[#229ED9]"
          href="https://t.me/LittleChestW"
          rel="nofollow noreferrer"
          alt="開啟 Telegram 個人資料"
          ><FontAwesomeIcon class="aria-hidden" :icon="faTelegram"
        /></a>
        <a
          class="rounded-full px-2 pt-1"
          href="https://github.com/LittleChest"
          rel="nofollow noreferrer"
          alt="開啟 GitHub 個人資料"
          ><FontAwesomeIcon class="aria-hidden" :icon="faGithub"
        /></a>
      </div>
    </header>
    <div
      class="motion-safe:hover:animate-infinite motion-safe:hover:animate-duration-[2000ms] mx-16 mt-16 self-center bg-(--md-sys-color-primary) mask-[url(/shape.svg)] mask-cover mask-center mask-no-repeat p-1 motion-safe:hover:animate-spin motion-safe:hover:[animation-delay:1.5s] min-[480px]:max-w-1/2"
    >
      <img
        ref="avatar"
        :src="avatarUrl"
        alt="頭像"
        class="h-1/1 w-1/1 mask-[url(/shape.svg)] mask-cover mask-center mask-no-repeat"
      />
    </div>
    <footer
      class="fixed bottom-3 left-6 flex flex-col text-xs font-medium text-(--md-sys-color-primary) md:bottom-4 md:left-8 md:text-sm"
    >
      <span v-if="user.id">GitHub: {{ user.id }}</span>
      <a
        v-else
        href="https://api.littlew.top/auth?referer=true"
        class="cursor-pointer no-underline hover:underline"
        @click="$event.target.innerText = `GitHub: 登入中...`"
        referrerpolicy="unsafe-url"
      >
        GitHub: 未登入
      </a>
      <span @click="$event.target.innerText = `星靈感應@${hash}`">星靈感應 Project</span>
    </footer>
    <footer
      class="fixed right-6 bottom-3 flex flex-col text-left text-xs font-medium text-(--md-sys-color-primary) md:right-8 md:bottom-4 md:text-sm"
    >
      <span>Colo: {{ user.colo || '未知' }}</span>
      <span>ASN: {{ user.asn || '未知' }}</span>
      <span @click="$event.target.innerText = `IP: ${user.ip || '未知'}`"
        >IP: {{ user.pseudo || user.ip || '未知' }}</span
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
  backdrop-filter: blur(24px);
}

body {
  @media (prefers-contrast: more) {
    background: var(--md-sys-color-primary-container);
  }
}

body {
  @media (prefers-contrast: more) {
    backdrop-filter: blur(0px);
  }
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}
</style>
