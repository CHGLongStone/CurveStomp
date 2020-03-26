SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

ALTER TABLE `CurveStomp`.`symptom_log` 
CHANGE COLUMN `fever` `fever` FLOAT(3,1) NOT NULL DEFAULT 37.0 ;

CREATE TABLE IF NOT EXISTS `CurveStomp`.`testing_log` (
  `testing_log_pk` INT(11) NOT NULL AUTO_INCREMENT,
  `individual_fk` INT(11) NULL DEFAULT NULL,
  `test_result` INT(1) NULL DEFAULT NULL,
  `recovered` INT(1) NULL DEFAULT NULL,
  `hospitalized` INT(1) NULL DEFAULT NULL,
  `ventilation` INT(1) NULL DEFAULT NULL,
  `oxygen` INT(1) NULL DEFAULT NULL,
  PRIMARY KEY (`testing_log_pk`),
  INDEX `individual_test_idx_idx` (`individual_fk` ASC),
  CONSTRAINT `individual_test_idx`
    FOREIGN KEY (`individual_fk`)
    REFERENCES `CurveStomp`.`individual` (`individual_pk`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `CurveStomp`.`transmission_profile_log` (
  `transmission_profile_log_pk` INT(11) NOT NULL AUTO_INCREMENT,
  `individual_fk` INT(11) NULL DEFAULT NULL,
  `isolation` INT(1) NULL DEFAULT NULL,
  `travel_amount` INT(1) NULL DEFAULT NULL,
  `travel_distance` INT(2) NULL DEFAULT NULL,
  `surface_touch` INT(1) NULL DEFAULT NULL,
  `number_of_regular_contacts` INT(1) NULL DEFAULT NULL,
  PRIMARY KEY (`transmission_profile_log_pk`),
  INDEX `individual_transmission_profile_idx_idx` (`individual_fk` ASC),
  CONSTRAINT `individual_transmission_profile_idx`
    FOREIGN KEY (`individual_fk`)
    REFERENCES `CurveStomp`.`individual` (`individual_pk`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;



ALTER TABLE `CurveStomp`.`household` 
ADD COLUMN `language_code_fk` INT(11) NULL DEFAULT NULL AFTER `household_guid`,
ADD INDEX `household_lang_fk_idx` (`language_code_fk` ASC);
;

CREATE TABLE IF NOT EXISTS `CurveStomp`.`iso_lang` (
  `iso_lang_pk` INT(11) NOT NULL AUTO_INCREMENT,
  `iso_2` VARCHAR(2) NULL DEFAULT NULL,
  `iso_5` VARCHAR(5) NULL DEFAULT NULL,
  PRIMARY KEY (`iso_lang_pk`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

ALTER TABLE `CurveStomp`.`household` 
ADD CONSTRAINT `household_lang_fk`
  FOREIGN KEY (`language_code_fk`)
  REFERENCES `CurveStomp`.`iso_lang` (`iso_lang_pk`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;



SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;