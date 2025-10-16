<template>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Poetsen+One&family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
  <header>
    <div class="navbar">
      <div class="image-div">
        <router-link to="/">
          <img src="/public/Wuhu Games.svg" alt="logo Wuhu Games">
        </router-link>
      </div>
      <div class="sections-div">
        <router-link class="section" to="/">Accueil</router-link>
        <router-link class="section" to="/page-hotel">Hôtellerie</router-link>
      </div>
    </div>
  </header>

  <body>

  </body>
  <router-view></router-view>
  <footer>
    <div class="footer">
      <div class="div-footer-infos">
        <p class="footer-infos">...Situé sur l'île Wuhu...</p>
      </div>
    </div>
  </footer>
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
  height: 104px;
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.1);
}

.sections-div {
  padding: 39px;
  float: right;
}

.section {
  padding: 40px;
  font-size: 20px;
  text-decoration: none;
  color: #2828e2;
  font-weight: bold;
}

.image-div {
  float: left;
  padding: 10px;
}

.image-div img {
  height: 80px;
  width: auto;
}

.footer {
  height: 200px;
  border-top: whitesmoke;
  background-color: #5858d8;
  justify-content: center;
  display: flex;
}

.footer-infos {
  color: white;
}
</style>
