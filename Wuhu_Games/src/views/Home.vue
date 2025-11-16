<template>
  <div class="page-principale">
    <section class="titre1">
      <h1>Wuhu Games</h1>
      <p>
        Les <strong>Wuhu Games</strong> reviennent pour une nouvelle semaine d’<strong>activités en plein air</strong>, de <strong>compétitions</strong> et d’<strong>animations</strong> au cœur de l’île Wuhu.
        Chaque année, l’événement rassemble <strong>sportifs</strong>, <strong>familles</strong>, <strong>spectateurs</strong> et passionnés souhaitant vivre une <strong>expérience sportive unique</strong> dans un cadre naturel privilégié.
      </p>
    </section>

    <section class="titre2">
      <h2>Des activités sportives pour tous</h2>
      <p>Les participants peuvent s’inscrire à un large choix de <strong>disciplines</strong> accessibles à tous les niveaux :</p>
      <div class="liste-activites">
        <div class="carte-activite">Tir à l’arc</div>
        <div class="carte-activite">Canoë-kayak</div>
        <div class="carte-activite">Bowling</div>
        <div class="carte-activite">Golf</div>
        <div class="carte-activite">Tennis de table</div>
        <div class="carte-activite">Tennis</div>
        <div class="carte-activite">Basketball</div>
        <div class="carte-activite">Cyclisme</div>
      </div>
      <p>Chaque activité est encadrée par des équipes spécialisées et du <strong>matériel de qualité</strong>.</p>
    </section>

    <section class="titre2">
      <h2>Un séjour simple et complet</h2>
      <ul>
        <li><strong>Réserver un hébergement</strong> sur l’île</li>
        <li><strong>S’inscrire aux compétitions</strong></li>
        <li><strong>S’inscrire en tant que spectateur</strong></li>
        <li><strong>Louer du matériel sportif</strong> directement sur place</li>
      </ul>
    </section>

    <section class="titre2">
      <h2>Prestataires et exposants : rejoignez le village partenaires</h2>
      <p>
        Le <strong>village partenaires</strong> accueille chaque année un large éventail de stands : <strong>marques sportives</strong>, <strong>artisans locaux</strong>, <strong>restaurateurs</strong>, <strong>loueurs de matériel</strong>, <strong>clubs</strong> et <strong>associations</strong>.
      </p>
      <p>
        L’édition précédente a réuni plus de <strong>40 prestataires</strong>, créant un espace animé, attractif et idéal pour présenter <strong>produits et services</strong> aux visiteurs.
        <strong>82 %</strong> des exposants déclarent avoir amélioré leur <strong>visibilité</strong> grâce à l’événement, et près de <strong>70 %</strong> d’entre eux reviennent l'année suivante.
      </p>
      <p>
        Les exposants disposent d’un <strong>emplacement dédié</strong>, d’une <strong>visibilité forte</strong> et de nombreuses possibilités d’<strong>animations</strong> ou de <strong>démonstrations</strong>.
      </p>
    </section>
  </div>
</template>

<script setup>
</script>

<style scoped>
.page-principale {
  padding: 50px 20px;
  font-family: 'Montserrat', sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  line-height: 1.8;
}

.titre1 h1 {
  font-size: 3rem;
  margin-bottom: 30px;
  color: #333;
  text-align: center;
}

.titre1 p {
  font-size: 1.2rem;
  margin-bottom: 40px;
  color: #444;
  text-align: center;
}

.titre2 {
  margin-top: 50px;
}

.titre2 h2 {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #6aa0e6; 
}

.titre2 p,
.titre2 ul {
  font-size: 1.1rem;
  margin-bottom: 25px;
  color: #444;
}

.liste-activites {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
  justify-content: center;
}

.carte-activite {
  flex: 1 1 200px;
  background-color: #f8f9fa;
  padding: 20px;
  text-align: center;
  border-radius: 12px;
  font-weight: bold;
  box-shadow: 0 6px 12px rgba(0,0,0,0.08);
  transition: transform 0.2s;
}

.carte-activite:hover {
  transform: translateY(-5px);
}
</style>
