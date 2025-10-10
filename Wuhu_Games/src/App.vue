<template>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Poetsen+One&family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
  <header>
    <div class="navbar">
      <div class="sections-div">
        <a class="section" href="http://localhost:5173/page-hotel">Hôtellerie</a>
        <a class="section" href="http://localhost:5173/livre-dor">Livre d'or</a>
      </div>
    </div>
  </header>
  <router-view></router-view>
</template>

<script setup>
</script>

<style scoped>
*{
  font-family: 'Montserrat';
}
.navbar {
  background-color: white;
  border-top: whitesmoke solid 2px;
  border-left: whitesmoke solid 2px;
  height: 100px;
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.1);
}

.sections-div {
  padding: 39px;
}

.section {
  padding: 40px;
  font-size: 20px;
  text-decoration: none;
  color: #2828e2;
  font-weight: bold;
}
</style>
