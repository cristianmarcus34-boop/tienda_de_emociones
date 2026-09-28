# Tienda de Emociones

Tienda online en castellano para una pequeña marca argentina. Está construida
con Next.js 15 (App Router), TypeScript, Tailwind CSS 4, componentes accesibles
inspirados en shadcn/ui, Framer Motion y Payload CMS 3 sobre PostgreSQL.
La tienda y el panel de Payload viven en grupos de rutas con layouts raíz
independientes para que cada aplicación gestione su propio documento HTML.

## Qué incluye

- Portada adaptable a móviles, catálogo, categorías, búsqueda, orden por precio
  y página individual para cada producto.
- Carrito guardado en el navegador y cierre de compra por WhatsApp, Mercado Pago
  o Stripe. El servidor vuelve a comprobar el catálogo y los precios antes de
  crear una sesión de pago.
- Panel de Payload en español en `/admin` para administrar productos, imágenes y pedidos.
- Opiniones de clientes en la portada, con autorización y revisión previa desde `/admin`.
- Webhooks firmados de Stripe y Mercado Pago; el estado del pedido se actualiza
  cuando el proveedor confirma el pago.
- Acceso social con Google mediante Auth.js (opcional).
- Búsqueda instantánea mediante Typesense (opcional); si no se configura, se
  busca en el catálogo disponible.
- Vercel Analytics en producción.

El catálogo que aparece sin una base de datos es una demostración. Los nombres,
precios, fotos y textos de ejemplo tienen que sustituirse por los productos
reales desde el panel. No se habilitan pagos en línea hasta completar las
credenciales del proveedor y conectar PostgreSQL.

## Requisitos y primer inicio

- Node.js 20.9 o posterior.
- Una base PostgreSQL en Neon o Supabase para el CMS y los pedidos.
- npm (incluido con Node.js).

1. Copiar `.env.example` a `.env.local` y completar `DATABASE_URL`,
   `PAYLOAD_SECRET` y `NEXT_PUBLIC_SITE_URL`. Para desarrollo local, la URL
   pública es `http://localhost:3000`.
2. Instalar las dependencias y arrancar Next.js:

   ```powershell
   npm install
   npm run dev
   ```

3. Abrir `http://localhost:3000/admin` y crear el primer usuario administrador.
   En desarrollo, Payload mantiene el esquema de PostgreSQL sincronizado
   automáticamente; no mezclar esa sincronización automática con migraciones
   sobre la misma base.
4. Desde el panel, cargar fotos y productos. Para que un producto aparezca en la
   tienda, asignarle una foto, precio, categoría y estado **Publicado**.

Cuando el esquema esté listo para producción, generar y aplicar una migración
contra la base de destino:

   ```powershell
   npm run payload:migration:create
   npm run payload:migrate
   ```

Repetir la creación de migraciones después de cambiar el esquema de las
colecciones, revisar el SQL generado y guardar los archivos en el proyecto. No
ejecutar migraciones contra una base local que ya se mantiene con el modo `push`.

Cuando `DATABASE_URL` no está presente en desarrollo, se muestra un catálogo de
ejemplo para que la interfaz se pueda recorrer. En producción, la aplicación
falla explícitamente si no está configurada la base de datos.

## Variables de entorno

Las variables con nombres `STRIPE_*`, `MERCADOPAGO_*`, `AUTH_*` y `TYPESENSE_*`
solo se configuran en `.env.local` o en el panel de Vercel. No poner claves
secretas en variables `NEXT_PUBLIC_*`, ni subir `.env.local` al repositorio.

### PostgreSQL / Payload

- `DATABASE_URL`: conexión PostgreSQL; en Neon/Supabase usar la cadena SSL
  correspondiente y, para la aplicación en Vercel, preferir la conexión pooled.
- `PAYLOAD_SECRET`: secreto aleatorio largo y privado.
- `BLOB_READ_WRITE_TOKEN`: token de Blob Storage de Vercel. Es necesario para
  que las imágenes que se suban desde Payload persistan al publicar en Vercel;
  en desarrollo local es opcional.

Para generar secretos se puede usar:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Pagos

- Stripe: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` y
  `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`. Registrar
  `https://tu-dominio/api/webhooks/stripe` como endpoint de webhook y habilitar
  `checkout.session.completed` y
  `checkout.session.async_payment_succeeded`.
- Mercado Pago: `MERCADOPAGO_ACCESS_TOKEN` y `MERCADOPAGO_WEBHOOK_SECRET`.
  Registrar `https://tu-dominio/api/webhooks/mercadopago` como URL de
  notificaciones de pagos. Configurar el secreto de firma de notificaciones
  desde el panel de Mercado Pago.
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: número de WhatsApp de la tienda con código de
  país, solo dígitos (por ejemplo, el formato internacional `549...`).

Los pedidos quedan inicialmente pendientes y solo se marcan como pagados cuando
el webhook validado del proveedor confirma también el importe y la moneda.
Realizar primero pagos de prueba en los entornos de prueba de cada proveedor.

### Auth.js

Para habilitar acceso con Google, completar `AUTH_SECRET`, `AUTH_GOOGLE_ID` y
`AUTH_GOOGLE_SECRET`. En Google Cloud, registrar el callback
`https://tu-dominio/api/auth/callback/google`. La pantalla de acceso es
`/ingresar`.

### Typesense

Es opcional. Configurar `TYPESENSE_HOST`, `TYPESENSE_PORT`,
`TYPESENSE_PROTOCOL` y `TYPESENSE_API_KEY` en el servidor. Crear en Typesense
una colección llamada `products` con campos de texto `name`, `description`,
`category` y `status`; usar `id` como identificador del documento. Al publicar,
editar o borrar productos desde Payload, estos se sincronizan con esa colección.
El API key debe restringirse al acceso necesario para buscar, crear, actualizar
y borrar documentos de `products`.

## Verificación y publicación

```powershell
npm run lint
npm run build
```

En Vercel, importar el proyecto y configurar las variables de entorno para cada
entorno. Aplicar las migraciones de Payload a la base de producción antes de
habilitar `/admin` o los pagos. El dominio público de producción debe coincidir
con `NEXT_PUBLIC_SITE_URL`. Vercel Analytics se activa al publicar en Vercel.

Antes de abrir la tienda al público, reemplazar las fotos y textos de ejemplo,
configurar el WhatsApp, cargar precios y stock reales, y publicar las políticas
de privacidad, cambios, devoluciones y envíos que efectivamente aplicará el
emprendimiento.

## Opiniones de clientes

El formulario público de la portada guarda opiniones como **Pendiente de
revisión**. No solicita ni publica correo electrónico; la persona debe autorizar
explícitamente que se muestre su nombre y opinión. El honeypot y los límites de
longitud ayudan a reducir envíos automatizados.

Para revisar opiniones, entrar a `/admin` → **Opiniones de clientes**. Leer el
texto y confirmar que no incluya información privada; cambiar **Estado de
publicación** a **Publicada** para mostrarla. Elegir **Archivada** para ocultarla
sin borrarla. El acceso público solo permite leer las opiniones publicadas; la
creación se realiza a través del endpoint validado `/api/feedback`.

Al cambiar las colecciones, en desarrollo Payload sincroniza el esquema de
PostgreSQL. Antes de producción, generar y revisar la migración siguiendo los
pasos de PostgreSQL/Payload de arriba; comprobar que la nueva tabla de opiniones
está incluida antes de desplegar.
