

-- Database: `pethealthcare`
--

-- --------------------------------------------------------
CREATE DATABASE `pethealthcare`;

USE `pethealthcare`;

--
-- Table structure for table `breed_questions`
--

CREATE TABLE `breed_questions` (
  `question_id` int NOT NULL,
  `section_id` int NOT NULL,
  `question` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `answer` text COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `breed_questions`
--

INSERT INTO `breed_questions` (`question_id`, `section_id`, `question`, `answer`) VALUES
(1, 1, 'How much activity does this breed need?', 'Plan daily walks, play, and breed-appropriate games. Increase activity gradually.'),
(2, 2, 'What routine care should I plan?', 'Brush the coat several times each week, check the ears, and schedule veterinary visits.'),
(3, 3, 'How can I keep this breed safe in warm weather?', 'Avoid strenuous activity in heat and provide water and shade.'),
(4, 4, 'What should I monitor regularly?', 'Monitor facial folds, breathing, skin, and weight.'),
(5, 5, 'How do I keep this breed engaged?', 'Combine exercise with training, scent games, and puzzle toys.'),
(6, 6, 'What preventive care is important?', 'Brush regularly, trim nails, and schedule veterinary checkups.');

-- --------------------------------------------------------

--
-- Table structure for table `breed_sections`
--

CREATE TABLE `breed_sections` (
  `section_id` int NOT NULL,
  `breed_id` int NOT NULL,
  `title` varchar(120) COLLATE utf8mb4_general_ci NOT NULL,
  `content` text COLLATE utf8mb4_general_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `breed_sections`
--

INSERT INTO `breed_sections` (`section_id`, `breed_id`, `title`, `content`) VALUES
(1, 1, 'Everyday Exercise', 'Daily exercise should match the breed, age, and health of your dog.'),
(2, 1, 'Coat and Routine Care', 'Brush regularly, check the ears, and maintain routine veterinary visits.'),
(3, 2, 'Exercise and Heat Safety', 'Use short exercise sessions and avoid hot weather because this breed can overheat quickly.'),
(4, 2, 'Skin and Breathing Care', 'Keep facial folds clean and dry, and monitor breathing, skin, and weight.'),
(5, 3, 'Physical and Mental Activity', 'Provide daily exercise, training, scent games, and puzzle toys.'),
(6, 3, 'Grooming and Prevention', 'Brush regularly, trim nails, and maintain preventive veterinary care.');

-- --------------------------------------------------------

--
-- Table structure for table `care_guides`
--

CREATE TABLE `care_guides` (
  `id` int NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `image_path` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `care_guides`
--

INSERT INTO `care_guides` (`id`, `name`, `image_path`) VALUES
(1, 'Dog', 'images/guides/dog.jpg'),
(2, 'Cat', 'images/guides/cat.jpg'),
(3, 'Bird', 'images/guides/bird.jpg'),
(4, 'Fish', 'images/guides/fish.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `care_services`
--

CREATE TABLE `care_services` (
  `service_id` int NOT NULL,
  `service_type` varchar(64) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(120) COLLATE utf8mb4_general_ci NOT NULL,
  `phone` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `display_order` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `care_services`
--

INSERT INTO `care_services` (`service_id`, `service_type`, `name`, `phone`, `description`, `display_order`) VALUES
(1, 'Veterinary hospital', 'Paws & Care Veterinary Hospital', '555-010-2401', 'Full-service veterinary care, wellness visits, and diagnostics for pets of every age.', 1),
(2, 'Emergency clinic', 'Bright Star Emergency Clinic', '555-010-2402', 'Urgent veterinary support for injuries, illness, and after-hours emergencies.', 2),
(3, 'Pet nutrition', 'Nourish Pet Nutrition', '555-010-2403', 'Personalized nutrition plans to support healthy growth, recovery, and everyday wellbeing.', 3),
(4, 'Animal clinic', 'Greenfield Animal Clinic', '555-010-2404', 'Friendly preventive care, vaccinations, dental services, and ongoing treatment plans.', 4);

-- --------------------------------------------------------

--
-- Table structure for table `dog_breeds`
--

CREATE TABLE `dog_breeds` (
  `breed_id` int NOT NULL,
  `slug` varchar(120) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(120) COLLATE utf8mb4_general_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dog_breeds`
--

INSERT INTO `dog_breeds` (`breed_id`, `slug`, `name`, `description`, `image_url`) VALUES
(1, 'golden-retriever', 'Golden Retriever', 'Bright, friendly, and ready for a long walk.', 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=85'),
(2, 'french-bulldog', 'French Bulldog', 'Playful, adaptable, and full of personality.', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1200&q=85'),
(3, 'border-collie', 'Border Collie', 'Thoughtful, energetic, and wonderfully clever.', 'https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=1200&q=85');

-- --------------------------------------------------------

--
-- Table structure for table `guide_questions`
--

CREATE TABLE `guide_questions` (
  `id` int NOT NULL,
  `section_id` int NOT NULL,
  `question` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `answer` text COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `guide_questions`
--

INSERT INTO `guide_questions` (`id`, `section_id`, `question`, `answer`) VALUES
(1, 1, 'My dog is not eating. What should I do?', 'Check the food is fresh and hasn\'t spoiled. If your dog skips more than one meal, or shows other signs such as vomiting or lethargy, contact a vet.'),
(2, 1, 'What should I feed my dog?', 'A nutritionally complete commercial dog food suited to their life stage. Avoid feeding table scraps or foods toxic to dogs, such as chocolate, onion and grapes.'),
(3, 2, 'How much exercise does my dog need?', 'Most adult dogs need at least 30 to 60 minutes of exercise a day, though this varies by breed and size.'),
(4, 2, 'My dog seems restless indoors. Why?', 'This is often a sign they aren\'t getting enough physical or mental stimulation. Try a longer walk or an interactive toy.'),
(5, 3, 'What should I feed my cat?', 'A complete cat food formulated for their life stage. Cats are obligate carnivores and need meat-based protein.'),
(6, 3, 'My cat is drinking a lot more water than usual. Should I worry?', 'Increased thirst can be an early sign of illness such as kidney disease or diabetes. Book a vet check if it continues for more than a couple of days.'),
(7, 4, 'How often should I clean the litter tray?', 'Scoop solids daily and fully change the litter at least once a week.'),
(8, 4, 'My cat stopped using the litter tray. Why?', 'This can be behavioural (a dirty tray, wrong litter type, or stress) or medical (a urinary tract issue). If it started suddenly, see a vet to rule out a medical cause.'),
(9, 5, 'What should I feed my bird?', 'A base of good-quality pellets supplemented with fresh vegetables and limited fruit. Seed alone is not a balanced diet.'),
(10, 5, 'My bird stopped eating. What should I do?', 'This can become serious quickly in birds. If it lasts more than a few hours, or your bird is fluffed up and lethargic, contact a vet the same day.'),
(11, 6, 'What size cage does my bird need?', 'As large as you can provide — wide enough for full wing extension and some flight, not just standing room.'),
(12, 6, 'Why does my bird pluck its feathers?', 'Usually stress, boredom or an underlying medical issue. Persistent plucking should be checked by an avian vet.'),
(13, 7, 'How often should I change the water?', 'Typically a 10 to 20 percent partial water change weekly, depending on tank size and stocking.'),
(14, 7, 'My fish is gasping at the surface. What does that mean?', 'Often a sign of low oxygen or poor water quality. Test the water and do a partial change; if it continues, check filtration and stocking levels.'),
(15, 8, 'How much should I feed my fish?', 'Only as much as they can eat in about two minutes, once or twice a day. Overfeeding is the most common fish-keeping mistake.'),
(16, 8, 'Why is my fish not eating?', 'Can be stress, poor water quality, or illness. Check water parameters first, as this is the most common cause.'),
(17, 9, 'How often should I check my dog’s health?', 'Check your dog daily for changes in appetite, energy, breathing, movement, or behaviour. Contact a vet if a change continues.'),
(18, 9, 'When should my dog see a vet?', 'Arrange a veterinary visit for persistent vomiting, diarrhoea, pain, unusual tiredness, breathing problems, or sudden behaviour changes.'),
(19, 10, 'How often should I groom my dog?', 'Brush your dog according to their coat type and bathe them only when needed with a pet-safe shampoo.'),
(20, 10, 'How should I care for my dog’s nails?', 'Trim nails gradually with suitable clippers. Ask a groomer or vet for help if you are unsure.'),
(21, 11, 'How can I tell if my cat is unwell?', 'Changes in eating, drinking, litter tray use, grooming, hiding, or activity can indicate a problem.'),
(22, 11, 'Should indoor cats have health checks?', 'Yes. Indoor cats still need regular vaccinations, parasite prevention, dental care, and veterinary check-ups.'),
(23, 12, 'How often should I brush my cat?', 'Brush your cat regularly, especially if they have long fur, to reduce tangles and hairballs.'),
(24, 12, 'Should I bathe my cat?', 'Most cats do not need regular baths. Ask a vet before bathing a cat with a skin condition or heavy soiling.'),
(25, 13, 'What should be inside a bird cage?', 'Provide enough space for movement, safe perches of different sizes, food and water dishes, and suitable enrichment.'),
(26, 13, 'Where should I place my bird’s cage?', 'Keep the cage away from smoke, kitchen fumes, extreme temperatures, and direct drafts.'),
(27, 14, 'How often should I replace bird food and water?', 'Provide fresh water daily and remove spoiled or contaminated food promptly.'),
(28, 14, 'How do I know if my bird is sick?', 'Reduced eating, fluffed feathers, weakness, breathing changes, or sitting at the cage bottom require prompt veterinary advice.'),
(29, 7, 'How often should I test aquarium water?', 'Test water regularly, especially after setting up a tank or introducing new fish. Follow the requirements of your species.'),
(30, 15, 'How often should I test aquarium water?', 'Test water regularly, especially after setting up a tank or introducing new fish. Follow the requirements of your species.'),
(31, 7, 'How often should I change fish tank water?', 'Perform small, regular partial water changes rather than replacing all the water at once.'),
(32, 15, 'How often should I change fish tank water?', 'Perform small, regular partial water changes rather than replacing all the water at once.'),
(33, 16, 'Do fish need hiding places?', 'Yes. Plants, caves, and other safe hiding places help fish feel secure and reduce stress.'),
(34, 16, 'How many fish can live in one tank?', 'Stocking depends on tank size, filtration, species, and behaviour. Avoid overcrowding and research each species first.');

-- --------------------------------------------------------

--
-- Table structure for table `guide_sections`
--

CREATE TABLE `guide_sections` (
  `id` int NOT NULL,
  `guide_id` int NOT NULL,
  `title` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `guide_sections`
--

INSERT INTO `guide_sections` (`id`, `guide_id`, `title`, `description`) VALUES
(1, 1, 'Feeding', 'A balanced, nutritionally complete diet appropriate to your dog\'s age, size and activity level.'),
(2, 1, 'Exercise', 'Regular daily exercise keeps dogs physically healthy and prevents boredom-related behaviour problems.'),
(3, 2, 'Feeding', 'Cats need a protein-rich diet and constant access to fresh water.'),
(4, 2, 'Litter and Hygiene', 'A clean, accessible litter tray is essential for a cat\'s wellbeing.'),
(5, 3, 'Diet', 'A varied diet beyond seed, including pellets, fresh vegetables and the occasional fruit.'),
(6, 3, 'Housing and Enrichment', 'A cage large enough to allow wing-stretching and short flights, with toys and social interaction to prevent stress.'),
(7, 4, 'Water Quality', 'Clean, correctly cycled water is the single biggest factor in fish health.'),
(8, 4, 'Feeding', 'Small amounts fed regularly, avoiding the common mistake of overfeeding.'),
(9, 1, 'Health checks', 'Regular observation helps you notice changes in your dog early.'),
(10, 1, 'Grooming', 'Simple grooming routines support a healthy coat, skin, ears, and nails.'),
(11, 2, 'Health checks', 'Cats often hide discomfort, so small changes in behaviour are important.'),
(12, 2, 'Grooming', 'Regular grooming helps reduce shedding and keeps your cat comfortable.'),
(13, 3, 'Environment', 'A safe, clean, and stimulating environment supports your bird’s wellbeing.'),
(14, 3, 'Daily care', 'Fresh food, clean water, and regular observation are essential for birds.'),
(15, 4, 'Water quality', 'Clean, stable water is one of the most important parts of fish care.'),
(16, 4, 'Tank environment', 'A suitable tank size, lighting, plants, and hiding places reduce stress.');

-- --------------------------------------------------------

--
-- Table structure for table `pets`
--

CREATE TABLE `pets` (
  `pet_id` int NOT NULL,
  `user_id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `species` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `image_url` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `image_public_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pets`
--

INSERT INTO `pets` (`pet_id`, `user_id`, `name`, `species`, `created_at`, `image_url`, `image_public_id`) VALUES
(1, 4, 'Lucy', 'Dog', '2026-09-14 14:16:56', NULL, NULL),
(2, 5, 'mybird', 'Bird', '2026-09-20 04:40:02', NULL, NULL),
(3, 5, 'Lucy', 'Dog', '2026-09-20 04:40:06', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `pet_logs`
--

CREATE TABLE `pet_logs` (
  `pet_log_id` int NOT NULL,
  `pet_id` int NOT NULL,
  `log_type` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Other',
  `entry` text COLLATE utf8mb4_general_ci NOT NULL,
  `logged_at` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pet_logs`
--

INSERT INTO `pet_logs` (`pet_log_id`, `pet_id`, `log_type`, `entry`, `logged_at`, `created_at`) VALUES
(1, 2, 'Feeding', 'updating logs', '2026-09-19', '2026-09-20 05:26:38');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int UNSIGNED NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `name`, `email`, `password`, `created_at`) VALUES
(1, 'Test User', 'test-user-2026@example.com', '$2b$10$7DnllMSacy9qAoL5BNWfBuWL/Ijt/zL0w1nnVjFgNRg1OAFlw.tye', '2026-09-09 12:56:22'),
(2, 'Alex Smith', 'alex@example.com', '$2b$10$imY.zoiBEuXIhG6lJ6LMpuTQ2xyTm5fH0ClN8swRfJTkaNGAt6Oui', '2026-09-09 12:56:42'),
(5, 'Saujan Bindukar', 'saujan@gmail.com', '$2b$10$OeRq3im/FKhoUlV93eNiJ.yFNNSyrecSNdeLuga4LlHZEffvG/8qy', '2026-09-14 14:20:11'),
(9, 'saujan bin', 'saujan2@gmail.com', '$2b$10$R6qq7HVbaHi1DTNjYYtjwuglqVeHXCw7RzZ4aI/6eFOijZVY70Ou.', '2026-09-14 14:27:24'),
(10, 'Saujan', 'aa@gmail.com', '$2b$10$h//mjmKyJ0r9hbqwz9YEEu6IjN0fRUw8k8NvgvEOu3CLKGdnLReyG', '2026-09-14 14:30:45'),
(12, 'Saujan', 'aa1@gmail.com', '$2b$10$.9kuPFlH3eAD/OgqLewMROZ/o6Lei9V0ar7DHUlbTP2MF3OBMOruW', '2026-09-14 14:31:10'),
(13, 'Saujan', 'aa2@gmail.com', '$2b$10$XjlQ7QYbcClK9uS.Dci9kOeZLzrfTA86/9B4HehRMGd8Vd7Eq8stG', '2026-09-14 14:31:24'),
(14, 'API Check', 'api-check-20260915@example.com', '$2b$10$uNHbvmXFqdBWJ5FOqrqMbe/aiKsr2/wD.PMxwwzJIKDCEJT1/zU4y', '2026-09-14 14:32:36'),
(16, 'Hello', 'hello@gmail.com', '$2b$10$xKNIxez1/CMsOuiTp78W1OySlu5Km/Pcro4VcvNYXyKBzkwopXuoS', '2026-09-14 14:33:34');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `breed_questions`
--
ALTER TABLE `breed_questions`
  ADD PRIMARY KEY (`question_id`),
  ADD UNIQUE KEY `unique_section_question` (`section_id`,`question`);

--
-- Indexes for table `breed_sections`
--
ALTER TABLE `breed_sections`
  ADD PRIMARY KEY (`section_id`),
  ADD UNIQUE KEY `unique_breed_section` (`breed_id`,`title`);

--
-- Indexes for table `care_guides`
--
ALTER TABLE `care_guides`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `care_services`
--
ALTER TABLE `care_services`
  ADD PRIMARY KEY (`service_id`),
  ADD UNIQUE KEY `uq_care_services_name` (`name`);

--
-- Indexes for table `dog_breeds`
--
ALTER TABLE `dog_breeds`
  ADD PRIMARY KEY (`breed_id`),
  ADD UNIQUE KEY `uq_dog_breeds_slug` (`slug`);

--
-- Indexes for table `guide_questions`
--
ALTER TABLE `guide_questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `section_id` (`section_id`);

--
-- Indexes for table `guide_sections`
--
ALTER TABLE `guide_sections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `guide_id` (`guide_id`);

--
-- Indexes for table `pets`
--
ALTER TABLE `pets`
  ADD PRIMARY KEY (`pet_id`);

--
-- Indexes for table `pet_logs`
--
ALTER TABLE `pet_logs`
  ADD PRIMARY KEY (`pet_log_id`),
  ADD KEY `idx_pet_logs_pet_date` (`pet_id`,`logged_at`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `breed_questions`
--
ALTER TABLE `breed_questions`
  MODIFY `question_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `breed_sections`
--
ALTER TABLE `breed_sections`
  MODIFY `section_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `care_guides`
--
ALTER TABLE `care_guides`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `care_services`
--
ALTER TABLE `care_services`
  MODIFY `service_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `dog_breeds`
--
ALTER TABLE `dog_breeds`
  MODIFY `breed_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `guide_questions`
--
ALTER TABLE `guide_questions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `guide_sections`
--
ALTER TABLE `guide_sections`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `pets`
--
ALTER TABLE `pets`
  MODIFY `pet_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `pet_logs`
--
ALTER TABLE `pet_logs`
  MODIFY `pet_log_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `breed_questions`
--
ALTER TABLE `breed_questions`
  ADD CONSTRAINT `breed_questions_ibfk_1` FOREIGN KEY (`section_id`) REFERENCES `breed_sections` (`section_id`) ON DELETE CASCADE;

--
-- Constraints for table `breed_sections`
--
ALTER TABLE `breed_sections`
  ADD CONSTRAINT `breed_sections_ibfk_1` FOREIGN KEY (`breed_id`) REFERENCES `dog_breeds` (`breed_id`) ON DELETE CASCADE;

--
-- Constraints for table `guide_questions`
--
ALTER TABLE `guide_questions`
  ADD CONSTRAINT `guide_questions_ibfk_1` FOREIGN KEY (`section_id`) REFERENCES `guide_sections` (`id`);

--
-- Constraints for table `guide_sections`
--
ALTER TABLE `guide_sections`
  ADD CONSTRAINT `guide_sections_ibfk_1` FOREIGN KEY (`guide_id`) REFERENCES `care_guides` (`id`);


ALTER TABLE `pet_logs`
  ADD CONSTRAINT `pet_logs_pet_fk` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`pet_id`) ON DELETE CASCADE;
COMMIT;

