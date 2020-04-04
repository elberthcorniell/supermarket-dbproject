use Supermercado;

-- Consulta general de ofertas del supermercado que estén válidas.

create view Ofertas
as
    select Producto.Nombre, Producto.Imagen, Producto.Precio, Producto.Oferta, Producto.Cantidad
    from Producto
    where Producto.Oferta > 0.00;

-- Consulta de productos indicado tipo y cantidad existente en inventario.

create view Productos
as
    select Producto.ID_producto, Categoria_producto.Nombre, Producto.Cantidad, Producto.Imagen
    from Producto left outer join Categoria_producto
    on Producto.ID_categoria = Categoria_producto.ID_categoria;

-- Consulta general de usuarios (clientes).

create view Clientes
as
    select Persona.Cedula, Persona.Nombre, Persona.Apellido, Persona.Sexo, Persona.Telefono, Cuenta.Correo_electronico
    from Persona left outer join Cuenta
    on Persona.ID_cuenta = Cuenta.ID_cuenta
    where Cuenta.Tipo = 'Cliente';