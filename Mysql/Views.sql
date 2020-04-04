-- 10
CREATE VIEW `View_TopProducto` AS
	select pr.ID_producto, pr.Nombre, pr.Precio, sum(pa.Cantidad) as Cantidad
	from Producto as pr
	join Pedido_articulos as pa
		on pr.ID_producto = pa.ID_producto
	group by pr.ID_producto
	order by Cantidad
    limit 10;

