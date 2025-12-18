<template>
  <div class="complete-look">
    <div class="nav-header">
      <h2>Complete the Look</h2>
      <div class="nav-top">
        <button class="nav-btn" @click="prevLook" :disabled="currentLook === 0">
          <SvgIcon name="left" size="24" />
        </button>
        <button class="nav-btn" @click="nextLook" :disabled="currentLook + cardsPerPage >= looks.length">
          <SvgIcon name="right" size="24" />
        </button>
      </div>
    </div>

    <div class="looks-wrapper">
      <div class="looks">
        <div
          v-for="(look, idx) in visibleLooks"
          :key="look.id"
          class="look-card"
          ref="el => setLookRef(el, look.id)"
        >
          <div
            class="look-image"
            @mouseenter="handleLookImageEnter(look.id)"
            @mouseleave="handleLookImageLeave"
          >
            <ImageItem 
              :src="look.image" 
              :alt="look.name" 
              :uid="'look-' + look.id"
              :initial="true"
            />

            <!-- HOTSPOTS -->
            <Hotspot
              v-for="item in look.items"
              :key="item.id"
              :item="item"
              :style="getHotspotStyle(item, look)"
              :visible="hoveredLook === look.id"
            />

            <!-- View look button -->
            <button
              class="view-look-btn overlay"
              :class="{ expanded: hoveredLook === look.id }"
              @click="openModal(currentLook + idx)"
            >
              <span class="icon">👁</span>
              <span class="btn-text">View Entire Look</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <Popup
      ref="popupRef"
      :noHeader="true"
      :showCloseButton="false"
      @hide="closeModal"
    >
      <template #basepopup-content-wrapper>
        <div class="modal-content">
          <div class="modal-left">
            <ImageItem 
              :src="props.looks[selectedLook]?.image" 
              :alt="props.looks[selectedLook]?.name"
              :uid="'modal-look-' + selectedLook"
              :initial="true"
              class="look-image"
            />
            <div class="look-counter">
              {{ selectedLook + 1 }} / {{ props.looks.length }}
            </div>

            <button class="nav nav-left"
                    @click="prevModalLook"
                    :disabled="selectedLook === 0">
              <SvgIcon name="left" size="24" />
            </button>

            <button class="nav nav-right"
                    @click="nextModalLook"
                    :disabled="selectedLook === props.looks.length - 1">
              <SvgIcon name="right" size="24" />
            </button>
          </div>

          <div class="modal-right">
            <button class="modal-close-btn" @click="closeModal">
              <SvgIcon name="delete" size="20" />
            </button>
            <div
              v-for="item in props.looks[selectedLook]?.items"
              :key="item.id"
              class="item-row"
            >
              <ImageItem 
                :src="item.image" 
                :alt="item.name"
                :uid="'item-' + item.id"
                :initial="true"
                class="item-img"
              />

              <ProductInfo :item="item" variant="item" :show-link="true" />
            </div>
          </div>
        </div>
      </template>
    </Popup>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import Popup from './Popup/Popup.vue';
import ImageItem from './ImageItem.vue';
import Hotspot from './Hotspot.vue';
import SvgIcon from './SvgIcon.vue';
import ProductInfo from './ProductInfo.vue';

const props = defineProps({
  looks: Array
});


const popupRef = ref(null);
const selectedLook = ref(0);

function openModal(index) {
  selectedLook.value = index;
  if (popupRef.value) {
    popupRef.value.active();
  }
}
function closeModal() {
  if (popupRef.value) {
    popupRef.value.hide();
  }
}

// Nav Modal
function prevModalLook() {
  if (selectedLook.value > 0) selectedLook.value -= 1;
}
function nextModalLook() {
  if (selectedLook.value < props.looks.length - 1) selectedLook.value += 1;
}


const currentLook = ref(0);
const hoveredLook = ref(null);
const lookRefs = ref({});
let hoverTimeout = null;

function handleLookImageEnter(lookId) {
  // Отменяем таймер закрытия, если он был установлен
  if (hoverTimeout) {
    clearTimeout(hoverTimeout);
    hoverTimeout = null;
  }
  hoveredLook.value = lookId;
}

function handleLookImageLeave() {
  // Не скрываем точки сразу, даем время навести на тултип
  hoverTimeout = setTimeout(() => {
    // Проверяем, есть ли активные тултипы
    const activeTooltip = document.querySelector('.tooltip');
    if (!activeTooltip) {
      hoveredLook.value = null;
    }
    hoverTimeout = null;
  }, 200);
}

function setLookRef(el, id) {
  if (el) lookRefs.value[id] = el;
}

const cardsPerPage = ref(3);

function updateCardsPerPage() {
  const w = window.innerWidth;
  if (w < 480) cardsPerPage.value = 1;
  else if (w < 768) cardsPerPage.value = 2;
  else cardsPerPage.value = 3;
}

//Init
onMounted(() => {
  updateCardsPerPage();
  window.addEventListener('resize', updateCardsPerPage);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateCardsPerPage);
  if (hoverTimeout) {
    clearTimeout(hoverTimeout);
  }
});


const visibleLooks = computed(() =>
  props.looks.slice(currentLook.value, currentLook.value + cardsPerPage.value)
);

// Nav
function prevLook() {
  if (currentLook.value > 0) currentLook.value -= 1;
}

function nextLook() {
  if (currentLook.value + cardsPerPage.value < props.looks.length)
    currentLook.value += 1;
}

function viewLook(look) {
  alert(`Просмотр образа: ${look.name}`);
}

function getHotspotStyle(item, look) {
  const card = lookRefs.value[look.id];
  if (!card) return { left: item.x + '%', top: item.y + '%' };
  const width = card.offsetWidth;
  const height = card.offsetHeight;
  return {
    left: (item.x / 100) * width + 'px',
    top: (item.y / 100) * height + 'px'
  };
}
</script>

<style scoped>
.complete-look {
  padding: 1.5rem;
}

:deep(.popup--noheader .basepopup-content) {
  width: auto;
  max-width: none;
  max-height: 90vh;
}

:deep(.basepopup-overlay) {
  opacity: 1 !important;
  visibility: visible !important;
}

@media (max-width: 768px) {
  :deep(.popup--noheader .basepopup-content) {
    width: 100vw;
    max-width: 100vw;
    max-height: 100vh;
    border-radius: 0;
    margin: 0;
  }

  :deep(.basepopup) {
    z-index: 99999 !important;
  }
}

.nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.nav-header h2 {
  margin: 0;
  font-size: 1.5rem;
  flex: 1;
  text-align: left;
   font-weight: normal;
}

.nav-top {
  display: flex;
  gap: 0.5rem;
}

.nav-btn {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: var(--main-secondary-default);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0.125rem 0.375rem rgba(0,0,0,0.1);
  transition: background 0.2s, transform 0.2s;
  outline: none;
  padding: 0;
}

.nav-btn:hover:not(:disabled) {
  background: var(--main-secondary-hover);
  transform: scale(1.05);
}

.nav-btn:disabled {
  background: var(--main-secondary-default);
  color: var(--other-secondary);
  cursor: default;
}

.nav-btn .svg-icon {
  display: block;
}

.looks-wrapper {
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding-bottom: 1rem;
}

.looks {
  display: flex;
  gap: 1.5rem;
  flex: 1;
}

.look-card {
  flex: 0 0 calc(100% / 3 - 1rem);
  min-width: 12.5rem;
  height: 28.75rem;
  border-radius: 1rem;
  overflow: hidden;
  position: relative;
}

.look-image {
  width: 100%;
  height: 100%;
  position: relative;
}

.look-image :deep(.image__item) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* View look button */
.view-look-btn.overlay {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  background: var(--bg-primary);
  opacity: 0.95;
  border: none;
  border-radius: 1.5rem;
  cursor: pointer;
  box-shadow: 0 0.25rem 0.75rem rgba(0,0,0,.15);
  display: flex;
  align-items: center;
  overflow: hidden;
  width: 2.5rem;
  padding: 0.625rem 0.75rem;
  transition: width 0.3s ease, padding 0.3s ease;
}

.view-look-btn.overlay.expanded {
  width: 10.625rem;
}

.view-look-btn .icon {
  display: inline-block;
}

.view-look-btn .btn-text {
  margin-left: 0.5rem;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s;
}

.view-look-btn.overlay.expanded .btn-text {
  opacity: 1;
}

@media (max-width: 992px) {
  .look-card {
    flex: 0 0 calc(50% - 0.75rem);
  }
}

@media (max-width: 480px) {
  .nav-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .nav-top {
    margin-top: 0.5rem;
  }

  .look-card {
    flex: 0 0 100%;
  }
}

.modal-content {
  display: flex;
  background: var(--bg-primary);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: none;
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 87.5rem;
  max-height: 85vh;
}

.modal-left {
  position: relative;
  flex: 1;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
}

.modal-left .look-image :deep(.image__item) {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  width: 100%;
  height: 100%;
}

.look-counter {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: rgba(0, 0, 0, 0.6);
  color: var(--text-secondary);
  padding: 0.5rem 1rem;
  border-radius: 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.03125rem;
  pointer-events: none;
  z-index: 3;
}

.modal-left .nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: none;
  background: var(--bg-primary);
  opacity: 0.95;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  z-index: 2;
  color: var(--text-primary);
  outline: none;
  padding: 0;
}

.modal-left .nav:focus,
.modal-left .nav:focus-visible {
  outline: none;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.1);
}

.modal-left .nav-left { 
  left: 1.25rem; 
}

.modal-left .nav-right { 
  right: 1.25rem; 
}

.modal-left .nav:hover:not(:disabled) {
  transform: translateY(-50%) scale(1.1);
  background: var(--bg-primary);
  box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.15);
}

.modal-left .nav:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.modal-right {
  flex: 0 0 30rem;
  min-width: 0;
  padding: 0;
  overflow-y: auto;
  overflow-x: hidden;
  background: var(--bg-primary);
  position: relative;
}

.modal-close-btn {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  width: 2rem;
  height: 2rem;
  border: none;
  background: var(--main-secondary-default);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  color: var(--text-primary);
  transition: opacity 0.2s ease;
  border-radius: 0.25rem;
}

.modal-close-btn:hover {
  background: var(--main-secondary-hover);
  opacity: 1;
}

.item-row {
  display: flex;
  padding: 1.5rem 2rem;
  gap: 1.25rem;
  align-items: flex-start;
}

.item-img :deep(.image__item) {
  width: 7.5rem;
  height: 9rem;
  object-fit: cover;
  border-radius: 0.25rem;
  flex-shrink: 0;
}


.modal-right::-webkit-scrollbar {
  width: 0.5rem;
}

.modal-right::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

.modal-right::-webkit-scrollbar-thumb {
  background: var(--other-default);
  border-radius: 0.25rem;
}

.modal-right::-webkit-scrollbar-thumb:hover {
  background: var(--other-secondary);
}

@media (max-width: 1024px) {
  .modal-content {
    flex-direction: column;
    max-height: 90vh;
    width: 100%;
  }

  .modal-left {
    flex: 0 0 auto;
    min-height: 50vh;
    max-height: 50vh;
  }

  .modal-right {
    flex: 1 1 auto;
    min-width: 0;
    width: 100%;
    max-height: 40vh;
  }
}

@media (max-width: 768px) {
  .modal-content {
    max-height: 95vh;
    border-radius: 0;
  }

  .modal-left {
    min-height: 40vh;
    max-height: 45vh;
  }

  .modal-right {
    max-height: 55vh;
  }

  .item-row {
    padding: 1rem;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .item-img :deep(.image__item) {
    width: 5rem;
    height: 6.25rem;
  }

  .look-counter {
    top: 0.75rem;
    right: 0.75rem;
    padding: 0.25rem 0.625rem;
    font-size: 0.75rem;
  }

  .modal-left .nav {
    width: 2rem;
    height: 2rem;
  }

  .modal-left .nav-left {
    left: 0.75rem;
  }

  .modal-left .nav-right {
    right: 0.75rem;
  }

  .modal-close-btn {
    top: 0.75rem;
    right: 0.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }
}

@media (max-width: 480px) {
  .complete-look {
    padding: 1rem;
  }

  .modal-content {
    max-height: 100vh;
    border-radius: 0;
  }

  .modal-left {
    min-height: 35vh;
    max-height: 40vh;
  }

  .modal-right {
    max-height: 60vh;
  }

  .item-row {
    padding: 0.75rem;
    gap: 0.625rem;
  }

  .item-img :deep(.image__item) {
    width: 4.375rem;
    height: 5.625rem;
  }

  .modal-left .nav {
    width: 1.75rem;
    height: 1.75rem;
  }

  .modal-left .nav-left {
    left: 0.5rem;
  }

  .modal-left .nav-right {
    right: 0.5rem;
  }
}
</style>
