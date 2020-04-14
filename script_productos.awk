# script utilizado para extraer los datos de los productos de la pagina de la sirena y ponerlo en forma de insert.

BEGIN{ FS=" & "
        # Variables para imprimir
        complemento_cod=1
        oferta=1.00
        estado="Disponible"
        mes=0
        dia=0
        anno=2020
        cantidad=0
        
        # Variables para # random
        min=0
        max_of=3
        max_cant=100
        max_mes=12
        max_dia=27
        max_por=5
        srand();

        switch(a){
            case 1:
                codigo="'ABAR-"
                categoria="1"
                break;
            case 2:
                codigo="'BEBE-"
                categoria="2"
                break;
            case 3:
                codigo="'BEBI-"
                categoria="3"
                break;
            case 4:
                codigo="'BEBA-"
                categoria="4"
                break;
            case 5:
                codigo="'CALD-"
                categoria="5"
                break;
            case 6:
                codigo="'CARN-"
                categoria="6"
                break;
            case 7:
                codigo="'CUIP-"
                categoria="7"
                break;
            case 8:
                codigo="'CUIR-"
                categoria="8"
                break;
            case 9:
                codigo="'DELI-"
                categoria="9"
                break;
            case 10:
                codigo="'DESE-"
                categoria="10"
                break;
            case 11:
                codigo="'FRUT-"
                categoria="11"
                break;
            case 12:
                codigo="'GRAN-"
                categoria="12"
                break;
            case 13:
                codigo="'LACT-"
                categoria="13"
                break;
            case 14:
                codigo="'LIMP-"
                categoria="14"
                break;
            case 15:
                codigo="'PANA-"
                categoria="15"
                break;
            case 16:
                codigo="'PESC-"
                categoria="16"
                break;
            case 17:
                codigo="'PICD-"
                categoria="17"
                break;
            case 18:
                codigo="'PICS-"
                categoria="18"
                break;
            case 19:
                codigo="'MISC-"
                categoria="19"
                break;
            default:
                codigo="'ABRA-"
                categoria="1"
                break;
        }

}
{
# Input
nombre = $1
precio = $2
url = $3

oferta=int(min+rand()*(max_of-min+1));
cantidad=int(min+rand()*(max_cant-min+1));
dia=int(1+rand()*(max_dia-1+1));
mes=int(5+rand()*(max_mes-5+1));
anno=int(2020+rand()*(2025-2020+1));

if (cantidad > 0)
        estado = "Disponible";
else estado = "No disponible";

if (oferta==1)
        oferta= int(precio) - int(precio) * int(1+rand()*(max_por-1+1))/10;
else oferta =0;

printf("(%s%06d', %s, '%s', %s, %0.2f, %d, '%s', '%d-%02d-%02d', '%s'),\n", codigo, complemento_cod++, categoria, nombre, precio, oferta, 
       cantidad, estado, anno, mes, dia, url)
}
END{}
