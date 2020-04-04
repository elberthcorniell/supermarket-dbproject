-- 3
CREATE PROCEDURE sp_ConsultaCompras(
	in ID_cliente)
BEGIN
	select year(pe.Fecha_realizacion) as Año, month(pe.Fecha_realizacion) as Mes, pr.Nombre
	from Pedido as pe
	join Pedido_articulos as pa
		on pe.ID_pedido = pa.ID_pedido
	join Producto as pr
		on pa.ID_producto = pr.ID_producto
	where pe.ID_cliente = @ID_cliente
	group by Año, Mes, pr.Nombre
	order by Año, Mes, pr.Nombre;
END


-- 8
CREATE PROCEDURE sp_EliminarProducto(
	in ID char(11))
BEGIN
	delete from Producto
    where ID_producto = ID
END


-- 7
CREATE PROCEDURE sp_AgregarProducto(
	in ID_producto char(11),
    in ID_categoria int,
    in Nombre varchar(255),
    in Precio float,
    in Oferta float,
    in Cantidad int,
    in Estado varchar(15),
    in Fecha_expiracion datetime,
    in Imagen varchar(500))
BEGIN
	insert into Producto
	values (ID_producto,ID_categoria,Nombre,Precio,Oferta,Cantidad,Estado,Fecha_expiracion,Imagen);
END


-- 6
CREATE PROCEDURE sp_ActualizarEstadoProducto(
	in ID char(11),
    in Estado_producto varchar(15))
BEGIN
	update Producto
    set Estado = Estado_producto
    where ID_producto = ID;
END

-- 5
CREATE PROCEDURE sp_TopMensajero(
	in fecha_incial datetime,
    in fecha_final datetime)
BEGIN
	select m.ID_mensajero, p.Cedula, p.Nombre, p.Apellido, p.telefono, count(pe.ID_mensajero) as Cantidad
	from Mensajero as m
	join Persona as p
		on m.Cedula = p.Cedula
	join Pedido as pe
		on m.ID_mensajero = pe.ID_mensajero
	where pe.Fecha_realizacion > fecha_incial
	and Fecha_realizacion < fecha_final
	group by pe.ID_mensajero
    order by Cantidad desc
    limit 1;
END









