<script setup lang="ts">
import type { GlobalThemeOverrides } from 'naive-ui'
import { darkTheme, dateZhCN, zhCN } from 'naive-ui'
import { isDark } from '@/composables/dark'

const getTheme = computed(() => (isDark.value ? darkTheme : undefined))

const getThemeOverrides: GlobalThemeOverrides = {
  common: {
    // primaryColor: 'hsl(var(--primary))',
    // primaryColorHover: 'hsl(var(--primary))',
    // primaryColorPressed: 'hsl(var(--primary))',
    // primaryColorSuppl: 'hsl(var(--primary))',
  },
}
</script>

<template>
  <n-config-provider :theme="getTheme" :locale="zhCN" :date-locale="dateZhCN" :theme-overrides="getThemeOverrides" inline-theme-disabled>
    <Application>
      <RouterView>
        <template #default="{ Component, route }">
          <Transition>
            <KeepAlive>
              <component :is="Component" :key="route.fullPath" />
            </KeepAlive>
          </Transition>
        </template>
      </RouterView>
    </Application>
    <n-global-style />
  </n-config-provider>
</template>
