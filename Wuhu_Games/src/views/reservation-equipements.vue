<template>
  <div class="titre">
    <h1>Bienvenue sur la page de Réservation des équipements et des infrastructures</h1>
  </div>
  <div class="presentation">
    <p>Pour participer à une activité il vous faudra une infrastructure (gymnase, terrain, ...) et des équipements (raquettes, ballons).<br></br>
      Sur cette page vous pouvez accéder au planning des disponibilitées des infrastructures et les réserver ainsi que les équipements.
    </p>
    <img src="/public/equipements.jpg"
         alt="Image d'un match de basketball"/>
  </div>
  <div class="presentation_services">
    <h3>Nos services :</h3>

    <div class="services_cards">
      <div class="service_card service_link">
        <p>Réservation d'infrastructure</p>
      </div>

      <div class="service_card service_link">
        <p>Réservation d'équipements</p>
      </div>
    </div>
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
  max-width: 60%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}

.presentation_services {
  background-color: rgb(88, 88, 216);
  padding: 20px;
  max-width: 900px;
  margin: 30px auto;
  border-radius: 8px;
  text-align: center;
}

.presentation_services h3 {
  margin-bottom: 20px;
  color: white;
}

.services_cards {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.service_card {
  background: #fff;
  padding: 20px 25px;
  border-radius: 10px;
  box-shadow: 0 3px 8px rgba(0,0,0,0.15);
  width: 250px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  text-align: center;
}

.service_card p {
  margin: 0;
  font-size: 1.05em;
  font-weight: 600;
  color: #333;
}

.service_card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0,0,0,0.25);
}

.service_link {
  text-decoration: none;
  color: inherit;
}

</style>