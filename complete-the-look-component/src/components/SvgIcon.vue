<script setup>
import { computed } from 'vue'

const props = defineProps({
    name: {
        type: String,
        required: true
    },
    size: {
        type: String,
        default: '24'
    }
})

const iconHref = computed(() => {
    return `/icons.svg#${props.name}`
});
</script>
<template>
    <svg :width="size" :height="size" class="svg-icon">
        <use :['xlink:href']="iconHref"></use>
    </svg>
</template>
<style scoped>
.svg-icon {
    display: inline-block;
    vertical-align: middle;
    color: inherit;
    fill: transparent;
}
</style>

