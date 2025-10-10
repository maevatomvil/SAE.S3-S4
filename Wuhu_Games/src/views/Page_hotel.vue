<template>
    <div class="titre_hotel">
        <h1>Bienvenue sur la page de présentation de l'hôtel</h1>
    </div>
    <div class="presentation_hotel"> 
        <p>Dans cette page, vous pourrez consulter le planning de 
            disponibilité des chambres et en réserver une.
            Notre hôtel allie confort et nature pour
          accueillir les participants et les spectateurs
           de l’événement sportif. 
        Vous pourrez profiter d’un hébergement moderne, 
        de services adaptés aux athlètes et d’une ambiance
         conviviale pour vivre pleinement cette expérience
          unique.
        </p>
        <img src="/public/image_chambre_hotel.jpg"
            alt="Image d'une chambre d'hôtel"/>
    </div>

</template>

<script setup>

</script>

<style scoped>
.titre_hotel {
  text-align: center;
  padding: 20px;
}

.titre_hotel h1 {
  margin-bottom: 30px;
  font-size: 2em;
  color: #333;
}

.presentation_hotel {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  max-width: 900px;
  margin: 0 auto;
}

.presentation_hotel p {
  flex: 1;
  text-align: left;
  font-size: 1.1em;
  line-height: 1.6;
  color: #444;
}

.presentation_hotel img {
  flex: 1;
  max-width: 40%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}
</style>