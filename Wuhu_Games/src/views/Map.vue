<template>
    <div id="map-container">
        <img src="/Images/Wuhu Map Pinpoints.svg" id="pinpoints" class="map">
        <img src="/Images/Wuhu Map.svg" id="baseMap" class="map">
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
    height: auto;
    transform-origin: top left;
    transition: transform 0.05s ease-out;
    user-select: none;
    pointer-events: none;
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
setTimeout(() => {
    const mapContainer = document.getElementById("map-container");
    var map = document.getElementsByClassName("map");
    map = Array(map[0], map[1])

    let isDragging = false;
    let currentX = 0;
    let currentY = 0;
    let initialX = 0;
    let initialY = 0;
    let xOffset = 0;
    let yOffset = 0;
    let scale = 1;

    // Set initial transform
    setTransform();

    // Mouse wheel zoom handler
    mapContainer.addEventListener("wheel", function (e) {
        e.preventDefault();
        const delta = e.deltaY * -0.01;
        const newScale = Math.min(Math.max(scale + delta, 1), 15);
        const mouseX = e.clientX - mapContainer.offsetLeft;
        const mouseY = e.clientY //- mapContainer.offsetTop;

        if (newScale !== scale) {
            const beforeX = (mouseX - xOffset) / scale;
            const beforeY = (mouseY - yOffset) / scale;

            scale = newScale;

            const bounds = getBounds();
            xOffset = Math.min(Math.max(mouseX - beforeX * scale, bounds.minX), bounds.maxX);
            yOffset = Math.min(Math.max(mouseY - beforeY * scale, bounds.minY), bounds.maxY);

            setTransform();
        }
    });

    mapContainer.addEventListener("mousedown", dragStart);
    mapContainer.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", dragEnd);

    function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target === mapContainer) {
            isDragging = true;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            const bounds = getBounds();
            xOffset = Math.min(Math.max(currentX, bounds.minX), bounds.maxX);
            yOffset = Math.min(Math.max(currentY, bounds.minY), bounds.maxY);

            setTransform();
        }
    }

    function dragEnd() {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }

    function setTransform() {
        map.forEach(element => {
            element.style.transform = `translate(${xOffset}px, ${yOffset}px) scale(${scale})`;
        });
    }

    function getBounds() {
        const scaledMapWidth = map[0].width * scale;
        const scaledMapHeight = map[0].height * scale;

        return {
            minX: parseInt(getComputedStyle(mapContainer).width.slice(0, -2)) - scaledMapWidth,
            maxX: 0,
            minY: parseInt(getComputedStyle(mapContainer).height.slice(0, -2)) - scaledMapHeight,
            maxY: 0
        };
    }
}, 500);
</script>