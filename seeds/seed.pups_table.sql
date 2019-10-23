BEGIN;

TRUNCATE
  pups,
  users,
  pup_comments
  RESTART IDENTITY CASCADE;

INSERT INTO users(fullname, user_name, password)
VALUES
('EJ Gonzalez', 'EJ132', '$2a$12$RZAgvfQYvIZkiGcXJPByk.zSJBzbvJApUr3V2Szks7tg2zjxjDLSW');

INSERT INTO pups (name, image, lat, long, category, description, owner, zipcode)
VALUES
('Chico', 'https://images.unsplash.com/photo-1456318456940-4da16c8fc9bc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60', 33.899421, -118.356705, 'Small', 'Brown dog very loving and likes squeky toys', 1,'90260'),
('Chico Number 2', 'https://images.unsplash.com/photo-1456318456940-4da16c8fc9bc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60', 33.913904, -118.349270, 'Medium', 'Brown dog very loving and likes squeky toys', 1,'90260'),
('Chico Number 3', 'https://images.unsplash.com/photo-1456318456940-4da16c8fc9bc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60', 33.914195, -118.366029, 'Large', 'Brown dog very loving and likes squeky toys', 1,'90220'),
('Chico Number 4', 'https://images.unsplash.com/photo-1456318456940-4da16c8fc9bc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60', 33.902627, -118.327773, 'Small', 'Brown dog very loving and likes squeky toys', 1, '90255'),
('Chico Number 5', 'https://images.unsplash.com/photo-1456318456940-4da16c8fc9bc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60', 33.891844, -118.349385, 'Medium', 'Brown dog very loving and likes squeky toys', 1, '90255');

INSERT INTO pup_comments (
  comment,
  pup_id,
  user_id
) VALUES
  (
    'Last seen on Birch & Maple',
    1,
    1
  ),
  (
    'Found him, here is my number: 310-310-3210',
    1,
    1
  ),
  (
    'All the other comments are obviously insane, but this thing is actually pretty amazing.',
    1,
    1
  ),
  (
    'When life gives you lemons, trade them for this thing.',
    1,
    1
  ),
  (
    'This cured my psoriasis, but left me unable to tell the difference between the taste of squash and the concept of increasing.',
    2,
    1
  ),
  (
    'I think I swallowed a bug.',
    2,
    1
  ),
  (
    'I have not used it or even seen it, and I do not actually know what it is. I do not know why I am writing this review, how I got here, or what my name is. Three stars!',
    3,
    1
  ),
  (
    'Ew.',
    3,
    1
  ),
  (
    'I heard about this one time at band camp.',
    4,
    1
  ),
  (
    'big time many goodness!!!',
    4,
    1
  ),
  (
    'Iste, architecto obcaecati tenetur quidem voluptatum ipsa quam!',
    4,
    1
  ),
  (
    'There are some better things. There are also some worse things.',
    3,
    1
  ),
  (
    'Great holiday present for extraterrestrials (only the kind with the lightbulb heads).',
    5,
    1
  ),
  (
    'It does not say this on the label, but this thing can be used to summon rain on the spring equinox with the proper incantation.',
    5,
    1
  ),
  (
    'Do not believe the hype!',
    5,
    1
  ),
  (
    'I would rather have a shoulder rub.',
    2,
    1
  ),
  (
    'I heard this has lead in it! Run! RRUUUUUUNNNN!',
    2,
    1
  ),
  (
    'This would not fit inside the cabin of my horse-and-buggy, but it was a useful bribe after the string cheese incident.',
    1,
    1
  ),
  (
    'Slightly better than waking up deep in the forests of Madagascar and having no idea how you got there, but not THAT much better.',
    1,
    1
  ),
  (
    'Octopii give it eight tentacles up!',
    2,
    1
  );

COMMIT;