<script setup>
import { ref, onMounted } from 'vue'
import { argbFromRgb, themeFromSourceColor, applyTheme } from '@material/material-color-utilities'
const avatar = ref(null)
onMounted(() => {
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
</script>

<template>
  <img
    ref="avatar"
    src="https://avatars.githubusercontent.com/u/81231195"
    alt="Avatar"
    crossOrigin="Anonymous"
  />
</template>

<style>
body {
  background-color: var(--md-sys-color-primary-container);
}
</style>
