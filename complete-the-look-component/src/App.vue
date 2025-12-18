<template>
  <CompleteLook :looks="looksData" />
</template>

<script setup>
import CompleteLook from './components/CompleteLook.vue';
import lookImg from './assets/images/CompleteLook/image1.png';
import lookImg2 from './assets/images/CompleteLook/image2.png';
import lookImg3 from './assets/images/CompleteLook/image3.png';
import lookImg4 from './assets/images/CompleteLook/image4.png';
const looksData = [
  {
    id: 1,
    name: "Look 1",
    image: lookImg,
    items: [
      { id: 'hoodie', name: 'Hoodie', description: "Comfortable cotton hoodie with front pocket", price: 99, x: 45, y: 20, url: "https://example.com/hoodie",image: lookImg },
      { id: 'pants', name: 'Pants', description: "Slim-fit cotton pants for everyday wear", price: 55, x: 55, y: 60, url: "https://example.com/hoodie", image: lookImg2},
      { id: 'bag', name: 'Bag', description: "Leather crossbody bag with adjustable strap", price: 88, x: 40, y: 35, url: "https://example.com/hoodie", image: lookImg3},
      { id: 'sneakers', name: 'Sneakers', description: "Sporty sneakers with cushioned sole", price: 111, x: 55, y: 83, url: "https://example.com/hoodie", image: lookImg4},
    ],
  },
  {
    id: 2,
    name: "Look 2",
    image: lookImg2,
    items: [
      { id: 'hoodie', name: 'Hoodie', description: "Comfortable cotton hoodie with front pocket", price: 89, x: 45, y: 20, url: "https://example.com/hoodie", image: lookImg },
      { id: 'pants', name: 'Pants', description: "Slim-fit cotton pants for everyday wear", price: 99, x: 55, y: 60, url: "https://example.com/hoodie", image: lookImg2},
      { id: 'bag', name: 'Bag', description: "Leather crossbody bag with adjustable strap", price: 79, x: 40, y: 35, url: "https://example.com/hoodie", image: lookImg3},
      { id: 'sneakers', name: 'Sneakers', description: "Sporty sneakers with cushioned sole", price: 149, x: 55, y: 83, url: "https://example.com/hoodie", image: lookImg4},
    ],
  },
  {
    id: 3,
    name: "Look 3",
    image: lookImg3,
    items: [
      { id: 'hoodie', name: 'Hoodie', description: "Comfortable cotton hoodie with front pocket", price: 89, x: 45, y: 20, url: "https://example.com/hoodie", image: lookImg},
      { id: 'pants', name: 'Pants', description: "Slim-fit cotton pants for everyday wear", price: 99, x: 55, y: 60, url: "https://example.com/hoodie", image: lookImg2},
      { id: 'bag', name: 'Bag', description: "Leather crossbody bag with adjustable strap", price: 79, x: 40, y: 35, url: "https://example.com/hoodie", image: lookImg3},
      { id: 'sneakers', name: 'Sneakers', description: "Sporty sneakers with cushioned sole", price: 149, x: 55, y: 83, url: "https://example.com/hoodie", image: lookImg4},
    ],
  },
  {
    id: 4,
    name: "Look 4",
    image: lookImg4,
    items: [
      { id: 'hoodie', name: 'Hoodie', description: "Comfortable cotton hoodie with front pocket", price: 89, x: 45, y: 20, url: "https://example.com/hoodie", image: lookImg},
      { id: 'pants', name: 'Pants', description: "Slim-fit cotton pants for everyday wear", price: 99, x: 55, y: 60, url: "https://example.com/hoodie", image: lookImg2},
      { id: 'bag', name: 'Bag', description: "Leather crossbody bag with adjustable strap", price: 79, x: 40, y: 35, url: "https://example.com/hoodie", image: lookImg3},
      { id: 'sneakers', name: 'Sneakers', description: "Sporty sneakers with cushioned sole", price: 149, x: 55, y: 83, url: "https://example.com/hoodie", image: lookImg4},
    ],
  },
];
</script>