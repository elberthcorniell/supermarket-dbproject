use Supermercado;

-- Insertando categoria de productos
insert into Supermercado.Categoria_producto
values
(null,'Abarrotes', null), -- 1
(null, 'Bebes', null), -- 2
(null, 'Bebidas', null), -- 3
(null, 'Bebidas alcoholicas', null), -- 4
(null,'Caldos y Condimentos', null), -- 5
(null, 'Carnes', null), -- 6
(null, 'Cuidado personal', null), -- 7
(null, 'Cuidado de la ropa', null), -- 8
(null, 'Deli', null), -- 9
(null, 'Desechables', null), -- 10
(null, 'Frutas y Vegetales', null), -- 11
(null, 'Graneria', null), -- 12
(null, 'Lacteos y Huevos', null), -- 13
(null, 'Limpieza del hogar', null), -- 14
(null, 'Panaderia y Reposteria', null), -- 15
(null, 'Pescados y Mariscos', null), -- 16
(null, 'Picaderas dulces', null), -- 17
(null, 'Picaderas saladas', null), -- 18
(null, 'Miscelaneos', null); -- 19

select * from Categoria_producto; -- select para comprobar

-- Insertando los productos de la categoria 01 ABARROTES
insert into Producto
values
-- Categoria Abarrotes ('1')
('00000000001',1,'Aceite Crisol Puro De Soya 3.78 L (128oz)',400.00,null,10,'2020-12-30','https://www.superwaoo.com/153-medium_default/aceite-crisol-puro-de-soya-378-l.jpg'),
('00000000002',1,'Aceite de oliva extra virgen goya 250 ml',65.00,null,10,2020-12-30,'https://www.superwaoo.com/1107-home_default/aceite-de-oliva-extra-virgen-goya-250-ml.jpg'),
('00000000003',1,'Sazón Criollo Sin Pimienta Baldom 357gr',53.00,null,10,'2020-12-30','https://www.superwaoo.com/626-medium_default/sazon-criollo-sin-pimienta-baldom-357-g.jpg'),
-- ('',1,'',.00,null,10,'2020-12-30',''),
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













