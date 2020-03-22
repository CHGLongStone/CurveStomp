


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