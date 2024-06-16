-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 20, 2023 at 04:15 PM
-- Server version: 10.6.16-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hdvq7976_wp799`
--

-- --------------------------------------------------------

--
-- Table structure for table `wpq7oe_vc_subaccounts`
--

CREATE TABLE `wpq7oe_vc_subaccounts` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `cards_limit` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `wpq7oe_vc_subaccounts`
--

INSERT INTO `wpq7oe_vc_subaccounts` (`id`, `name`, `email`, `password`, `cards_limit`, `created_at`, `updated_at`) VALUES
(10000004, 'Zaeem', 'zaeem1169@gmail.com', '$2a$10$qanm.dj4uDU9cmr0HcolcOlrHYGH/3p9dZfSIqSEOw97BIk/sFj/q', 100, '2023-12-16 05:26:39', '2023-12-16 05:26:39'),
(10000005, 'WE FAST', 'direction@wefast.fr', '$2a$10$Y/WDlVfDTStlsPYWQFL4gOk.M3c5Un8PNGyYg7E/sruE4BnzJkSrK', 2, '2023-12-19 08:06:34', '2023-12-19 08:06:34');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `wpq7oe_vc_subaccounts`
--
ALTER TABLE `wpq7oe_vc_subaccounts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `wpq7oe_vc_subaccounts`
--
ALTER TABLE `wpq7oe_vc_subaccounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10000006;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
