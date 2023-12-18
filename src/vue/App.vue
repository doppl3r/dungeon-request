<script setup>
  import '../scss/style.scss';
  import { Game } from '../js/Game.js';
  import { ref, onMounted } from 'vue';
  import Controls from './Controls.vue';

  // Initialize app and expose to window scope
  var canvas = ref();
  var game = window.game = new Game();

  onMounted(function() {
    game.init(canvas.value);
  });
</script>

<template>
  <canvas ref="canvas"></canvas>
  <div class="ui">
    <!-- <Controls /> -->
  </div>
</template>