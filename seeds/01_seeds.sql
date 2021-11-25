INSERT INTO users (name, email, password)
VALUES ('John Wall', 'johnwall@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Lebron James', 'lebronjames@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Monkey D. Luffy', 'onepiece@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (1, 'Mr', 'description', 'photo', 'photo', 1000000, 5, 7, 5, 'Canada', 'Rose Street', 'Ottawa', 'Ontario', 'text', TRUE),
(2, 'Mr', 'description', 'photo', 'photo', 87000000, 2, 4, 2, 'Canada', 'Back Street', 'Ottawa', 'Ontario', 'text', TRUE),
(3, 'Mr', 'description', 'photo', 'photo', 2394234, 1, 5, 3, 'Canada', 'Lion Street', 'Toronto', 'Ontario', 'text', TRUE);


INSERT INTO reservations (guest_id, property_id, start_date, end_date)
VALUES (1, 1, '2018-09-11', '2018-09-26'),
(2, 2, '2019-01-04', '2019-02-01'),
(3, 3, '2021-10-01', '2021-10-14');

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating)
VALUES (1, 1, 1, 5),
(2, 2, 2, 3),
(3, 3, 3, 4);