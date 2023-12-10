<script setup>
  import '../scss/controls.scss';
  import { ref } from 'vue';

  var keys = ref({});

  // Add key-down listener
  window.addEventListener('keydown', function(e) {
    keys.value[e.code] = true;
  });

  // Add key-up listener
  window.addEventListener('keyup', function(e) {
    keys.value[e.code] = false
  });
</script>

<template>
  <div class="controls">
    <div class="wasd">
      <div class="row">
        <div class="key w" :class="{ 'active': keys['KeyW'] == true }">W</div>
      </div>
      <div class="row">
        <div class="key a" :class="{ 'active': keys['KeyA'] == true }">A</div>
        <div class="key s" :class="{ 'active': keys['KeyS'] == true }">S</div>
        <div class="key d" :class="{ 'active': keys['KeyD'] == true }">D</div>
      </div>
    </div>
  </div>
</template>