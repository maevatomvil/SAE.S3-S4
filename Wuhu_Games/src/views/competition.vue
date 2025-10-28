<template>
    <div class="titre">
        <h1>Réservations et inscriptions aux compétitions</h1>
    </div>
    <div class="presentation"> 
        <p>Sur cette page vous pourrez voir les planning des compétions,vous inscrire dans une équipe pour une compétition ou réserver une place en tant que spectateur.
        </p>
        <img src="/public/image_basket.jpg"
            alt="Image d'un match de basketball"/>
    </div>
    <div class="presentation_services"> 
      <h3>Nos services : </h3>
      <li>
        <router-link  to="/planning-competitions"> Planning des compétitions</router-link>
      </li>
      <li>
        S'incrire dans une équipe
      </li>
      <li>
        Réserver une place en tant que spéctateur
      </li>
    </div>

    


</template>

<script setup>

</script>

<style >
  

*{
  font-family: 'Montserrat';
  text-decoration:none;
}

.titre  {
  text-align: center;
  padding: 20px;
}

.titre h1 {
  margin-bottom: 30px;
  font-size: 2em;
  color: #333;
}

.presentation {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  max-width: 900px;
  margin: 0 auto;
}

.presentation  p {
  flex: 1;
  text-align: left;
  font-size: 1.1em;
  line-height: 1.6;
  color: #444;
  text-align: justify;
}

.presentation  img {
  flex: 1;
  max-width: 40%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}

.presentation_services{
  background-color: rgb(230, 230, 230);
  justify-content: center;
  align-items: center;
  max-width: 900px;
  margin: 0 auto;
  border-radius: 5px;
}




</style>