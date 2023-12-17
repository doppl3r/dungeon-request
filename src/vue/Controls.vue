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

  function triggerKeyEvent(type, key) {
    window.document.dispatchEvent(new KeyboardEvent(type, { 'code': key }));
    keys.value[key] = (type == 'keydown');
  }
</script>

<template>
  <div class="controls">
    <div class="wasd">
      <div class="row">
        <div class="key w" :class="{ 'active': keys['KeyW'] == true }" @pointerdown="triggerKeyEvent('keydown', 'KeyW')" @pointerup="triggerKeyEvent('keyup', 'KeyW')" @pointerout="triggerKeyEvent('keyup', 'KeyW')">W</div>
      </div>
      <div class="row">
        <div class="key a" :class="{ 'active': keys['KeyA'] == true }" @pointerdown="triggerKeyEvent('keydown', 'KeyA')" @pointerup="triggerKeyEvent('keyup', 'KeyA')" @pointerout="triggerKeyEvent('keyup', 'KeyA')">A</div>
        <div class="key s" :class="{ 'active': keys['KeyS'] == true }" @pointerdown="triggerKeyEvent('keydown', 'KeyS')" @pointerup="triggerKeyEvent('keyup', 'KeyS')" @pointerout="triggerKeyEvent('keyup', 'KeyS')">S</div>
        <div class="key d" :class="{ 'active': keys['KeyD'] == true }" @pointerdown="triggerKeyEvent('keydown', 'KeyD')" @pointerup="triggerKeyEvent('keyup', 'KeyD')" @pointerout="triggerKeyEvent('keyup', 'KeyD')">D</div>
      </div>
    </div>
  </div>
</template>