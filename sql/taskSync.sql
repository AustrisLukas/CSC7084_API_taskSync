-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 12, 2025 at 08:47 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `taskSync`
--

-- --------------------------------------------------------

--
-- Table structure for table `account_role`
--

CREATE TABLE `account_role` (
  `role_id` int(11) NOT NULL,
  `role_desc` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `account_role`
--

INSERT INTO `account_role` (`role_id`, `role_desc`) VALUES
(1, 'administrator'),
(2, 'user');

-- --------------------------------------------------------

--
-- Table structure for table `account_status`
--

CREATE TABLE `account_status` (
  `account_status_id` int(11) NOT NULL,
  `status_desc` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `account_status`
--

INSERT INTO `account_status` (`account_status_id`, `status_desc`) VALUES
(1, 'active'),
(2, 'suspended');

-- --------------------------------------------------------

--
-- Table structure for table `category_colour`
--

CREATE TABLE `category_colour` (
  `colour_id` int(11) NOT NULL,
  `colour_name` varchar(255) NOT NULL,
  `colour_url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category_colour`
--

INSERT INTO `category_colour` (`colour_id`, `colour_name`, `colour_url`) VALUES
(1, 'Blue', 'cat_colour/blue.png'),
(2, 'Green', 'cat_colour/green.png'),
(3, 'Purple', 'cat_colour/purple.png'),
(4, 'Red', 'cat_colour/red.png'),
(5, 'Yellow', 'cat_colour/yellow.png');

-- --------------------------------------------------------

--
-- Table structure for table `task`
--

CREATE TABLE `task` (
  `task_id` int(11) NOT NULL,
  `task_name` varchar(255) NOT NULL,
  `task_desc` text DEFAULT NULL,
  `created_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `due_date` datetime NOT NULL,
  `date_completed` datetime DEFAULT NULL,
  `star_level` tinyint(4) NOT NULL DEFAULT 0,
  `task_status_id` int(11) NOT NULL,
  `task_category_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `task`
--

INSERT INTO `task` (`task_id`, `task_name`, `task_desc`, `created_date`, `due_date`, `date_completed`, `star_level`, `task_status_id`, `task_category_id`, `user_id`) VALUES
(1, 'Start TaskSync', 'Start designing task TaskSync app - home and log in pages...', '2025-03-01 16:00:26', '2025-04-24 00:00:00', NULL, 1, 0, 3, 1),
(2, 'taskSync database design', 'Start designing taskSync database', '2025-03-01 17:03:14', '2025-01-05 00:00:00', NULL, 1, 0, 3, 1),
(4, 'testing columns', 'testing columns distribution with a longer message card. testing columns distribution with a longer message card', '2025-03-01 18:51:17', '2025-05-03 00:00:00', NULL, 0, 0, 4, 1),
(5, 'Swim', 'Go for a quick swim in Helen\'s bay', '2025-02-01 21:50:28', '2025-12-30 00:00:00', '2025-03-01 21:50:28', 0, 1, 2, 1),
(6, 'Test task title', 'The quick brown fox jumps over the lazy dog', '2025-03-01 21:22:55', '2025-03-06 00:00:00', NULL, 0, 0, 4, 1),
(8, 'Walk Dog', 'Take Bella for a walk.', '2025-02-22 11:28:18', '2025-03-14 00:00:00', NULL, 0, 0, 2, 1),
(18, 'Not deletable', 'This task should not be deleted as it already marked as complete.', '2025-03-01 21:47:50', '2025-02-14 00:00:00', '2025-03-02 12:31:52', 2, 1, 4, 1),
(23, 'taskSync test', 'testing if tasks register as status 0. The check all of the edit functionality to ensure its all ok', '2025-03-01 18:51:35', '2025-04-11 00:00:00', NULL, 1, 0, 5, 1),
(27, 'Statistics', 'Implement a page that displays statistics about completed tasks', '2025-03-01 21:22:27', '2025-04-07 00:00:00', NULL, 1, 0, 3, 1),
(32, 'Implement statistics page', 'Implement statistics page \r\n- Graph example\r\n- Piechart example\r\n- Two summary tables\r\n\r\nEnsure data visualisation', '2025-03-01 21:20:35', '2025-04-18 00:00:00', NULL, 1, 0, 3, 1),
(33, 'Testing long text', 'Testing long text note where excess characters should be truncated by homeUtils.js  limitTextLenght() and preventing one note taking over entire page. Testing long text note where excess characters should be truncated by homeUtils.js  limitTextLenght() and preventing one note taking over entire page. Testing long text note where excess characters should be truncated by homeUtils.js  limitTextLenght() and preventing one note taking over entire page. Testing long text note where excess characters should be truncated by homeUtils.js  limitTextLenght() and preventing one note taking over entire page. Testing long text note where excess characters should be truncated by homeUtils.js  limitTextLenght() and preventing one note taking over entire page.', '2025-03-01 21:22:17', '2025-03-03 00:00:00', NULL, 0, 0, 3, 1),
(57, 'Book holiday', 'Book holiday flights, find a nice hotel with a beach view.', '2025-03-09 10:58:01', '2025-04-02 00:00:00', NULL, 0, 0, 4, 1),
(60, 'EDIT - This field is limited to 255 characters in SQL', 'EDIT - SQL type is text, however task preview will only display 250 characters to prevent one task card from taking over the entire page.\r\nData sanitisation is also performed before task is submitted to the database.', '2025-03-09 17:05:06', '2025-03-09 00:00:00', '2025-03-09 18:25:59', 2, 1, 3, 1);

-- --------------------------------------------------------

--
-- Table structure for table `task_category`
--

CREATE TABLE `task_category` (
  `task_category_id` int(11) NOT NULL,
  `category_name` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL,
  `colour_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `task_category`
--

INSERT INTO `task_category` (`task_category_id`, `category_name`, `user_id`, `colour_id`) VALUES
(1, 'Work', 1, 1),
(2, 'Exercise', 1, 4),
(3, 'University', 1, 3),
(4, 'Home', 1, 4),
(5, 'Misc', 1, 5),
(51, 'Work', 32, 1),
(52, 'Home', 32, 2),
(53, 'Webdev', 32, 2),
(54, 'Project5', 32, 4),
(55, 'Holiday trip', 32, 1),
(56, 'Work', 33, 1),
(57, 'Home', 33, 2),
(58, 'Project X', 33, 4),
(65, 'Work', 37, 1),
(66, 'Home', 37, 2),
(68, 'Holiday', 37, 4),
(69, 'Work', 38, 1),
(70, 'Home', 38, 2),
(71, 'Work', 39, 1),
(72, 'Home', 39, 2);

-- --------------------------------------------------------

--
-- Table structure for table `task_status`
--

CREATE TABLE `task_status` (
  `task_status_id` int(11) NOT NULL,
  `status_desc` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `task_status`
--

INSERT INTO `task_status` (`task_status_id`, `status_desc`) VALUES
(0, 'active'),
(1, 'completed');

-- --------------------------------------------------------

--
-- Table structure for table `user_account`
--

CREATE TABLE `user_account` (
  `user_id` int(11) NOT NULL,
  `user_email` varchar(50) NOT NULL,
  `hashed_password` varchar(255) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `account_status_id` int(11) NOT NULL,
  `user_details_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_account`
--

INSERT INTO `user_account` (`user_id`, `user_email`, `hashed_password`, `date_created`, `account_status_id`, `user_details_id`, `role_id`) VALUES
(1, 'austris.lukas@gmail.com', '$2b$10$4x27H5zmUW1tDztRp4MHnuL65e5RdBxPZJrUBW64y96SMzv/eAbBC', '2025-02-16 12:45:12', 1, 1, 1),
(32, 'test@gmail.com', '$2b$10$/EzuN8z4qJdWS9HafYIUHOQmDmBVxmR0cB7rSiumgkU8qE5IP5Sae', '2025-03-08 18:01:48', 1, 52, 1),
(33, 'Kerry.kerry@gmail.com', '$2b$10$5rRXQNjIWOw/GLv7k1VuT.H3cDN23TQHUwDGJTvmGwWpRkQUphf22', '2025-03-08 20:32:44', 1, 53, 1),
(37, 'video@gmail.com', '$2b$10$LEba7USIfRIXAkpxBerTbOUvSEJDdsF6y6Chp7lNFR5bT1twEuQn2', '2025-03-09 13:35:00', 1, 57, 1),
(38, 'austris.lukas888@gmail.com', '$2b$10$OjGijRasiRYLjwTGg7tTEOqx6CmllsWd029FYtP12CwZMf7AiBMJS', '2025-03-12 10:22:59', 1, 58, 1),
(39, 'austris.lukas00@gmail.com', '$2b$10$PFRZhfWYLh8OQYzO3EQzY.z2L/Ddi6dnxQYTjuf93i4PPzBnO6tbm', '2025-03-12 10:37:11', 1, 59, 1);

-- --------------------------------------------------------

--
-- Table structure for table `user_details`
--

CREATE TABLE `user_details` (
  `user_details_id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `last_edit_timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_details`
--

INSERT INTO `user_details` (`user_details_id`, `first_name`, `last_name`, `last_edit_timestamp`) VALUES
(1, 'Austris', 'Lukas', '2025-01-03 18:35:41'),
(52, 'testaccount', NULL, '2025-03-08 18:01:48'),
(53, 'Kerry', NULL, '2025-03-08 20:32:44'),
(57, 'Austris', NULL, '2025-03-09 13:35:00'),
(58, 'ab', NULL, '2025-03-12 10:22:59'),
(59, 'abc', NULL, '2025-03-12 10:37:11');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account_role`
--
ALTER TABLE `account_role`
  ADD PRIMARY KEY (`role_id`);

--
-- Indexes for table `account_status`
--
ALTER TABLE `account_status`
  ADD PRIMARY KEY (`account_status_id`);

--
-- Indexes for table `category_colour`
--
ALTER TABLE `category_colour`
  ADD PRIMARY KEY (`colour_id`);

--
-- Indexes for table `task`
--
ALTER TABLE `task`
  ADD PRIMARY KEY (`task_id`),
  ADD KEY `FK_task_task_status_task_status_id` (`task_status_id`),
  ADD KEY `FK_task_task_category_task_category_id` (`task_category_id`),
  ADD KEY `FK_task_user_account_user_id` (`user_id`);

--
-- Indexes for table `task_category`
--
ALTER TABLE `task_category`
  ADD PRIMARY KEY (`task_category_id`),
  ADD KEY `FK_task_category_category_color_colour_id` (`colour_id`),
  ADD KEY `FK_task_category_user_account_user_account_id` (`user_id`);

--
-- Indexes for table `task_status`
--
ALTER TABLE `task_status`
  ADD PRIMARY KEY (`task_status_id`);

--
-- Indexes for table `user_account`
--
ALTER TABLE `user_account`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `user_email` (`user_email`),
  ADD KEY `FK_user_account_account_status_account_status_id` (`account_status_id`),
  ADD KEY `FK_user_account_user_details_user_details_id` (`user_details_id`),
  ADD KEY `FK_user_account_account_role_role_id` (`role_id`);

--
-- Indexes for table `user_details`
--
ALTER TABLE `user_details`
  ADD PRIMARY KEY (`user_details_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `account_role`
--
ALTER TABLE `account_role`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `account_status`
--
ALTER TABLE `account_status`
  MODIFY `account_status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `category_colour`
--
ALTER TABLE `category_colour`
  MODIFY `colour_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `task`
--
ALTER TABLE `task`
  MODIFY `task_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=75;

--
-- AUTO_INCREMENT for table `task_category`
--
ALTER TABLE `task_category`
  MODIFY `task_category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

--
-- AUTO_INCREMENT for table `task_status`
--
ALTER TABLE `task_status`
  MODIFY `task_status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `user_account`
--
ALTER TABLE `user_account`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `user_details`
--
ALTER TABLE `user_details`
  MODIFY `user_details_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `task`
--
ALTER TABLE `task`
  ADD CONSTRAINT `FK_task_task_category_task_category_id` FOREIGN KEY (`task_category_id`) REFERENCES `task_category` (`task_category_id`),
  ADD CONSTRAINT `FK_task_task_status_task_status_id` FOREIGN KEY (`task_status_id`) REFERENCES `task_status` (`task_status_id`),
  ADD CONSTRAINT `FK_task_user_account_user_id` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`user_id`);

--
-- Constraints for table `task_category`
--
ALTER TABLE `task_category`
  ADD CONSTRAINT `FK_task_category_category_color_colour_id` FOREIGN KEY (`colour_id`) REFERENCES `category_colour` (`colour_id`),
  ADD CONSTRAINT `FK_task_category_user_account_user_account_id` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`user_id`);

--
-- Constraints for table `user_account`
--
ALTER TABLE `user_account`
  ADD CONSTRAINT `FK_user_account_account_role_role_id` FOREIGN KEY (`role_id`) REFERENCES `account_role` (`role_id`),
  ADD CONSTRAINT `FK_user_account_account_status_account_status_id` FOREIGN KEY (`account_status_id`) REFERENCES `account_status` (`account_status_id`),
  ADD CONSTRAINT `FK_user_account_user_details_user_details_id` FOREIGN KEY (`user_details_id`) REFERENCES `user_details` (`user_details_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
