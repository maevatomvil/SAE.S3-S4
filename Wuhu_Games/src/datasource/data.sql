CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  firstname TEXT,
  surname TEXT,
  username TEXT UNIQUE,
  email TEXT UNIQUE,
  password TEXT,
  role TEXT,
  session TEXT
);

CREATE TABLE competitions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  jour TEXT,
  heure TEXT,
  titre TEXT,
  lieu TEXT
);

CREATE TABLE inscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titre TEXT,
  username TEXT,
  numero INTEGER
);

CREATE TABLE homepage (
  id INTEGER PRIMARY KEY,
  subtitleFr TEXT,
  subtitleEn TEXT,
  contentFr TEXT,
  contentEn TEXT
);

INSERT INTO homepage (id, subtitleFr, subtitleEn, contentFr, contentEn)
VALUES (1, '', '', '', '');

CREATE TABLE templates (
  id TEXT PRIMARY KEY,
  username TEXT,
  type TEXT,
  name TEXT,
  name_en TEXT,
  shortDescription TEXT,
  shortDescription_en TEXT,
  image TEXT,
  pageTitle TEXT,
  templateContent TEXT,
  planning TEXT,
  pageTitleAchat TEXT,
  pageDescriptionAchat TEXT,
  articles TEXT,
  services TEXT,
  email TEXT,
  locationNeeds TEXT,
  x REAL,
  y REAL
);

CREATE TABLE panier (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  article TEXT
);

CREATE TABLE historique (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  commande TEXT
);

CREATE TABLE livreDor (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  message TEXT
);

INSERT INTO livreDor (message) VALUES
('Message1 '),
('Message2 ');

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

INSERT INTO inscriptions (titre, username, numero) VALUES
('Tir à l''arc','jdupont',1),
('Canoë-Kayak','jdupont',1),
('Bowling','jdupont',1),
('Golf Demi-Finale','jdupont',1),
('Golf Finale','jdupont',1),
('Tennis de table','jdupont',1),
('Tennis','jdupont',1),
('Basketball','jdupont',1),
('Cyclisme','jdupont',1);

CREATE TABLE availability (
  date TEXT PRIMARY KEY,
  simple INTEGER,
  double INTEGER,
  priceSimple INTEGER,
  priceDouble INTEGER
);

INSERT INTO availability (date, simple, double, priceSimple, priceDouble) VALUES
('2025-05-11',5,3,50,80),
('2025-05-12',4,2,50,80),
('2025-05-13',6,4,50,80),
('2025-05-14',3,2,55,85),
('2025-05-15',5,3,55,85),
('2025-05-16',2,1,60,90),
('2025-05-17',4,2,60,90),
('2025-05-18',3,3,60,90),
('2025-05-19',5,2,55,85),
('2025-05-20',4,4,55,85),
('2025-05-21',3,2,50,80),
('2025-05-22',4,3,50,80),
('2025-05-23',2,1,50,80),
('2025-05-24',3,2,50,80);

INSERT INTO users (id, firstname, surname, username, email, password, role) VALUES
(1,'Bernadette','Buche','vis01','vis01@example.com','0c6cba853348a88915bd8f708dadaba441b1c832a8e25aca0ef12146e3a0ac75','visiteur'),
(2,'Chloé','Buche','org01','org02@example.com','728b252625ebcddcea74d61760866080a10196087c340a57a88ba511bd387921','organisateur'), -- mdp = ouioui
(3,'Arthur','Buche','vis02','vis03@example.com','4b979e04599fd0c70c5b421f9ca8abb88ee9daebc4759aea9ff5ae24d2a89d01','visiteur'),
(4,'Benoît','Buche','pres01','pres01@example.com','443b42ac37dde8dc73aa08b5df626bdc5a56ff3df95bd6d1d228eda94d15bdab','prestataire');
