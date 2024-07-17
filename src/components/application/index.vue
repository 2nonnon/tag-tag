<script setup lang="ts">
import useDrawer from '@/components/drawer-provider/useDrawer'

const WindowExposed = defineComponent({
  setup() {
    window.$dialog = useDialog()
    window.$message = useMessage()
    window.$loading = useLoadingBar()
    window.$drawer = useDrawer()
    window.$modal = useModal()
  },
  render() {
    return null
  },
})
</script>

<template>
  <n-loading-bar-provider>
    <n-modal-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <n-message-provider>
            <drawer-provider>
              <WindowExposed />
              <slot />
            </drawer-provider>
          </n-message-provider>
        </n-notification-provider>
      </n-dialog-provider>
    </n-modal-provider>
  </n-loading-bar-provider>
</template>
