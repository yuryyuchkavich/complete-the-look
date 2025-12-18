<template>
  <div class="image__wrapper" :id="'i' + uid">
    <img
      v-if="!initial && !srcset"
      class="image__item image__lazyload"
      draggable="false"
        :src="processedSrc"
        loading="lazy"
        :alt="alt"
        :width="width"
        :height="height"
        :style="aspectRatioStyle"
        @load="$emit('load', $event)"
        @dragstart="$emit('dragstart', $event)"
    >
    <img
      v-if="initial && !srcset"
      class="image__item"
      draggable="false"
      :src="processedSrc"
      :alt="alt"
      :width="width"
      :height="height"
      :style="aspectRatioStyle"
      @load="$emit('load', $event)"
      @dragstart="$emit('dragstart', $event)"
    >
    <component v-if="srcset" :is="'style'">
      {{styles()}}
    </component>
    <picture v-if="initial && srcset">
      <source 
      media="(min-width: 1280px)" 
      :srcset="processedSrcset.computer"
      :width="dimset.computer.width"
      :height="dimset.computer.height"
      :style="{'aspect-ratio': dimset.computer.width + ' / ' + dimset.computer.height}"
      >
      <source 
      media="(min-width: 768px) and (max-width: 1279px)" 
      :srcset="processedSrcset.tablet"
      :width="dimset.tablet.width"
      :height="dimset.tablet.height"
      :style="{'aspect-ratio': dimset.tablet.width + ' / ' + dimset.tablet.height}"
      >
      <source 
      media="(max-width: 767px)" 
      :srcset="processedSrcset.phone"
      :width="dimset.phone.width"
      :height="dimset.phone.height"
      :style="{'aspect-ratio': dimset.phone.width + ' / ' + dimset.phone.height}"
      >
      <img
      class="image__item"
      draggable="false"
        :src="processedSrc"
        :alt="alt"
        :width="width"
        :height="height"
        :style="aspectRatioStyle"
        @load="$emit('load', $event)"
        @dragstart="$emit('dragstart', $event)"
      >
    </picture>
    <picture v-if="!initial && srcset">
      <source 
      media="(min-width: 1280px)" 
      :srcset="processedSrcset.computer"
      :width="dimset.computer.width"
      :height="dimset.computer.height"
      :style="{'aspect-ratio': dimset.computer.width + ' / ' + dimset.computer.height}"
      >
      <source 
      media="(min-width: 768px) and (max-width: 1279px)" 
      :srcset="processedSrcset.tablet"
      :width="dimset.tablet.width"
      :height="dimset.tablet.height"
      :style="{'aspect-ratio': dimset.tablet.width + ' / ' + dimset.tablet.height}"
      >
      <source 
      media="(max-width: 767px)" 
      :srcset="processedSrcset.phone"
      :width="dimset.phone.width"
      :height="dimset.phone.height"
      :style="{'aspect-ratio': dimset.phone.width + ' / ' + dimset.phone.height}"
      >
      <img
      class="image__item"
      draggable="false"
        :src="processedSrc"
        loading="lazy"
        :alt="alt"
        :width="width"
        :height="height"
        :style="aspectRatioStyle"
        @load="$emit('load', $event)"
        @dragstart="$emit('dragstart', $event)"
      >
    </picture>
  </div>
</template>

<script>
/* eslint-disable */
import { getImageUrl } from '../helper/getImageUrl.js';

export default {
  name: "ImageItem",
  props: {
    initial: {
      type: Boolean,
      default: false
    },
    src: {
      type: String,
      required: false,
    },
    srcset: {
      default: false,
    },
    dimset: {
      default: false,
    },
    alt: {
      type: String,
      default: ''
    },
    width: {
        type: Number,
    },
    height: {
        type: Number,
    },
    uid: {
      type: String,
    }
  },
  methods: {
    styles(){
      const dimset = this.dimset;
      return `
        @media (min-width: 1280px) {
          #i${this.uid} .image__item {
            aspect-ratio: ${dimset.computer.width} / ${dimset.computer.height} !important;
          }
        }

        @media (min-width: 768px) and (max-width: 1279px) {
          #i${this.uid} .image__item {
            aspect-ratio: ${dimset.tablet.width} / ${dimset.tablet.height} !important;
          }
        }

        @media (max-width: 767px) {
          #i${this.uid} .image__item {
            aspect-ratio: ${dimset.phone.width} / ${dimset.phone.height} !important;
          }
        }
      `;
    },
    processImageUrl(url) {
      return getImageUrl(url, this.settings);
    },
    processSrcset(srcset) {
      if (!srcset || typeof srcset !== 'object') {
        return srcset;
      }
      const processed = {};
      if (srcset.computer) {
        processed.computer = this.processImageUrl(srcset.computer);
      }
      if (srcset.tablet) {
        processed.tablet = this.processImageUrl(srcset.tablet);
      }
      if (srcset.phone) {
        processed.phone = this.processImageUrl(srcset.phone);
      }
      return processed;
    }
  },
  computed:{
    processedSrc() {
      return this.processImageUrl(this.src);
    },
    processedSrcset() {
      return this.processSrcset(this.srcset);
    },
    aspectRatioStyle() {
      if (this.width && this.height) {
        return { 'aspect-ratio': `${this.width} / ${this.height}` };
      }
      return {};
    }
  }
};
</script>
<style>
  .image__item{
    width: 100%;
    height: auto;
  }
  
  .image__wrapper{
    font-size: 0;
  }
</style>
