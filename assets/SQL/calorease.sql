-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 06-05-2025 a las 20:06:26
-- Versión del servidor: 9.1.0
-- Versión de PHP: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `calorease`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comidas`
--

DROP TABLE IF EXISTS `comidas`;
CREATE TABLE IF NOT EXISTS `comidas` (
  `ID_Comida` int NOT NULL,
  `Nombre` varchar(50) DEFAULT NULL,
  `Calorias` int DEFAULT NULL,
  `Proteinas` decimal(5,2) DEFAULT NULL,
  `Carbohidratos` decimal(5,2) DEFAULT NULL,
  `Grasas` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`ID_Comida`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;




--
-- Estructura de tabla para la tabla `comidas_dieta`
--

DROP TABLE IF EXISTS `comidas_dieta`;
CREATE TABLE IF NOT EXISTS `comidas_dieta` (
  `ID_Comida` int NOT NULL,
  `ID_Dieta` int NOT NULL,
  `Fecha_Consumo` date NOT NULL,
  `Platos` int DEFAULT NULL,
  `Permitido` char(2) DEFAULT NULL,
  PRIMARY KEY (`ID_Comida`,`ID_Dieta`,`Fecha_Consumo`),
  KEY `ID_Dieta` (`ID_Dieta`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;





--
-- Estructura de tabla para la tabla `dietas`
--

DROP TABLE IF EXISTS `dietas`;
CREATE TABLE IF NOT EXISTS `dietas` (
  `ID_Dieta` int NOT NULL,
  `Nombre` varchar(50) DEFAULT NULL,
  `Descripcion` text,
  PRIMARY KEY (`ID_Dieta`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



--
-- Estructura de tabla para la tabla `dietas_usuario`
--

DROP TABLE IF EXISTS `dietas_usuario`;
CREATE TABLE IF NOT EXISTS `dietas_usuario` (
  `ID_Dieta` int NOT NULL,
  `ID_Usuario` int NOT NULL,
  `Nombre` varchar(50) DEFAULT NULL,
  `Descripcion` text,
  PRIMARY KEY (`ID_Dieta`,`ID_Usuario`),
  KEY `ID_Usuario` (`ID_Usuario`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


--
-- Estructura de tabla para la tabla `registrados`
--

DROP TABLE IF EXISTS `registrados`;
CREATE TABLE IF NOT EXISTS `registrados` (
  `id` int DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

DROP TABLE IF EXISTS `usuario`;
CREATE TABLE IF NOT EXISTS `usuario` (
  `ID_Usuario` int NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL,
  `usuario` varchar(30) NOT NULL,
  `contraseña` varchar(250) NOT NULL,
  `Peso` decimal(5,2) DEFAULT NULL,
  `Altura` decimal(5,2) DEFAULT NULL,
  `IMC` decimal(5,2) DEFAULT NULL,
  `Obj_KCAL` int DEFAULT NULL,
  `Obj_Fisico` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ID_Usuario`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
