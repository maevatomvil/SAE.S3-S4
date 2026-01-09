<template>
  <div id="map-container">
    <img src="/Images/Wuhu Map Pinpoints.svg" id="pinpoints" class="map">
    <img src="/Images/Wuhu Map_rognee.png" id="baseMap" class="map">
    <slot></slot>
  </div>
</template>

<style scoped>
#map-container {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: black;
  box-sizing: border-box;
  cursor: grab;
  overflow: hidden;
  user-select: none;
}

#map-container:active {
  cursor: grabbing;
}

#map-container img {
  width: 100%;
  transform-origin: top left;
  transition: transform 0.05s ease-out;
  user-select: none;
  pointer-events: none;
  height: 100%;
  object-fit: cover;
}




#baseMap {
  z-index: 14;
}

#pinpoints {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 17;
}
</style>

<script setup>
import { defineEmits } from 'vue'

const emit = defineEmits(['map-click'])

setTimeout(() => {
  const mapContainer = document.getElementById("map-container")
  var map = Array.from(
    document.querySelectorAll("#map-container > .map, #map-container > .pin")
  )

  let isDragging = false
  let currentX = 0
  let currentY = 0
  let initialX = 0
  let initialY = 0
  let xOffset = 0
  let yOffset = 0
  let scale = 1

  setTransform()

  mapContainer.addEventListener("mousedown", dragStart)
  mapContainer.addEventListener("mousemove", drag)
  document.addEventListener("mouseup", dragEnd)

  mapContainer.addEventListener("click", function (e) {
    if (isDragging) return

    const rect = mapContainer.getBoundingClientRect()
    const clickX = (e.clientX - rect.left - xOffset) / scale
    const clickY = (e.clientY - rect.top - yOffset) / scale

    const displayedWidth = map[0].getBoundingClientRect().width
    const displayedHeight = map[0].getBoundingClientRect().height

    const percentX = (clickX / displayedWidth) * 100
    const percentY = (clickY / displayedHeight) * 100

    emit('map-click', { x: percentX, y: percentY })
  })

  function dragStart(e) {
    initialX = e.clientX - xOffset
    initialY = e.clientY - yOffset

    if (e.target === mapContainer) {
      isDragging = true
    }
  }

  function drag(e) {
    if (isDragging) {
      e.preventDefault()
      currentX = e.clientX - initialX
      currentY = e.clientY - initialY

      const bounds = getBounds()
      xOffset = Math.min(Math.max(currentX, bounds.minX), bounds.maxX)
      yOffset = Math.min(Math.max(currentY, bounds.minY), bounds.maxY)

      setTransform()
    }
  }

  function dragEnd() {
    initialX = currentX
    initialY = currentY
    isDragging = false
  }

  function setTransform() {
    map.forEach(element => {
      element.style.transform = `translate(${xOffset}px, ${yOffset}px) scale(${scale})`
    })
  }

  function getBounds() {
   
    const displayedWidth = map[0].getBoundingClientRect().width
    const displayedHeight = map[0].getBoundingClientRect().height

    const scaledMapWidth = displayedWidth * scale
    const scaledMapHeight = displayedHeight * scale

    return {
      minX: parseInt(getComputedStyle(mapContainer).width.slice(0, -2)) - scaledMapWidth,
      maxX: 0,
      minY: parseInt(getComputedStyle(mapContainer).height.slice(0, -2)) - scaledMapHeight,
      maxY: 0
    }
  }
}, 500)
</script>
