<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal-main">

      <!-- LEFT -->
      <div class="modal-left">
        <img :src="look.image" class="look-image" />
        <div class="look-counter">
         {{ currentIndex + 1 }} / {{ totalLooks }}
        </div>

        <button class="nav nav-left"
                @click="prev"
                :disabled="currentIndex === 0">‹</button>

        <button class="nav nav-right"
                @click="next"
                :disabled="currentIndex === totalLooks - 1">›</button>
      </div>

      <!-- RIGHT -->
      <div class="modal-right">
        <button class="close-btn" @click="close">×</button>

        <div
          v-for="item in look.items"
          :key="item.id"
          class="item-row"
        >
          <img :src="item.image" class="item-img" />

          <div class="item-info">
            <div class="item-name">{{ item.name }}</div>
            <div class="item-desc">{{ item.description }}</div>
            <div class="item-price">${{ item.price }}</div>
            <a :href="item.url" target="_blank" class="item-link">SHOP</a>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  look: Object,
  currentIndex: Number,
  totalLooks: Number,
});
const emit = defineEmits(['close', 'prev', 'next']);

function close() { emit('close'); }
function prev() { emit('prev'); }
function next() { emit('next'); }
</script>

<style scoped>
/* BACKDROP */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  font-family: Helvetica Neue, -apple-system, BlinkMacSystemFont, sans-serif;
}

/* MAIN MODAL */
.modal-main {
  display: flex;
  width: 760px;
  max-width: 92vw;
  height: 520px;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 12px 36px rgba(0,0,0,0.2);
  position: relative;
}


/* LEFT SIDE */
.modal-left {
  position: relative;
  flex: 1;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.look-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.look-counter {
  position: absolute;
  top: 16px;
  right: 16px;
  background: #767676;
  color: #fff;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 0.08em;

  pointer-events: none;
}

/* NAV BUTTONS */
.nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  transition: transform 0.15s ease, background 0.15s ease;
  z-index: 2;
}

.nav-left { left: 16px; }
.nav-right { right: 16px; }

.nav:hover:not(:disabled) {
  transform: translateY(-50%) scale(1.05);
  background: #fff;
}

.nav:disabled {
  opacity: 0.35;
  cursor: default;
}

/* RIGHT SIDE */
.modal-right {
  flex: 1;
  padding: 32px 5px 32px 20px;
  overflow-y: auto;
  background: #fff;
  position: relative;
}

/* CLOSE BUTTON */
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 36px;
  height: 36px;
  background: #e6e6e6;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1;
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease, transform 0.15s ease;
}
.close-btn:hover {
  background: #dcdcdc;
  transform: scale(1.05);
}

/* PRODUCT LIST */
.item-row {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 5px;
  margin-top: 20px;
}

.item-img {
  width: 160px;
  height: 192px;
  object-fit: contain;
}

.item-info {
  text-align: left;
}

.item-name {
  color: #000;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.2;
}

.item-desc {
  font-weight: 400;
  font-size: 16px;
  color: #757575;
  margin: 4px 0;
  line-height: 1.3;
}

.item-price {
  font-weight: 400;
  font-size: 16px;
  margin: 25px 0;
}

.item-link {
  font-weight: 400;
  font-size: 16px;
  text-decoration: underline;
  color: #000;
}

/* SCROLLBAR */
.modal-right::-webkit-scrollbar {
  width: 6px;
}
.modal-right::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 3px;
}

/* MOBILE */
@media (max-width: 768px) {
  .modal-main {
    flex-direction: column;
    width: 94vw;
    height: auto;
    max-height: 90vh;
  }

  .modal-left {
    height: 300px;
  }

  .modal-right {
    padding: 16px;
  }

  .item-info {
    text-align: left;
  }

  .item-row {
    grid-template-columns: 80px 1fr;
    gap: 12px;
    margin-bottom: 24px;
  }

  .item-img {
    width: 80px;
    height: 80px;
  }

  .item-name { font-size: 14px; }
  .item-desc { font-size: 12px; }
  .item-price { font-size: 14px; }
  .item-link { font-size: 12px; }
}
</style>
