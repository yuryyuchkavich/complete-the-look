<template>
  <div
    v-if="visible"
    ref="hotspotRef"
    class="hotspot"
    :class="{ 'hotspot--clicked': isClicked }"
    :style="style"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @click="handleHotspotClick"
  >
    <span class="dot"></span>
    <Teleport to="body">
      <div 
        v-if="isActive" 
        ref="tooltipRef"
        :id="tooltipId"
        class="tooltip" 
        :style="tooltipStyle"
        @mouseenter="handleTooltipEnter"
        @mouseleave="handleTooltipLeave"
      >
        <div class="tooltip-content">
          <ProductInfo :item="item" variant="tooltip" />
        </div>
        <a :href="item.url" target="_blank" class="tooltip-arrow">
          <SvgIcon name="right" size="14" />
        </a>
        <div class="tooltip-pointer"></div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, nextTick, onUnmounted, watch } from 'vue';
import SvgIcon from './SvgIcon.vue';
import ProductInfo from './ProductInfo.vue';

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  style: {
    type: Object,
    default: () => ({})
  },
  visible: {
    type: Boolean,
    default: false
  }
});

const hotspotRef = ref(null);
const tooltipRef = ref(null);
const isActive = ref(false);
const tooltipStyle = ref({});
const tooltipHovered = ref(false);
const isClicked = ref(false);
const tooltipId = `tooltip-${props.item.id}`;

function updateTooltipPosition() {
  if (!hotspotRef.value || !isActive.value) return;
  
  // Пробуем использовать ref, если он доступен, иначе ищем по ID
  const tooltipEl = tooltipRef.value || document.getElementById(tooltipId);
  if (!tooltipEl) {
    // Если элемент еще не отрендерился, попробуем еще раз через requestAnimationFrame
    requestAnimationFrame(() => {
      updateTooltipPosition();
    });
    return;
  }
  
  const rect = hotspotRef.value.getBoundingClientRect();
  
  // Используем getBoundingClientRect для более точных размеров
  const tooltipRect = tooltipEl.getBoundingClientRect();
  let tooltipWidth = tooltipRect.width;
  let tooltipHeight = tooltipRect.height;
  
  // Если размеры еще не определены (элемент еще не отрисован), используем fallback
  if (tooltipWidth === 0 || tooltipHeight === 0) {
    tooltipWidth = tooltipEl.offsetWidth || 250;
    tooltipHeight = tooltipEl.offsetHeight || 100;
    
    // Если и offsetWidth равен 0, откладываем вычисление
    if (tooltipWidth === 0 || tooltipHeight === 0) {
      requestAnimationFrame(() => {
        updateTooltipPosition();
      });
      return;
    }
  }
  
  const pointerSize = 8; // размер стрелки

  let left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
  let top = rect.top - tooltipHeight - 2; // тултип очень близко к точке (только размер стрелки)

  // Проверка границ экрана
  if (left < 10) left = 10;
  if (left + tooltipWidth > window.innerWidth - 10) {
    left = window.innerWidth - tooltipWidth - 10;
  }

  // Вычисление позиции стрелки
  const pointerLeft = rect.left + (rect.width / 2) - left;

  tooltipStyle.value = {
    left: left + 'px',
    top: top + 'px',
    '--pointer-left': pointerLeft + 'px',
    transform: 'none'
  };
}

let hideTimeout = null;

function handleHotspotClick(event) {
  event.stopPropagation();
  event.preventDefault();
  isClicked.value = true;
}

function handleMouseEnter(event) {
  event.stopPropagation();
  isActive.value = true;
  // Используем задержку для того, чтобы ref был доступен после рендеринга через Teleport
  setTimeout(() => {
    updateTooltipPosition();
  }, 0);
  window.addEventListener('scroll', updateTooltipPosition, true);
  window.addEventListener('resize', updateTooltipPosition);
  
  // Отменяем таймер закрытия, если он был установлен
  if (hideTimeout) {
    clearTimeout(hideTimeout);
    hideTimeout = null;
  }
}

function handleMouseLeave(event) {
  event.stopPropagation();
  // Не закрываем сразу, даем время навести на тултип
  // Устанавливаем tooltipHovered в false сразу, но закрываем только если мышь действительно ушла
  hideTimeout = setTimeout(() => {
    if (!tooltipHovered.value) {
      isActive.value = false;
      window.removeEventListener('scroll', updateTooltipPosition, true);
      window.removeEventListener('resize', updateTooltipPosition);
    }
    hideTimeout = null;
  }, 150);
}

function handleTooltipEnter(event) {
  event.stopPropagation();
  tooltipHovered.value = true;
  // Отменяем таймер закрытия, если он был установлен
  if (hideTimeout) {
    clearTimeout(hideTimeout);
    hideTimeout = null;
  }
  // Убеждаемся, что тултип активен
  if (!isActive.value) {
    isActive.value = true;
    setTimeout(() => {
      updateTooltipPosition();
    }, 0);
    window.addEventListener('scroll', updateTooltipPosition, true);
    window.addEventListener('resize', updateTooltipPosition);
  }
}

function handleTooltipLeave(event) {
  event.stopPropagation();
  tooltipHovered.value = false;
  // Закрываем тултип сразу, когда мышь уходит с тултипа
  isActive.value = false;
  window.removeEventListener('scroll', updateTooltipPosition, true);
  window.removeEventListener('resize', updateTooltipPosition);
  if (hideTimeout) {
    clearTimeout(hideTimeout);
    hideTimeout = null;
  }
}

// Следим за появлением tooltipRef и обновляем позицию
watch([isActive, tooltipRef], () => {
  if (isActive.value && tooltipRef.value) {
    setTimeout(() => {
      updateTooltipPosition();
    }, 0);
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', updateTooltipPosition, true);
  window.removeEventListener('resize', updateTooltipPosition);
  if (hideTimeout) {
    clearTimeout(hideTimeout);
  }
});
</script>

<style scoped>
.hotspot {
  position: absolute;
  transform: translate(-50%, -50%) scale(1);
  cursor: pointer;
  width: 1.25rem;
  height: 1.25rem;
  display: block;
  opacity: 1;
  transition: opacity 0.3s ease, transform 0.3s ease;
  z-index: 10000;
}

.dot {
  width: 100%;
  height: 100%;
  background: var(--bg-primary);
  border: 0.125rem solid var(--other-secondary);
  border-radius: 50%;
  box-sizing: border-box;
  display: block;
  transition: transform 0.2s, box-shadow 0.2s, background 0.2s, border-color 0.2s;
}

.hotspot:hover .dot {
  transform: scale(1.3);
  box-shadow: 0 0 0.375rem rgba(0,0,0,0.25);
  background: var(--text-tertiary);
  border-color: var(--other-secondary);
}

.hotspot--clicked .dot {
  background: var(--other-secondary);
  border-color: var(--other-secondary);
}
</style>

<style>
.tooltip {
  position: fixed;
  background: var(--bg-primary);
  border-radius: 0.625rem;
  white-space: normal;
  min-width: 13.75rem;
  max-width: 18.75rem;
  box-shadow: 0 0.25rem 1.25rem rgba(0,0,0,.15);
  z-index: 999999;
  display: flex;
  align-items: stretch;
  padding: 0;
  overflow: hidden;
  pointer-events: auto;
}

.tooltip-content {
  padding: 0.875rem 1rem;
  flex: 1;
  text-align: left;
  pointer-events: auto;
}

.tooltip-arrow {
  padding: 0.875rem 0.625rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--other-secondary);
  flex-shrink: 0;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s;
}

.tooltip-arrow:hover {
  color: var(--text-primary);
}

.tooltip-pointer {
  position: absolute;
  bottom: -0.5rem;
  left: var(--pointer-left, 50%);
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 0.5rem solid transparent;
  border-right: 0.5rem solid transparent;
  border-top: 0.5rem solid var(--bg-primary);
}
</style>

