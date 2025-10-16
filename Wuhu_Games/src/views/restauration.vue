<template>
    <div class="titre">
        <h1>Restauration</h1>
    </div>
    <div class="presentation"> 
        <p>Nous proposons une large gamme de repas tels que des Hamburgers, CheeseBurger, pizza, hot-dogs ... <br></br>Vous pouvez dès à présent réserver vos plats, vous recevrez un QR code permettant de recupérer votre repas sur place</p>
        <img src="/public/repas.jpg"
            alt="Image d'un match de basketball"/>
    </div>
    <div class="presentation_services"> 
      <h3>Nos services : </h3>
      <li>
        Menu / noter nos plats
      </li>
      <li>
        Réserver une table
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