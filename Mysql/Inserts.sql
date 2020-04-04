
USE supermercado;

insert into categoria_producto 
(Nombre)
values
('Abarrotes'), 
('Bebes'),
('Bebidas'),
('Bebidas alcoholicas'),
('Caldos y Condimentos'),
('Carnes'),
('Cuidado personal'), -- 7
('Cuidado de la ropa'), -- 8
('Deli'), -- 9
('Desechables'), -- 10
('Frutas y Vegetales'), -- 11
('Graneria'), -- 12
('Lacteos y Huevos'), -- 13
('Limpieza del hogar'),
('Panaderia y Reposteria'),
('Pescados y Mariscos'),
('Picaderas dulces'),
('Picaderas saladas'),
('Miscelaneos');


select * from categoria_producto;

insert into Producto
values
-- Categoria Abarrotes ('1')
('00000000001',1,'Aceite Crisol Puro De Soya 3.78 L (128oz)',400.00,null,10,'2020-12-30','https://www.superwaoo.com/153-medium_default/aceite-crisol-puro-de-soya-378-l.jpg'),
('00000000002',1,'Aceite de oliva extra virgen goya 250 ml',65.00,null,10,2020-12-30,'https://www.superwaoo.com/1107-home_default/aceite-de-oliva-extra-virgen-goya-250-ml.jpg'),
('00000000003',1,'Sazón Criollo Sin Pimienta Baldom 357gr',53.00,null,10,'2020-12-30','https://www.superwaoo.com/626-medium_default/sazon-criollo-sin-pimienta-baldom-357-g.jpg'),
('',1,'',.00,null,10,'2020-12-30',''),
('',1,'',.00,null,10,'2020-12-30',''),
('',1,'',.00,null,10,'2020-12-30',''),
('',1,'',.00,null,10,'2020-12-30',''),
('',1,'',.00,null,10,'2020-12-30',''),
('',1,'',.00,null,10,'2020-12-30',''),
('',1,'',.00,null,10,'2020-12-30',''),
('',1,'',.00,null,10,'2020-12-30',''),
('',1,'',.00,null,10,'2020-12-30',''),
('',1,'',.00,null,10,'2020-12-30',''),

idproducto, idcategoria, nombreproducto, precio, oferta, cantidad, expiracion, urlImagen
('',1,'',.00,null,10,'2020-12-30','');













