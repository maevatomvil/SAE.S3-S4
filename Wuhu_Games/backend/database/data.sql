DROP TABLE IF EXISTS hotelReservations;
DROP TABLE IF EXISTS hotelAvailability;
DROP TABLE IF EXISTS prestataireDemandesHotelAvailability;
DROP TABLE IF EXISTS prestataireDemandesServices;
DROP TABLE IF EXISTS prestataireDemandes;
DROP TABLE IF EXISTS planningPrestataire;
DROP TABLE IF EXISTS availability;
DROP TABLE IF EXISTS spectateurs;
DROP TABLE IF EXISTS views;
DROP TABLE IF EXISTS livreDor;
DROP TABLE IF EXISTS historique;
DROP TABLE IF EXISTS panier;
DROP TABLE IF EXISTS templates;
DROP TABLE IF EXISTS homepage;
DROP TABLE IF EXISTS inscriptions;
DROP TABLE IF EXISTS competitions;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstname VARCHAR(255),
  surname VARCHAR(255),
  username VARCHAR(255) UNIQUE,
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  role VARCHAR(255),
  session VARCHAR(255)
);

CREATE TABLE competitions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  jour VARCHAR(255),
  heure VARCHAR(255),
  titre VARCHAR(255),
  lieu VARCHAR(255)
);

CREATE TABLE inscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titre VARCHAR(255),
  jour VARCHAR(255),
  heure VARCHAR(255),
  username VARCHAR(255),
  numero VARCHAR(255)
);

CREATE TABLE homepage (
  id INT PRIMARY KEY,
  subtitleFr TEXT,
  subtitleEn TEXT,
  contentFr TEXT,
  contentEn TEXT
);

INSERT INTO homepage (id, subtitleFr, subtitleEn, contentFr, contentEn)
VALUES (1, '', '', '', '');

CREATE TABLE templates (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255),
  providerType VARCHAR(50) DEFAULT 'standard',
  type VARCHAR(255),
  name VARCHAR(255),
  name_en VARCHAR(255),
  shortDescription TEXT,
  shortDescription_en TEXT,
  image MEDIUMTEXT,
  pageTitle TEXT,
  templateContent MEDIUMTEXT,
  planning MEDIUMTEXT,
  pageTitleAchat TEXT,
  pageDescriptionAchat TEXT,
  articles MEDIUMTEXT,
  services MEDIUMTEXT,
  email VARCHAR(255),
  locationNeeds TEXT,
  x FLOAT,
  y FLOAT,
  zoneId VARCHAR(255)
);






CREATE TABLE panier (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255),
  prestataireUsername VARCHAR(255),
  article TEXT
);

CREATE TABLE historique (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255),
  prestataireUsername VARCHAR(255),
  commande TEXT
);




CREATE TABLE livreDor (
  id INT AUTO_INCREMENT PRIMARY KEY,
  prestataireUsername VARCHAR(255),
  message TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE views (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255),
  date VARCHAR(255),
  count INT DEFAULT 0
);

INSERT INTO competitions (jour, heure, titre, lieu) VALUES
('Lundi','09:00','Tir à l''arc','Terrain de tir à l''arc'),
('Lundi','14:30','Canoë-Kayak','Rivière Wuhu'),
('Mardi','10:00','Bowling','Stadium Wuhu'),
('Mardi','15:00','Golf Demi-Finale','Golf Wuhu'),
('Mardi','20:00','Golf Finale','Golf Wuhu'),
('Mercredi','11:00','Tennis de table','Stadium Wuhu'),
('Jeudi','14:00','Tennis','Stadium Wuhu'),
('Vendredi','09:30','Basketball','Stadium Wuhu'),
('Samedi','16:00','Cyclisme','Piste de cyclisme ');

INSERT INTO inscriptions (titre, jour, heure, username, numero) VALUES
('Tir à l''arc','Lundi','09:00','jdupont','CMD-250101-0900-A1B2'),
('Canoë-Kayak','Lundi','14:30','jdupont','CMD-250101-1430-C3D4'),
('Bowling','Mardi','10:00','jdupont','CMD-250102-1000-E5F6'),
('Golf Demi-Finale','Mardi','15:00','jdupont','CMD-250102-1500-G7H8'),
('Golf Finale','Mardi','20:00','jdupont','CMD-250102-2000-I9J0'),
('Tennis de table','Mercredi','11:00','jdupont','CMD-250103-1100-K1L2'),
('Tennis','Jeudi','14:00','jdupont','CMD-250104-1400-M3N4'),
('Basketball','Vendredi','09:30','jdupont','CMD-250105-0930-O5P6'),
('Cyclisme','Samedi','16:00','jdupont','CMD-250106-1600-Q7R8'),
('Tennis','Jeudi','14:00','vis01','CMD-250512-1400-E5F6');

CREATE TABLE spectateurs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titre VARCHAR(255),
  jour VARCHAR(255),
  heure VARCHAR(255),
  username VARCHAR(255),
  numero VARCHAR(255)
);


CREATE TABLE availability (
  date DATE PRIMARY KEY,
  simple INT,
  doubleRoom INT,
  priceSimple INT,
  priceDouble INT
);


CREATE TABLE planningPrestataire (
  id INT AUTO_INCREMENT PRIMARY KEY,
  prestataireUsername VARCHAR(255),
  eventId VARCHAR(255),
  username VARCHAR(255),
  numero VARCHAR(255)
);






CREATE TABLE prestataireDemandes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255),
  providerType VARCHAR(50) DEFAULT 'standard',
  serviceName VARCHAR(255),
  serviceName_en VARCHAR(255),
  email VARCHAR(255),
  image MEDIUMTEXT,
  descriptionFr TEXT,
  descriptionEn TEXT,
  pageAchat TEXT,
  planning TEXT,
  hotelAvailability MEDIUMTEXT,
  pageInfo TEXT,
  locationNeeds TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  zoneId VARCHAR(255)
);

CREATE TABLE hotelAvailability (
  id INT AUTO_INCREMENT PRIMARY KEY,
  prestataireUsername VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  simpleAvailable INT NOT NULL DEFAULT 0,
  doubleAvailable INT NOT NULL DEFAULT 0,
  priceSimple INT NOT NULL DEFAULT 0,
  priceDouble INT NOT NULL DEFAULT 0,
  UNIQUE KEY uniq_hotel_availability (prestataireUsername, date)
);

CREATE TABLE hotelReservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  prestataireUsername VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  reservationCode VARCHAR(255) NOT NULL UNIQUE,
  roomType VARCHAR(50) NOT NULL,
  startDate DATE NOT NULL,
  endDate DATE NOT NULL,
  nights INT NOT NULL,
  pricePerNight INT NOT NULL,
  totalPrice INT NOT NULL,
  status VARCHAR(50) DEFAULT 'confirmed',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CHECK (roomType IN ('simple', 'double')),
  CHECK (endDate >= startDate),
  UNIQUE KEY uniq_hotel_reservation (
    prestataireUsername,
    username,
    roomType,
    startDate,
    endDate
  )
);

CREATE TABLE prestataireDemandesServices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  demandeId INT,
  serviceType VARCHAR(255),
  FOREIGN KEY (demandeId) REFERENCES prestataireDemandes(id) ON DELETE CASCADE
);

INSERT INTO availability (date, simple, doubleRoom, priceSimple, priceDouble) VALUES
('2025-05-12',4,2,50,80),
('2025-05-13',6,4,50,80),
('2025-05-14',3,2,55,85),
('2025-05-15',5,3,55,85),
('2025-05-16',2,1,60,90),
('2025-05-17',4,2,60,90),
('2025-05-18',3,3,60,90);

INSERT INTO users (firstname, surname, username, email, password, role) VALUES
('Bernadette','Buche','vis01','vis01@example.com','$2a$12$8gcqO6U3WisgQpqxKndOvuypO.X0RBK8sxxnKkzGm2BQHwn.gudbC','visiteur'), /*mdp = ouioui */
('Camille','Martin','vis02','vis02@example.com','$2a$12$8gcqO6U3WisgQpqxKndOvuypO.X0RBK8sxxnKkzGm2BQHwn.gudbC','visiteur'), /*mdp = ouioui */
('Chloé','Buche','org01','org02@example.com','$2a$12$8gcqO6U3WisgQpqxKndOvuypO.X0RBK8sxxnKkzGm2BQHwn.gudbC','organisateur'), /*mdp = ouioui */
('Arthur','Buche','preshotel1','preshotel1@example.com','$2a$12$8gcqO6U3WisgQpqxKndOvuypO.X0RBK8sxxnKkzGm2BQHwn.gudbC','prestataire'), /*mdp = ouioui */
('Benoît','Buche','prestand1','prestand1@example.com','$2a$12$8gcqO6U3WisgQpqxKndOvuypO.X0RBK8sxxnKkzGm2BQHwn.gudbC','prestataire'); /*mdp = ouioui */

INSERT INTO templates (
  username, providerType, type, name, name_en, shortDescription, shortDescription_en,
  image, pageTitle, templateContent, planning, pageTitleAchat, pageDescriptionAchat,
  articles, services, email, locationNeeds, x, y, zoneId
) VALUES
(
  'preshotel1',
  'hotel',
  'prestataireValide',
  'Hôtel des Wuhu Games',
  'Wuhu Games Hotel',
  'Hôtel partenaire à deux pas du village des athlètes, avec chambres simples et doubles disponibles pendant toute la compétition.',
  'Partner hotel a short walk from the athletes village, with single and double rooms available during the whole event.',
  '/image_chambre_hotel.jpg',
  'Bienvenue à l Hôtel des Wuhu Games',
  '<p>Notre hôtel accueille visiteurs, équipes et accompagnants dans une ambiance simple et chaleureuse. Réception ouverte toute la journée, petit-déjeuner maison et accès rapide aux sites de compétition.</p><p>Vous pouvez consulter les disponibilités puis réserver directement votre chambre.</p>',
  '[]',
  '',
  '',
  '[]',
  '["reservation","info","livre-dor"]',
  'reservation@hotel-wuhu.test',
  'Hôtel déjà installé à l entrée du site, aucun besoin technique supplémentaire.',
  42,
  18,
  'Hotel1'
),
(
  'prestand1',
  'standard',
  'prestataireValide',
  'Saveurs du Stade',
  'Stadium Bites',
  'Stand de restauration complet : plats chauds, bowls, desserts, boissons et menus rapides pour le public comme pour les sportifs.',
  'Full catering stand: hot meals, bowls, desserts, drinks and quick menus for spectators and athletes.',
  '/resto1.avif',
  'Saveurs du Stade',
  '<p>Retrouvez une carte complète tout au long des Wuhu Games : restauration rapide, options végétales, boissons fraîches et formule du jour.</p><p>Nous servons sur place et préparons les commandes à retirer directement au stand.</p>',
  '[{"id":"food-planning-1","jour":"Lundi","titre":"Menu midi spécial ouverture","heure":"12:00","lieu":"Esplanade centrale"},{"id":"food-planning-2","jour":"Mardi","titre":"Atelier dégustation locale","heure":"17:30","lieu":"Stand Saveurs du Stade"},{"id":"food-planning-3","jour":"Jeudi","titre":"After game burger & fries","heure":"19:00","lieu":"Zone restauration"},{"id":"food-planning-4","jour":"Samedi","titre":"Brunch des finales","heure":"10:30","lieu":"Terrasse visiteurs"}]',
  'Commander chez Saveurs du Stade',
  '<p>Composez votre panier parmi nos plats, desserts et boissons. Les commandes sont préparées rapidement et à retirer sur place avec votre username.</p>',
  '[{"id":"food-1","titre":"Burger Wuhu","description":"Steak grillé, cheddar affiné, oignons confits et sauce maison.","prix":14,"stock":30,"image":null},{"id":"food-2","titre":"Bowl veggie croquant","description":"Riz, falafels, légumes rôtis, pickles et sauce yaourt citronné.","prix":12,"stock":24,"image":null},{"id":"food-3","titre":"Wrap poulet croustillant","description":"Poulet pané, salade, tomates, sauce poivrée et frites maison.","prix":11,"stock":28,"image":null},{"id":"food-4","titre":"Cookie géant chocolat-noisette","description":"Cookie moelleux cuit sur place, idéal pour la pause de l après-midi.","prix":4,"stock":40,"image":null},{"id":"food-5","titre":"Citronnade maison","description":"Boisson fraîche au citron, menthe et eau pétillante.","prix":3,"stock":50,"image":null}]',
  '["achat","planning","info","livre-dor"]',
  'contact@saveurs-stade.test',
  'Stand mobile avec besoin d un branchement électrique standard et d un point d eau à proximité.',
  63,
  57,
  'Gymnase_wuhu'
);

INSERT INTO hotelAvailability (prestataireUsername, date, simpleAvailable, doubleAvailable, priceSimple, priceDouble) VALUES
('preshotel1','2025-05-12',6,4,79,109),
('preshotel1','2025-05-13',5,4,79,109),
('preshotel1','2025-05-14',5,3,82,112),
('preshotel1','2025-05-15',5,3,82,112),
('preshotel1','2025-05-16',4,3,85,115),
('preshotel1','2025-05-17',4,3,85,115),
('preshotel1','2025-05-18',4,2,85,115);

INSERT INTO livreDor (prestataireUsername, message) VALUES
('preshotel1','Chambre très propre et calme, parfait après une grosse journée sur le site.'),
('preshotel1','Le personnel a été adorable quand on est arrivés tard après les compétitions.'),
('preshotel1','Petit-déjeuner simple mais très bon, et surtout service rapide le matin.'),
('preshotel1','On a réservé pour deux nuits, rien à redire sur la literie et l accueil.'),
('preshotel1','Super pratique pour venir à pied depuis le village, je recommande vraiment.'),
('prestand1','Le burger était excellent, et la file a avancé très vite entre deux épreuves.'),
('prestand1','Bonne surprise sur les options végétales, le bowl était copieux et frais.');

INSERT INTO views (username, date, count) VALUES
('preshotel1','2025-05-12',26),
('preshotel1','2025-05-13',22),
('prestand1','2025-05-12',29);

INSERT INTO spectateurs (titre, jour, heure, username, numero) VALUES
('Basketball','Vendredi','09:30','vis01','CMD-250516-0930-A7B8');

INSERT INTO planningPrestataire (prestataireUsername, eventId, username, numero) VALUES
('prestand1','food-planning-1','vis01','CMD-250511-1200-C9D0'),
('prestand1','food-planning-2','org01','CMD-250513-1730-E1F2');

INSERT INTO hotelReservations (
  prestataireUsername, username, reservationCode, roomType, startDate, endDate,
  nights, pricePerNight, totalPrice, status
) VALUES
('preshotel1','vis01','CMD-250512-1820-A1B2','simple','2025-05-12','2025-05-13',2,79,158,'confirmed');

INSERT INTO historique (username, prestataireUsername, commande) VALUES
(
  'vis01',
  'prestand1',
  '{"id":"CMD-250512-1835-C3D4","date":"12/05/2025 18:20:00","username":"vis01","prestataireUsername":"prestand1","articles":[{"id":"food-1","titre":"Burger Wuhu","description":"Steak grillé, cheddar affiné, oignons confits et sauce maison.","prix":14,"quantite":1},{"id":"food-5","titre":"Citronnade maison","description":"Boisson fraîche au citron, menthe et eau pétillante.","prix":3,"quantite":2}]}'
);
