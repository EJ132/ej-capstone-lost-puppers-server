CREATE TABLE pups (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT NOT NULL,
  lat FLOAT NOT NULL,
  long FLOAT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  date_created DATE DEFAULT CURRENT_TIMESTAMP,
  zipcode TEXT NOT NULL,
  owner INTEGER NOT NULL
);