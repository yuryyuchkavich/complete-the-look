<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal-main">

      <!-- LEFT -->
      <div class="modal-left">
        <img :src="look.image" class="look-image" />
        <div class="look-counter">
         {{ currentIndex + 1 }} / {{ totalLooks }}
        </div>

        <button class="nav nav-btn nav-left"
                @click="prev"
                :disabled="currentIndex === 0">
          <SvgIcon name="left" size="24" />
        </button>

        <button class="nav nav-btn nav-right"
                @click="next"
                :disabled="currentIndex === totalLooks - 1">
          <SvgIcon name="right" size="24" />
        </button>
      </div>

      <!-- RIGHT -->
      <div class="modal-right">
        <button class="close-btn" @click="close">
          <SvgIcon name="delete" size="24" />
        </button>

        <div
          v-for="item in look.items"
          :key="item.id"
          class="item-row"
        >
          <img :src="item.image" class="item-img" />

          <ProductInfo :item="item" variant="item" :show-link="true" />
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import SvgIcon from './SvgIcon.vue';
import ProductInfo from './ProductInfo.vue';

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
  width: 47.5rem;
  max-width: 92vw;
  height: 32.5rem;
  background: var(--bg-primary);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 0.75rem 2.25rem rgba(0,0,0,0.2);
  position: relative;
}


/* LEFT SIDE */
.modal-left {
  position: relative;
  flex: 1;
  background: var(--bg-secondary);
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
  top: 1rem;
  right: 1rem;
  background: var(--text-tertiary);
  color: var(--text-secondary);
  padding: 0.375rem 0.75rem;
  border-radius: 62.4375rem;
  font-size: 1rem;
  font-weight: 400;
  letter-spacing: 0.08em;

  pointer-events: none;
}

/* NAV BUTTONS */
.nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  border: none;
  background: var(--bg-primary);
  opacity: 0.9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 0.125rem 0.5rem rgba(0,0,0,0.15);
  transition: transform 0.15s ease, background 0.15s ease;
  z-index: 2;
  padding:0;
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

.nav-left { left: 1rem; }
.nav-right { right: 1rem; }

.nav:hover:not(:disabled) {
  transform: translateY(-50%) scale(1.05);
  background: var(--bg-primary);
}

.nav:disabled {
  opacity: 0.35;
  cursor: default;
}

/* RIGHT SIDE */
.modal-right {
  flex: 1;
  padding: 2rem 0.3125rem 2rem 1.25rem;
  overflow-y: auto;
  background: var(--bg-primary);
  position: relative;
}

/* CLOSE BUTTON */
.close-btn {
  position: absolute;
  top: 0.625rem;
  right: 0.625rem;
  width: 2.25rem;
  height: 2.25rem;
  background: var(--other-tertiary);
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1;
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease, transform 0.15s ease;
}
.close-btn:hover {
  background: var(--main-secondary-hover);
  transform: scale(1.05);
}

/* PRODUCT LIST */
.item-row {
  display: grid;
  grid-template-columns: 10rem 1fr;
  gap: 0.3125rem;
  margin-top: 1.25rem;
}

.item-img {
  width: 10rem;
  height: 12rem;
  object-fit: contain;
}


/* SCROLLBAR */
.modal-right::-webkit-scrollbar {
  width: 0.375rem;
}
.modal-right::-webkit-scrollbar-thumb {
  background: var(--other-default);
  border-radius: 0.1875rem;
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
    height: 18.75rem;
  }

  .modal-right {
    padding: 1rem;
  }

  .item-row {
    grid-template-columns: 5rem 1fr;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .item-img {
    width: 5rem;
    height: 5rem;
  }
}
</style>
