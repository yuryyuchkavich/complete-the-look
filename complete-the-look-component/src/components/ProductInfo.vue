<template>
  <div :class="['product-info', `product-info--${variant}`]">
    <div class="product-name">{{ item.name }}</div>
    <div class="product-description">{{ item.description }}</div>
    <div class="product-price">${{ item.price }}</div>
    <a v-if="showLink" :href="item.url" target="_blank" class="product-link">SHOP</a>
  </div>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  variant: {
    type: String,
    default: 'tooltip',
    validator: (value) => ['tooltip', 'item'].includes(value)
  },
  showLink: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.product-info {
  text-align: left;
}

.product-name {
  font-weight: 600;
  color: var(--text-primary);
}

.product-description {
  color: var(--text-tertiary);
  font-weight: 400;
}

.product-price {
  font-weight: 600;
  color: var(--text-primary);
}

.product-link {
  text-decoration: underline;
  color: var(--text-primary);
}

/* Tooltip variant */
.product-info--tooltip .product-name {
  font-size: 0.9375rem;
  line-height: 1.4;
  margin-bottom: 0.375rem;
  letter-spacing: -0.01em;
  color: var(--text-primary);
}

.product-info--tooltip .product-description {
  font-size: 0.8125rem;
  line-height: 1.5;
  margin-bottom: 0.625rem;
  letter-spacing: 0;
  color: var(--text-tertiary);
}

.product-info--tooltip .product-price {
  font-size: 1rem;
  line-height: 1.3;
  letter-spacing: -0.01em;
  color: var(--text-primary);
}

/* Item variant (modal) */
.product-info--item {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
}

.product-info--item .product-name {
  font-size: 1rem;
  line-height: 1.4;
  color: var(--text-primary);
  font-weight: 400;
  margin-bottom: 0.25rem;
}

.product-info--item .product-description {
  font-size: 0.875rem;
  color: var(--text-tertiary);
  margin: 0.25rem 0 0.75rem 0;
  line-height: 1.5;
  font-weight: 400;
}

.product-info--item .product-price {
  font-size: 1rem;
  margin: 0 0 1rem 0;
  font-weight: 400;
}

.product-info--item .product-link {
  font-size: 1rem;
  font-weight: 400;
  margin-top: auto;
}

@media (max-width: 768px) {
  .product-info--item .product-name {
    font-size: 0.875rem;
  }

  .product-info--item .product-description {
    font-size: 0.75rem;
  }

  .product-info--item .product-price {
    font-size: 0.875rem;
  }

  .product-info--item .product-link {
    font-size: 0.75rem;
  }
}
</style>

