<template>
  <div class="complete-look">
    <div class="nav-header">
      <h2>Complete the Look</h2>
      <div class="nav-top">
        <button class="nav-btn" @click="prevLook" :disabled="currentLook === 0">‹</button>
        <button class="nav-btn" @click="nextLook" :disabled="currentLook + cardsPerPage >= looks.length">›</button>
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
            @mouseenter="hoveredLook = look.id"
            @mouseleave="hoveredLook = null"
          >
            <img :src="look.image" :alt="look.name" />

            <!-- HOTSPOTS -->
            <a
              v-for="item in look.items"
              :key="item.id"
              v-if="hoveredLook === look.id"
              :href="item.url"
              target="_blank"
              class="hotspot"
              :style="getHotspotStyle(item, look)"
              @mouseenter="activeItem = item"
              @mouseleave="activeItem = null"
            >
              <span class="dot"></span>
              <div v-if="activeItem?.id === item.id" class="tooltip">
                <strong>{{ item.name }}</strong><br />
                <span class="description">{{ activeItem.description }}</span><br />
                ${{ activeItem.price }}
              </div>
            </a>

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
    <LookModal
      v-if="showModal"
      :look="props.looks[selectedLook]"
      :currentIndex="selectedLook"
      :totalLooks="props.looks.length"
      @close="closeModal"
      @prev="prevModalLook"
      @next="nextModalLook"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import LookModal from './LookModal.vue';

const props = defineProps({
  looks: Array
});


// Modal
const showModal = ref(false);
const selectedLook = ref(0);

function openModal(index) {
  selectedLook.value = index;
  showModal.value = true;
}
function closeModal() {
  showModal.value = false;
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
const activeItem = ref(null);
const lookRefs = ref({});

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
  padding: 24px;
}

.nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 8px;
}

.nav-header h2 {
  margin: 0;
  font-size: 24px;
  flex: 1;
  text-align: left;
   font-weight: normal;
}

.nav-top {
  display: flex;
  gap: 8px;
}

.nav-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f7f7f7;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  transition: background 0.2s, transform 0.2s;
}

.nav-btn:hover:not(:disabled) {
  background: #eaeaea;
  transform: scale(1.05);
}

.nav-btn:disabled {
  background: #f7f7f7;
  color: #ccc;
  cursor: default;
}

.nav-btn svg {
  width: 28px;
  height: 28px;
  display: block;
}


.looks-wrapper {
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding-bottom: 16px;
}

.looks {
  display: flex;
  gap: 24px;
  flex: 1;
}

.look-card {
  flex: 0 0 calc(100% / 3 - 16px);
  min-width: 200px;
  height: 460px;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
}

.look-image {
  width: 100%;
  height: 100%;
  position: relative;
}

.look-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hotspot {
  position: absolute;
  transform: translate(-50%, -50%) scale(0.5);
  cursor: pointer;
  width: 20px;
  height: 20px;
  display: block;
  opacity: 0;
  transition: opacity 0.3s ease, transform 0.3s ease;
  text-decoration: none;
}

.look-image:hover .hotspot {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

.dot {
  width: 100%;
  height: 100%;
  background: #fff;
  border: 2px solid #888;
  border-radius: 50%;
  box-sizing: border-box;
  display: block;
  transition: transform 0.2s, box-shadow 0.2s;
}

.hotspot:hover .dot {
  transform: scale(1.3);
  box-shadow: 0 0 6px rgba(0,0,0,0.25);
}

.tooltip {
  position: absolute;
  bottom: 100%; 
  left: 50%;
  transform: translateX(-50%) translateY(-8px);
  background: #fff;
  padding: 6px 12px;
  border-radius: 8px;
  white-space: normal;
  width: 150px;
  box-shadow: 0 4px 12px rgba(0,0,0,.15);
  font-size: 10px;
  z-index: 9999;
  color: #000;
  text-align: left;
}

.tooltip .description {
  color: #888;
}

/* View look button */
.view-look-btn.overlay {
  position: absolute;
  bottom: 16px;
  left: 16px;
  background: rgba(255,255,255,0.95);
  border: none;
  border-radius: 24px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,.15);
  display: flex;
  align-items: center;
  overflow: hidden;
  width: 40px;
  padding: 10px 12px;
  transition: width 0.3s ease, padding 0.3s ease;
}

.view-look-btn.overlay.expanded {
  width: 170px;
}

.view-look-btn .icon {
  display: inline-block;
}

.view-look-btn .btn-text {
  margin-left: 8px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s;
}

.view-look-btn.overlay.expanded .btn-text {
  opacity: 1;
}

@media (max-width: 992px) {
  .look-card {
    flex: 0 0 calc(50% - 12px);
  }
}

@media (max-width: 480px) {
  .nav-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .nav-top {
    margin-top: 8px;
  }

  .look-card {
    flex: 0 0 100%;
  }
}
</style>
