# FRAGMENTE — Ecommerce de Perfumes

**Alumno:** Martín Israel  
**Materia:** Programación III  
**Trabajo Práctico:** N° 4

---

## Entrega

- **Repositorio GitHub:** https://github.com/MartinIsrael05/TP-4-Ecommerce
- **Deploy en Vercel:** https://tp-4-ecommerce.vercel.app/
- **Stack:** Next.js 16 · MongoDB · Mongoose · TailwindCSS 4

---

## Cómo ejecutar el proyecto localmente

**1. Clonar el repositorio**

```bash
git clone https://github.com/MartinIsrael05/TP-4-Ecommerce.git
cd TP-4-Ecommerce
```

**2. Instalar dependencias**

```bash
npm install
```

**3. Configurar variables de entorno**

Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
MONGODB_URI=mongodb+srv://martoo:marto123@cluster0.xaca78f.mongodb.net/Ecommerce
```

**4. Ejecutar en desarrollo**

```bash
npm run dev
```

**5. Abrir en el navegador**

```
http://localhost:3000
```

---

## Datos de prueba

La base de datos ya contiene datos de prueba: productos con imágenes, categorías, opciones de customización y órdenes generadas.

### Usuarios de prueba


Admin: admin@fragmente.com contraseña: admin123
Usuario: martinisrael2005@gmail.com contraseña: marto123

El usuario **admin** tiene acceso al Dashboard. El usuario regular puede navegar, comprar y gestionar favoritos.

---

## Funcionalidades implementadas

**Obligatorias**
- Catálogo público con filtros por precio y búsqueda dinámica
- Detalle de producto con opciones de customización, selector de cantidad, favoritos y productos relacionados
- Carrito de compras persistido en Context API
- Favoritos sincronizados con MongoDB al iniciar sesión
- Checkout con formulario de contacto, creación de orden y número secuencial
- Panel de usuario con historial de órdenes y detalle de cada una
- Dashboard administrativo: resumen de métricas, gestión de productos, categorías y órdenes
- Cambio de estado de órdenes (Active / Shipped / Closed / Canceled)

**Opcionales implementados**
1. SEO con `generateMetadata` y Open Graph en todas las páginas
2. Buscador de productos dinámico con resultados en tiempo real
3. Filtros por precio mínimo/máximo con ordenamiento
