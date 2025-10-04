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

  updateShadow()
  setInterval(() => {
    updateShadow()
  }, 60 * 1000)
})

watch(avatarUrl, async (newVal) => {
  if (newVal) {
    await applyColors()
    updateShadow()
  }
})

// 角度弧度转换
const d2r = (d) => (d * Math.PI) / 180
const r2d = (r) => (r * 180) / Math.PI

// 计算儒略日
function toJulianDate(date) {
  return date.getTime() / 86400000 + 2440587.5
}

// 计算方位角和高度角
function getSunPosition(date, latDeg, lonDeg) {
  if (latDeg == null || lonDeg == null) return null

  const JD = toJulianDate(date)
  const n = JD - 2451545.0

  // 太阳的平均经度与平均近点角
  const L = (280.46 + 0.9856474 * n) % 360
  const g = (357.528 + 0.9856003 * n) % 360

  // 太阳黄经
  const lambda = L + 1.915 * Math.sin(d2r(g)) + 0.02 * Math.sin(d2r(2 * g))

  // 黄道倾角
  const epsilon = 23.439 - 0.0000004 * n

  // 赤纬
  const dec = r2d(Math.asin(Math.sin(d2r(epsilon)) * Math.sin(d2r(lambda))))

  // 太阳时角
  const sidereal = (280.46061837 + 360.98564736629 * (JD - 2451545.0)) % 360
  const H =
    (sidereal +
      lonDeg -
      r2d(Math.atan2(Math.cos(d2r(epsilon)) * Math.sin(d2r(lambda)), Math.cos(d2r(lambda))))) %
    360

  // 转弧度
  const Hrad = d2r(((H + 540) % 360) - 180) // 归一到 [-180,180] 再转弧度
  const latRad = d2r(latDeg)
  const decRad = d2r(dec)

  // 高度角
  const elevation = r2d(
    Math.asin(
      Math.sin(latRad) * Math.sin(decRad) + Math.cos(latRad) * Math.cos(decRad) * Math.cos(Hrad),
    ),
  )

  // 方位角
  const azRad = Math.atan2(
    -Math.sin(Hrad),
    Math.tan(decRad) * Math.cos(latRad) - Math.sin(latRad) * Math.cos(Hrad),
  )
  let azimuth = (r2d(azRad) + 360) % 360 // 归一为 [0,360)

  return {
    elevation,
    azimuth,
  }
}

function updateShadow() {
  const targets = Array.from(document.querySelectorAll('.nature-shadow'))
  if (targets.length === 0) return

  const lat = parseFloat(user.value.latitude)
  const lon = parseFloat(user.value.longitude)
  const pos = getSunPosition(new Date(), lat, lon)

  // 无法计算时清理样式
  if (!pos) {
    targets.forEach((el) => {
      el.style.filter = ''
      el.style.transition = ''
    })
    return
  }

  const elevDeg = pos.elevation
  const azDeg = pos.azimuth

  // 夜间阈值：太阳高度 <= -6° 视为“夜晚”，不应有投影
  if (elevDeg <= -6) {
    targets.forEach((el) => {
      el.style.filter = ''
      el.style.transition = ''
    })
    return
  }

  const elevRad = d2r(elevDeg)
  const azRad = d2r(azDeg)

  const isTwilight = elevDeg > -6 && elevDeg <= 0

  targets.forEach((el) => {
    // 获取元素高度
    const rect = el.getBoundingClientRect()
    const intrinsic = el.naturalHeight || el.clientHeight || rect.height
    const objHeightPx = Math.max(48, rect.height || intrinsic || 128)

    // 计算阴影长度
    let rawShadowLenPx
    if (isTwilight) {
      rawShadowLenPx = objHeightPx * 1.0 // 暮色：使用接近物体高度的弱影长度
    } else {
      rawShadowLenPx = objHeightPx / Math.tan(elevRad)
    }
    const shadowLenPx = Math.min(400, Math.max(4, rawShadowLenPx))

    // 偏移（太阳方向的反向）
    const offsetX = -shadowLenPx * Math.sin(azRad)
    const offsetY = shadowLenPx * Math.cos(azRad)

    // 模糊与不透明度
    const baseBlur = Math.min(80, Math.max(2, (1 - Math.sin(elevRad)) * 40))
    const blurPx = isTwilight ? Math.min(80, baseBlur * 1.5) : baseBlur
    const baseAlpha = Math.min(0.8, Math.max(0.06, 0.15 + (1 - Math.sin(elevRad)) * 0.6))
    const alpha = isTwilight ? Math.max(0.02, baseAlpha * 0.35) : baseAlpha

    const filterValue = `drop-shadow(${offsetX.toFixed(1)}px ${offsetY.toFixed(1)}px ${blurPx.toFixed(1)}px rgba(0,0,0,${alpha.toFixed(2)}))`
    const transitionValue = 'filter 600ms ease'

    el.style.filter = filterValue
    el.style.transition = transitionValue
  })
}
</script>

<template>
  <div class="flex flex-col-reverse justify-around md:h-screen md:flex-row">
    <header
      class="motion-safe:animate-fade-up px-16 pt-8 text-left md:max-w-1/2 md:min-w-1/3 md:pt-24"
    >
      <h1 class="nature-shadow text-4xl/relaxed font-bold md:text-7xl/relaxed">Hi,</h1>
      <p class="nature-shadow text-2xl font-semibold md:text-5xl/tight">
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
      class="nature-shadow motion-safe:hover:animate-infinite motion-safe:hover:animate-duration-[2000ms] mx-16 mt-16 self-center bg-(--md-sys-color-primary) mask-[url(/shape.svg)] mask-cover mask-center mask-no-repeat p-1 motion-safe:hover:animate-spin motion-safe:hover:[animation-delay:1.5s] min-[480px]:max-w-1/2"
    >
      <img
        ref="avatar"
        :src="avatarUrl"
        alt="頭像"
        class="nature-shadow h-1/1 w-1/1 mask-[url(/shape.svg)] mask-cover mask-center mask-no-repeat"
      />
    </div>
    <footer
      class="nature-shadow fixed bottom-3 left-6 flex flex-col text-xs font-medium text-(--md-sys-color-primary) md:bottom-4 md:left-8 md:text-sm"
    >
      <template v-if="user.id">
        <a
          v-if="user.last_login"
          href="https://api.littlew.top/auth?referer=true"
          class="cursor-pointer no-underline hover:underline"
          @click="$event.target.innerText = `GitHub: 登入中...`"
          referrerpolicy="unsafe-url"
        >
          GitHub: {{ user.id }} [過期]
        </a>
        <span v-else>GitHub: {{ user.id }}</span>
      </template>
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
      class="nature-shadow fixed right-6 bottom-3 flex flex-col text-left text-xs font-medium text-(--md-sys-color-primary) md:right-8 md:bottom-4 md:text-sm"
    >
      <span>Latitude: {{ user.latitude || '未知' }}</span>
      <span>Longitude: {{ user.longitude || '未知' }}</span>
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
