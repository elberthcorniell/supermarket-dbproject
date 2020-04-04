use Supermercado;

CREATE TABLE Cliente (
	ID_cliente char(11) NOT NULL,
	Cedula char(13) NOT NULL,
	PRIMARY KEY (ID_cliente)
);

CREATE TABLE `Direccion` (
	`ID_direccion` char(13) NOT NULL,
	`Municipio` varchar(50) NOT NULL,
	`Sector` varchar(50) NOT NULL,
	`Barrio` varchar(50) NOT NULL,
	`Calle` varchar(50) NOT NULL,
	`N_residencia` varchar(10) NOT NULL,
	PRIMARY KEY (`ID_direccion`)
);

CREATE TABLE `Pedido` (
	`ID_pedido` int NOT NULL AUTO_INCREMENT,
	`ID_cliente` char(11) NOT NULL,
	`ID_mensajero` char(11) NOT NULL,
	`Activo` BOOLEAN NOT NULL,
	`Fecha_realizacion` DATETIME NOT NULL,
	`Fecha_estimada` DATETIME,
	`Impuestos` FLOAT DEFAULT '0.00',
	`Descuento` FLOAT DEFAULT '0.00',
	`Precio_envio` FLOAT DEFAULT '0.00',
	`Precio_total` FLOAT NOT NULL DEFAULT '0.00',
	PRIMARY KEY (`ID_pedido`,`ID_cliente`)
);

CREATE TABLE `Producto` (
	`ID_producto` char(11) NOT NULL,
	`ID_categoria` int NOT NULL,
	`Nombre` varchar(255) NOT NULL,
	`Precio` FLOAT NOT NULL DEFAULT '0.00',
	`Oferta` FLOAT DEFAULT '0.00',
	`Cantidad` int NOT NULL DEFAULT '1',
	`Estado` varchar(15) NOT NULL,
	`Fecha_expiracion` DATETIME,
	`Imagen` varchar(500),
	PRIMARY KEY (`ID_producto`)
);

CREATE TABLE `Retroalimentacion` (
	`ID_pedido` int NOT NULL,
	`Productos_recibidos` BOOLEAN NOT NULL,
	`Estado_productos` varchar(10),
	`Calidad_entrega` int,
	`Mensaje` varchar(255),
	PRIMARY KEY (`ID_pedido`)
);

CREATE TABLE `Mensajero` (
	`ID_mensajero` char(11) NOT NULL,
	`Cedula` char(13) NOT NULL,
	PRIMARY KEY (`ID_mensajero`)
);

CREATE TABLE `Persona` (
	`Cedula` char(13) NOT NULL,
	`ID_cuenta` int NOT NULL,
	`Nombre` varchar(255) NOT NULL,
	`Apellido` varchar(255) NOT NULL,
	`Sexo` varchar(10) NOT NULL,
	`Fecha_nacimiento` DATE NOT NULL,
	`Telefono` char(16) NOT NULL,
	`ID_direccion` char(13),
	PRIMARY KEY (`Cedula`)
);

CREATE TABLE `Pedido_articulos` (
	`ID_pedido` int NOT NULL,
	`ID_producto` char(50) NOT NULL,
	`Cantidad` int NOT NULL,
	PRIMARY KEY (`ID_pedido`,`ID_producto`)
);

CREATE TABLE `Categoria_producto` (
	`ID_categoria` int NOT NULL AUTO_INCREMENT,
	`Nombre` varchar(50) NOT NULL,
	`Descripcion` varchar(255),
	PRIMARY KEY (`ID_categoria`)
);

CREATE TABLE `Cuenta` (
	`ID_cuenta` int NOT NULL AUTO_INCREMENT,
	`Correo_electronico` varchar(100) NOT NULL UNIQUE,
	`Contraseña` varchar(50) NOT NULL,
	`Tipo` varchar(15) NOT NULL,
	PRIMARY KEY (`ID_cuenta`)
);

ALTER TABLE `Cliente` ADD CONSTRAINT `Cliente_fk0` FOREIGN KEY (`Cedula`) REFERENCES `Persona`(`Cedula`);

ALTER TABLE `Direccion` ADD CONSTRAINT `Direccion_fk0` FOREIGN KEY (`ID_direccion`) REFERENCES `Persona`(`Cedula`);

ALTER TABLE `Pedido` ADD CONSTRAINT `Pedido_fk0` FOREIGN KEY (`ID_cliente`) REFERENCES `Cliente`(`ID_cliente`);

ALTER TABLE `Pedido` ADD CONSTRAINT `Pedido_fk1` FOREIGN KEY (`ID_mensajero`) REFERENCES `Mensajero`(`ID_mensajero`);

ALTER TABLE `Producto` ADD CONSTRAINT `Producto_fk0` FOREIGN KEY (`ID_categoria`) REFERENCES `Categoria_producto`(`ID_categoria`);

ALTER TABLE `Retroalimentacion` ADD CONSTRAINT `Retroalimentacion_fk0` FOREIGN KEY (`ID_pedido`) REFERENCES `Pedido`(`ID_pedido`);

ALTER TABLE `Mensajero` ADD CONSTRAINT `Mensajero_fk0` FOREIGN KEY (`Cedula`) REFERENCES `Persona`(`Cedula`);

ALTER TABLE `Persona` ADD CONSTRAINT `Persona_fk0` FOREIGN KEY (`ID_cuenta`) REFERENCES `Cuenta`(`ID_cuenta`);

ALTER TABLE `Persona` ADD CONSTRAINT `Persona_fk1` FOREIGN KEY (`ID_direccion`) REFERENCES `Direccion`(`ID_direccion`);

ALTER TABLE `Pedido_articulos` ADD CONSTRAINT `Pedido_articulos_fk0` FOREIGN KEY (`ID_pedido`) REFERENCES `Pedido`(`ID_pedido`);

ALTER TABLE `Pedido_articulos` ADD CONSTRAINT `Pedido_articulos_fk1` FOREIGN KEY (`ID_producto`) REFERENCES `Producto`(`ID_producto`);

