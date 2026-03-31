<template>
  <div id="map-container">
    <img src="/Images/Wuhu Map Pinpoints.svg" id="pinpoints" class="map">
    <img src="/Images/Wuhu Map_rognee.png" id="baseMap" class="map">

    <div id="zones-layer">
      <div
        v-for="zone in selectableZones"
        :key="zone.id"
        :class="['zone', { disabled: zone.disabled }]"
        :style="zoneStyle(zone)"
        @click.stop="handleZoneClick(zone.id)"
        @mouseenter="emit('zone-hover', zone.id)"
        @mouseleave="emit('zone-leave', zone.id)"
      ></div>
    </div>

    <slot></slot>
  </div>
</template>

<style scoped>
#map-container {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: black;
  overflow: hidden;
}

#map-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

#pinpoints {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 17;
}

#baseMap {
  z-index: 14;
}

#zones-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 30;
  pointer-events: none;
}

.zone {
  position: absolute;
  background-color: rgba(21, 189, 255, 0.171);
  border: 3px solid rgb(0, 89, 255);
  border-radius: 6px;
  pointer-events: auto;
  cursor: pointer;
  transition: 0.15s;
}

.zone:hover {
  background-color: rgba(15, 109, 233, 0.712);
}



.zone.disabled {
  background-color: rgba(255, 0, 0, 0.6) !important;
  border-color: rgb(255, 0, 0) !important;
  cursor: not-allowed !important;
  pointer-events: none !important;
}




</style>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  selectableZones: { type: Array, default: () => [] }
})

const emit = defineEmits(['zone-click', 'zone-hover', 'zone-leave'])

function handleZoneClick(id) {
  emit("zone-click", id)
}

function zoneStyle(z) {
  return {
    left: z.x + "%",
    top: z.y + "%",
    width: z.width + "%",
    height: z.height + "%",
    backgroundColor: z.color || "rgba(21, 189, 255, 0.771)",
    borderColor: z.borderColor || "rgb(0, 89, 255)"
  }
}
</script>
