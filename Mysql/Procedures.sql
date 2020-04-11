use Supermercado;
SET GLOBAL log_bin_trust_function_creators = 1;

-- Consulta de compra por año, mes, producto. (de los clientes)

CREATE PROCEDURE sp_ConsultaCompras(
ID_cliente char(11))
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
END;

-- Consulta del mensajero con más entregas realizadas en un rango de fecha.

CREATE PROCEDURE sp_TopMensajero(
fecha_incial datetime,
fecha_final datetime)
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
    order by Cantidad desc limit 1;
END;

-- Función que actualice el estado de un producto de disponible (D) a no disponible (N).

create function ActualizarEstadoProducto(
ID char(11),
Estado_producto varchar(15))
returns int
BEGIN
    declare resp int;
    set resp =0;
	update Producto
    set Estado = Estado_producto
    where ID_producto = ID;
    set resp =1;
    return(resp);
END;

-- Función que ingrese un producto a inventario.

create function AgregarProducto(
ID_producto char(11),
ID_categoria int,
Nombre varchar(255),
Precio float,
Oferta float,
Cantidad int,
Estado varchar(15),
Fecha_expiracion datetime,
Imagen varchar(500))
returns int
BEGIN
    declare resp int;
    set resp =0;
	insert into Producto
	values (ID_producto,ID_categoria,Nombre,Precio,Oferta,Cantidad,Estado,Fecha_expiracion,Imagen);
    set resp=1;
	return(resp);
END;

-- Función que elimine un producto de inventario.

create function EliminarProducto(
ID char(11))
returns int
BEGIN
    declare resp int;
    set resp=0;
	delete from Producto
    where ID_producto = ID;
    set resp =1;
    return(resp);
END;

-- Función que muestre los clientes que más compran.

create procedure sp_TopClientesCompras()
begin
    select Cliente.ID_cliente, Cliente.Cedula, count(Pedido.ID_pedido) `Numero de compras`
    from Pedido left join Cliente
    on Cliente.ID_cliente = Pedido.ID_cliente
    group by Cliente.ID_cliente
    order by `Numero de compras` DESC;
end;

-- Función que muestre los productos más vendidos.

create view view_TopProductos	 AS
    select pr.ID_producto, pr.Nombre, pr.Precio, sum(pa.Cantidad) as Cantidad
	from Producto as pr
	join Pedido_articulos as pa
	on pr.ID_producto = pa.ID_producto
	group by pr.ID_producto
	order by Cantidad DESC LIMIT 10
	