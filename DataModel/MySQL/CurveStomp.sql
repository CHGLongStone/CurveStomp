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
  `household_guid` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `household_postal_fk` int(11) NOT NULL,
  PRIMARY KEY (`household_pk`),
  KEY `household_postal_fk_idx` (`household_postal_fk`),
  CONSTRAINT `household_postal_fk` FOREIGN KEY (`household_postal_fk`) REFERENCES `regional_postal_code` (`regional_postal_code_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
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
  `household_fk` int(11) DEFAULT NULL,
  `individual_guid` varchar(36) DEFAULT NULL,
  `age` int(3) DEFAULT NULL,
  `email` varchar(60) DEFAULT NULL,
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
  `ISO_4217_Currency_Code` varchar(3) DEFAULT NULL,
  `ISO_4217_Currency_Name` varchar(255) DEFAULT NULL,
  `ITU-T_Telephone_Code` varchar(5) DEFAULT NULL,
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
-- Table structure for table `regional_postal_code`
--

DROP TABLE IF EXISTS `regional_postal_code`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `regional_postal_code` (
  `regional_postal_code_pk` int(11) NOT NULL AUTO_INCREMENT,
  `country_fk` int(11) NOT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`regional_postal_code_pk`),
  KEY `pc_country_idx_idx` (`country_fk`),
  KEY `postal_code_idx` (`postal_code`,`country_fk`),
  CONSTRAINT `pc_country_idx` FOREIGN KEY (`country_fk`) REFERENCES `iso_countries` (`PK`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `regional_postal_code`
--
-- ORDER BY:  `regional_postal_code_pk`

LOCK TABLES `regional_postal_code` WRITE;
/*!40000 ALTER TABLE `regional_postal_code` DISABLE KEYS */;
/*!40000 ALTER TABLE `regional_postal_code` ENABLE KEYS */;
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
  `resourcecol` varchar(45) DEFAULT NULL,
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
-- Table structure for table `symptom`
--

DROP TABLE IF EXISTS `symptom`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `symptom` (
  `symptom_pk` int(11) NOT NULL AUTO_INCREMENT,
  `symptom_name` varchar(45) DEFAULT NULL,
  `symptom_description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`symptom_pk`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `symptom`
--
-- ORDER BY:  `symptom_pk`

LOCK TABLES `symptom` WRITE;
/*!40000 ALTER TABLE `symptom` DISABLE KEYS */;
INSERT INTO `symptom` (`symptom_pk`, `symptom_name`, `symptom_description`) VALUES (1,'cough',NULL),(2,'fever',NULL),(3,'tiredness',NULL),(4,'difficulty breathing',NULL);
/*!40000 ALTER TABLE `symptom` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `symptom_log`
--

DROP TABLE IF EXISTS `symptom_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `symptom_log` (
  `symptom_log_pk` int(11) NOT NULL AUTO_INCREMENT,
  `symptom_fk` int(2) DEFAULT NULL,
  `severity` int(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`symptom_log_pk`),
  KEY `symptom_pk_idx_idx` (`symptom_fk`),
  CONSTRAINT `symptom_fk_idx` FOREIGN KEY (`symptom_fk`) REFERENCES `symptom` (`symptom_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-03-22 15:27:07
