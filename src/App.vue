<!-- eslint-disable no-undef -->
<script setup>
import { ref, onMounted } from 'vue'
import { argbFromRgb, themeFromSourceColor, applyTheme } from '@material/material-color-utilities'
const avatar = ref(null)
const hash = ref(null)
onMounted(() => {
  hash.value = GIT_HASH
  avatar.value.onload = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    ctx.drawImage(avatar.value, 0, 0)
    const { data } = ctx.getImageData(0, 0, 1, 1)
    applyTheme(themeFromSourceColor(argbFromRgb(data[0], data[1], data[2])), {
      target: document.documentElement,
    })
    canvas.remove()
  }
})
const meta = ref({})
fetch('_worker')
  .then((res) => res.json())
  .then((data) => Object.assign(meta.value, data))
</script>

<template>
  <div class="flex flex-col justify-around md:flex-row">
    <header class="animate-fade-up order-last px-16 pt-8 text-left md:order-first md:pt-24">
      <h1 class="text-4xl/relaxed font-bold md:text-8xl/relaxed">Hi,</h1>
      <p class="text-2xl font-semibold md:text-5xl">
        來自「{{ meta.asorg || '未至之境' }}」的朋友。
      </p>
    </header>
    <div
      class="hover:animate-infinite hover:animate-duration-[2000ms] order-first mx-16 mt-16 bg-(--md-sys-color-primary) mask-[url(/shape.png)] mask-cover mask-center mask-no-repeat p-1 hover:animate-spin hover:[animation-delay:1.5s] md:order-last md:mt-64"
    >
      <img
        ref="avatar"
        :src="'/avatar'"
        alt="Avatar"
        class="mask-[url(/shape.png)] mask-cover mask-center mask-no-repeat"
      />
    </div>
    <p
      class="fixed bottom-3 left-6 text-xs font-medium text-(--md-sys-color-primary) md:bottom-4 md:left-8 md:text-sm"
      @click="$event.target.innerText = `星靈感應@${hash}`"
    >
      星靈感應 Project
    </p>
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
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@100..900&display=swap');

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

@font-face {
  font-family: 'Google Sans';
  font-style: normal;
  font-weight: 400;
  src: url(https://fonts.gstatic.com/s/googlesans/v62/4UasrENHsxJlGDuGo1OIlJfC6l_24rlCK1Yo_Iqcsih3SAyH6cAwhX9RPjIUvQ.woff2)
    format('woff2');
  unicode-range:
    U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329,
    U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Google Sans';
  font-style: normal;
  font-weight: 500;
  src: url(https://fonts.gstatic.com/s/googlesans/v62/4UasrENHsxJlGDuGo1OIlJfC6l_24rlCK1Yo_Iqcsih3SAyH6cAwhX9RPjIUvQ.woff2)
    format('woff2');
  unicode-range:
    U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329,
    U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Google Sans';
  font-style: normal;
  font-weight: 700;
  src: url(https://fonts.gstatic.com/s/googlesans/v62/4UasrENHsxJlGDuGo1OIlJfC6l_24rlCK1Yo_Iqcsih3SAyH6cAwhX9RPjIUvQ.woff2)
    format('woff2');
  unicode-range:
    U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329,
    U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
</style>
