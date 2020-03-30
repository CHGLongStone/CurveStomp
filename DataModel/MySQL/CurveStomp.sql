CREATE DATABASE  IF NOT EXISTS `CurveStomp` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `CurveStomp`;
-- MySQL dump 10.13  Distrib 8.0.13, for Win64 (x86_64)
--
-- Host: localhost    Database: CurveStomp
-- ------------------------------------------------------
-- Server version	5.5.5-10.3.21-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `household`
--

DROP TABLE IF EXISTS `household`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `household` (
  `household_pk` int(11) NOT NULL AUTO_INCREMENT,
  `household_postal_fk` int(11) NOT NULL,
  `household_guid` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `language_code_fk` int(11) DEFAULT NULL,
  PRIMARY KEY (`household_pk`),
  KEY `household_postal_fk_idx` (`household_postal_fk`),
  KEY `household_lang_fk_idx` (`language_code_fk`),
  CONSTRAINT `household_lang_fk` FOREIGN KEY (`language_code_fk`) REFERENCES `iso_lang` (`iso_lang_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `household_postal_fk` FOREIGN KEY (`household_postal_fk`) REFERENCES `location_profile` (`regional_postal_code_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `household`
--
-- ORDER BY:  `household_pk`

LOCK TABLES `household` WRITE;
/*!40000 ALTER TABLE `household` DISABLE KEYS */;
/*!40000 ALTER TABLE `household` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `individual`
--

DROP TABLE IF EXISTS `individual`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `individual` (
  `individual_pk` int(11) NOT NULL AUTO_INCREMENT,
  `household_fk` int(11) NOT NULL,
  `individual_guid` varchar(36) NOT NULL,
  `age` int(3) DEFAULT NULL,
  `email` varchar(60) DEFAULT NULL,
  `gender` int(1) DEFAULT NULL,
  `passcode` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`individual_pk`),
  KEY `household_fk_idx_idx` (`household_fk`),
  CONSTRAINT `household_fk_idx` FOREIGN KEY (`household_fk`) REFERENCES `household` (`household_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `individual`
--
-- ORDER BY:  `individual_pk`

LOCK TABLES `individual` WRITE;
/*!40000 ALTER TABLE `individual` DISABLE KEYS */;
/*!40000 ALTER TABLE `individual` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `iso_countries`
--

DROP TABLE IF EXISTS `iso_countries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `iso_countries` (
  `PK` int(11) NOT NULL AUTO_INCREMENT,
  `CommonName` varchar(255) DEFAULT NULL,
  `FormalName` varchar(255) DEFAULT NULL,
  `Capital` varchar(255) DEFAULT NULL,
  `ISO_3166-1_2_Letter_Code` varchar(2) DEFAULT NULL,
  `ISO_3166-1_3 Letter_Code` varchar(3) DEFAULT NULL,
  `ISO_3166-1_Number` varchar(4) DEFAULT NULL,
  `IANA_Country_Code_TLD` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`PK`),
  KEY `ISO_2_Letter_idx` (`ISO_3166-1_2_Letter_Code`),
  KEY `ISO_3 Letter_idx` (`ISO_3166-1_3 Letter_Code`),
  KEY `Country_Code_TLD_idx` (`IANA_Country_Code_TLD`)
) ENGINE=InnoDB AUTO_INCREMENT=273 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `iso_countries`
--
-- ORDER BY:  `PK`

LOCK TABLES `iso_countries` WRITE;
/*!40000 ALTER TABLE `iso_countries` DISABLE KEYS */;
/*!40000 ALTER TABLE `iso_countries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `iso_lang`
--

DROP TABLE IF EXISTS `iso_lang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `iso_lang` (
  `iso_lang_pk` int(11) NOT NULL AUTO_INCREMENT,
  `iso_2` varchar(2) DEFAULT NULL,
  `iso_5` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`iso_lang_pk`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `iso_lang`
--
-- ORDER BY:  `iso_lang_pk`

LOCK TABLES `iso_lang` WRITE;
/*!40000 ALTER TABLE `iso_lang` DISABLE KEYS */;
/*!40000 ALTER TABLE `iso_lang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `location_profile`
--

DROP TABLE IF EXISTS `location_profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `location_profile` (
  `regional_postal_code_pk` int(11) NOT NULL AUTO_INCREMENT,
  `country_fk` int(11) NOT NULL,
  `region` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `street` varchar(100) DEFAULT NULL,
  `postal_code` varchar(20) NOT NULL,
  `coordinates` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`regional_postal_code_pk`),
  KEY `pc_country_idx_idx` (`country_fk`),
  KEY `postal_code_idx` (`postal_code`,`country_fk`),
  CONSTRAINT `pc_country_idx` FOREIGN KEY (`country_fk`) REFERENCES `iso_countries` (`PK`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `location_profile`
--
-- ORDER BY:  `regional_postal_code_pk`

LOCK TABLES `location_profile` WRITE;
/*!40000 ALTER TABLE `location_profile` DISABLE KEYS */;
/*!40000 ALTER TABLE `location_profile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resource`
--

DROP TABLE IF EXISTS `resource`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `resource` (
  `resource_pk` int(11) NOT NULL AUTO_INCREMENT,
  `resource_type_fk` int(11) DEFAULT NULL,
  `resource_name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`resource_pk`),
  KEY `resource_type_fk_idx_idx` (`resource_type_fk`),
  CONSTRAINT `resource_type_fk_idx` FOREIGN KEY (`resource_type_fk`) REFERENCES `resource_type` (`resource_type_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resource`
--
-- ORDER BY:  `resource_pk`

LOCK TABLES `resource` WRITE;
/*!40000 ALTER TABLE `resource` DISABLE KEYS */;
/*!40000 ALTER TABLE `resource` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resource_log`
--

DROP TABLE IF EXISTS `resource_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `resource_log` (
  `resource_log_pk` int(11) NOT NULL AUTO_INCREMENT,
  `resource_fk` int(11) NOT NULL,
  `household_fk` int(11) NOT NULL,
  `availability` int(1) NOT NULL DEFAULT 5,
  `resource_log_timestamp` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`resource_log_pk`),
  KEY `resource_fk_idx_idx` (`resource_fk`),
  KEY `resource_to_household_idx_idx` (`household_fk`),
  CONSTRAINT `resource_fk_idx` FOREIGN KEY (`resource_fk`) REFERENCES `resource` (`resource_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `resource_to_household_idx` FOREIGN KEY (`household_fk`) REFERENCES `household` (`household_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resource_log`
--
-- ORDER BY:  `resource_log_pk`

LOCK TABLES `resource_log` WRITE;
/*!40000 ALTER TABLE `resource_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `resource_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resource_type`
--

DROP TABLE IF EXISTS `resource_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `resource_type` (
  `resource_type_pk` int(11) NOT NULL AUTO_INCREMENT,
  `resource_name` varchar(45) DEFAULT NULL,
  `resource_desc` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`resource_type_pk`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resource_type`
--
-- ORDER BY:  `resource_type_pk`

LOCK TABLES `resource_type` WRITE;
/*!40000 ALTER TABLE `resource_type` DISABLE KEYS */;
INSERT INTO `resource_type` (`resource_type_pk`, `resource_name`, `resource_desc`) VALUES (1,'food',NULL),(2,'water',NULL),(3,'medication',NULL),(4,'other',NULL);
/*!40000 ALTER TABLE `resource_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `symptom_log`
--

DROP TABLE IF EXISTS `symptom_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `symptom_log` (
  `symptom_log_pk` int(11) NOT NULL AUTO_INCREMENT,
  `individual_fk` int(11) NOT NULL,
  `symptom_log_timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `dry_cough` int(1) NOT NULL DEFAULT 0,
  `pneumonia` int(1) NOT NULL DEFAULT 0,
  `difficulty_breathing` int(1) NOT NULL DEFAULT 0,
  `difficulty_walking` int(1) NOT NULL DEFAULT 0,
  `appetite` int(1) NOT NULL DEFAULT 5,
  `diarrhea` int(1) NOT NULL DEFAULT 0,
  `muscle_ache` int(1) NOT NULL DEFAULT 0,
  `fatigue` int(1) NOT NULL DEFAULT 0,
  `runny_nose` int(1) NOT NULL DEFAULT 0,
  `congestion` int(1) NOT NULL DEFAULT 0,
  `sore_throat` int(1) NOT NULL DEFAULT 0,
  `fever` float(3,1) NOT NULL DEFAULT 37.0,
  `headache` int(1) NOT NULL DEFAULT 0,
  `confusion__dizzyness` int(1) NOT NULL DEFAULT 0,
  `nausea` int(1) NOT NULL DEFAULT 0,
  `chills` int(1) NOT NULL DEFAULT 0,
  `other_pain` int(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`symptom_log_pk`),
  KEY `individual_to_symptom_idx_idx` (`individual_fk`),
  CONSTRAINT `individual_to_symptom_idx` FOREIGN KEY (`individual_fk`) REFERENCES `individual` (`individual_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `symptom_log`
--
-- ORDER BY:  `symptom_log_pk`

LOCK TABLES `symptom_log` WRITE;
/*!40000 ALTER TABLE `symptom_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `symptom_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `testing_log`
--

DROP TABLE IF EXISTS `testing_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `testing_log` (
  `testing_log_pk` int(11) NOT NULL AUTO_INCREMENT,
  `individual_fk` int(11) DEFAULT NULL,
  `test_result` int(1) DEFAULT NULL,
  `recovered` int(1) DEFAULT NULL,
  `hospitalized` int(1) DEFAULT NULL,
  `ventilation` int(1) DEFAULT NULL,
  `oxygen` int(1) DEFAULT NULL,
  PRIMARY KEY (`testing_log_pk`),
  KEY `individual_test_idx_idx` (`individual_fk`),
  CONSTRAINT `individual_test_idx` FOREIGN KEY (`individual_fk`) REFERENCES `individual` (`individual_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `testing_log`
--
-- ORDER BY:  `testing_log_pk`

LOCK TABLES `testing_log` WRITE;
/*!40000 ALTER TABLE `testing_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `testing_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transmission_profile_log`
--

DROP TABLE IF EXISTS `transmission_profile_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `transmission_profile_log` (
  `transmission_profile_log_pk` int(11) NOT NULL AUTO_INCREMENT,
  `individual_fk` int(11) DEFAULT NULL,
  `isolation` int(1) DEFAULT NULL,
  `travel_amount` int(1) DEFAULT NULL,
  `travel_distance` int(2) DEFAULT NULL,
  `surface_touch` int(1) DEFAULT NULL,
  `number_of_regular_contacts` int(1) DEFAULT NULL,
  PRIMARY KEY (`transmission_profile_log_pk`),
  KEY `individual_transmission_profile_idx_idx` (`individual_fk`),
  CONSTRAINT `individual_transmission_profile_idx` FOREIGN KEY (`individual_fk`) REFERENCES `individual` (`individual_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transmission_profile_log`
--
-- ORDER BY:  `transmission_profile_log_pk`

LOCK TABLES `transmission_profile_log` WRITE;
/*!40000 ALTER TABLE `transmission_profile_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `transmission_profile_log` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-03-30 18:30:29
