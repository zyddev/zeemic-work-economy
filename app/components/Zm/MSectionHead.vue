<template>
  <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 20px 8px' }">
    <span :style="{ font: '500 12px var(--zm-font-body)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--zm-fg-muted)' }">
      <slot />
    </span>
    <slot name="action" />
  </div>
</template>
