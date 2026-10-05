# 🧁 Tienda de Emociones

Tienda online en castellano para una marca chica argentina. La idea es simple:
que se pueda comprar sin fricción, que el panel de administración sea usable por
alguien no técnico, y que el código no se te caiga a pedazos cuando agregues
productos, categorías o un nuevo medio de pago.

Stack: **Next.js 15 (App Router) + TypeScript + Tailwind CSS 4 + componentes
accesibles estilo shadcn/ui + Framer Motion + Payload CMS 3 sobre PostgreSQL**.

Un detalle de arquitectura que conviene entender desde el arranque: **la tienda
y el panel de Payload viven en grupos de rutas con layouts raíz independientes**.
¿Por qué? Porque cada uno necesita controlar su propio `<html>`, su `<head>` y
sus estilos. Si los mezclás, tarde o temprano se te rompe algo del admin o de la
tienda. Así que están separados a propósito.

---

## 🧩 Qué incluye (y qué no)

Lo que ya está resuelto:

- **Portada adaptable a móviles**, catálogo, categorías, búsqueda, orden por
  precio y página individual por producto.
- **Carrito en el navegador** (no requiere cuenta) y cierre de compra por
  **WhatsApp, Mercado Pago o Stripe**.
- **Panel de Payload en `/admin`**, todo en español, para cargar productos,
  imágenes y ver pedidos.
- **Opiniones de clientes** en la portada, con moderación previa desde el panel.
- **Webhooks firmados** de Stripe y Mercado Pago. El pedido se marca como pagado
  recién cuando el proveedor confirma —y nosotros validamos también el importe
  y la moneda—.
- **Búsqueda instantánea con Typesense** (opcional; si no está configurado, cae
  a búsqueda sobre el catálogo que ya tenés en memoria).
- **Auth.js con Google** (opcional).
- **Vercel Analytics** en producción.

Lo que **no** está resuelto todavía y hay que hacer antes de abrir al público:

- Reemplazar el catálogo de demo por productos reales.
- Cargar precios y stock reales.
- Configurar el WhatsApp de la tienda.
- Publicar las políticas legales (privacidad, cambios, devoluciones, envíos).
- Conectar PostgreSQL y completar credenciales de pago.

⚠️ **Ojo con esto**: sin base de datos, el catálogo que ves es de mentira. En
producción, si falta `DATABASE_URL`, la app **falla a propósito** en vez de
mostrar datos falsos. Es preferible que se caiga y lo notes, a que un cliente
intente comprar algo que no existe.

---

## 🚀 Arrancar el proyecto (primera vez)

Requisitos:

- **Node.js 20.9 o superior**.
- Una base **PostgreSQL** (Neon o Supabase son las opciones más cómodas).
- **npm** (viene con Node).

### Paso a paso

1. Copiá el `.env.example` a `.env.local` y completá:

   - `DATABASE_URL` → cadena de conexión a PostgreSQL.
   - `PAYLOAD_SECRET` → un string largo y random. Si no sabés de dónde sacarlo,
     abajo te dejo un comando.
   - `NEXT_PUBLIC_SITE_URL` → para desarrollo, `http://localhost:3000`.

2. Instalá dependencias y levantá el server:

   ```powershell
   npm install
   npm run dev
Abrí http://localhost:3000/admin y creá el primer usuario
administrador. Guardá esas credenciales, son las que vas a usar para
entrar al panel.

Cargá productos desde el panel. Para que un producto aparezca en la tienda,
tiene que tener foto + precio + categoría + estado "Publicado". Si le
falta alguno de esos cuatro, no se muestra. Es a propósito: evita productos
a medio cargar en la vidriera.

Migraciones (importante)
En desarrollo, Payload sincroniza el esquema de PostgreSQL automáticamente
(modo push). Esto está buenísimo para iterar rápido, pero es peligroso si lo
mezclás con migraciones en la misma base. No lo hagas.

Cuando el esquema esté listo para producción, generá y aplicá una migración
contra la base de destino:

powershell
npm run payload:migration:create
npm run payload:migrate
Reglas de oro con las migraciones:

Cada vez que cambiás una colección, creá una migración nueva.

Revisá el SQL generado antes de aplicarlo. Payload hace magia, pero no
adivina.

Guardá los archivos de migración en el repo. Son parte del proyecto.

No corras migraciones contra una base que ya está en modo push. Se
pisan y vas a tener un dolor de cabeza enorme.

🔐 Variables de entorno
Todo lo que sea secreto va en .env.local (local) o en el panel de Vercel
(producción). Regla básica:

❌ Nunca pongas claves secretas en variables NEXT_PUBLIC_*. Todo lo que
empieza con NEXT_PUBLIC_ se manda al navegador.

❌ Nunca subas .env.local al repo.

PostgreSQL / Payload
Variable	Qué es	Dónde se usa
DATABASE_URL	Conexión a PostgreSQL. En Neon/Supabase usá la cadena con SSL y, para Vercel, la conexión pooled.	CMS + pedidos
PAYLOAD_SECRET	String largo, random, privado.	CMS
BLOB_READ_WRITE_TOKEN	Token de Blob Storage de Vercel. Necesario para que las imágenes que subís desde Payload persistan cuando deployás. En local es opcional.	Imágenes
Para generar un secreto decente:

powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
Pagos
Stripe:

STRIPE_SECRET_KEY

STRIPE_WEBHOOK_SECRET

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

Registrá como endpoint de webhook: https://tu-dominio/api/webhooks/stripe.
Habilitá los eventos checkout.session.completed y
checkout.session.async_payment_succeeded.

Mercado Pago:

MERCADOPAGO_ACCESS_TOKEN

MERCADOPAGO_WEBHOOK_SECRET

Registrá como URL de notificaciones: https://tu-dominio/api/webhooks/mercadopago.
El secreto de firma se configura desde el panel de Mercado Pago.

WhatsApp:

NEXT_PUBLIC_WHATSAPP_NUMBER → número de la tienda, solo dígitos, con
código de país. Ejemplo: 549....

Cómo se comportan los pedidos: quedan pendientes al inicio, y se marcan
como pagados solo cuando el webhook validado del proveedor confirma el pago
y nosotros validamos también el importe y la moneda. Si el importe no
coincide, no se marca como pagado. Es una defensa básica contra webhooks
adulterados.

💡 Antes de cobrar de verdad, hacé pagos de prueba en los entornos
sandbox de Stripe y Mercado Pago. Es mil veces mejor perder 20 minutos ahí que
recibir un reclamo de un cliente porque el pedido no se registró.

Auth.js (login con Google)
Opcional. Si querés habilitar el login con Google:

AUTH_SECRET

AUTH_GOOGLE_ID

AUTH_GOOGLE_SECRET

En Google Cloud, registrá el callback:
https://tu-dominio/api/auth/callback/google.

La pantalla de login es /ingresar.

Typesense (búsqueda instantánea)
Opcional. Si no lo configurás, la búsqueda funciona igual, pero busca sobre el
catálogo en memoria (más lento y menos preciso).

Variables del servidor:

TYPESENSE_HOST

TYPESENSE_PORT

TYPESENSE_PROTOCOL

TYPESENSE_API_KEY

Creá una colección llamada products con campos de texto:
name, description, category, status. Usá id como identificador del
documento.

Tip de seguridad: restringí el API key de Typesense a lo mínimo necesario
para buscar, crear, actualizar y borrar documentos de products. Nada más.

Cuando publiques, edites o borres un producto desde Payload, se sincroniza
automáticamente con la colección de Typesense.

✅ Verificar antes de publicar
powershell
npm run lint
npm run build
Ambos tienen que pasar sin warnings antes de subir a producción.

En Vercel:

Importá el proyecto.

Configurá todas las variables de entorno en cada entorno (Preview y
Production por separado).

Aplicá las migraciones de Payload a la base de producción ANTES de
habilitar /admin o los pagos. Si habilitás pagos sin migrar, vas a tener
pedidos que no se guardan bien.

Verificá que NEXT_PUBLIC_SITE_URL coincida con el dominio real de
producción. Si no coincide, los webhooks y los links de pago van a fallar.

Vercel Analytics se activa automáticamente al deployar.

Checklist antes de abrir al público
□ Fotos y textos reales cargados (no los de demo).
□ WhatsApp configurado y funcionando.
□ Precios y stock reales.
□ Políticas publicadas: privacidad, cambios, devoluciones, envíos.
□ Pago de prueba ejecutado de punta a punta (Stripe y/o Mercado Pago).
□ Un pedido de prueba llegó bien a /admin.
□ El webhook está validando firma correctamente.
💬 Opiniones de clientes
El formulario público de la portada guarda las opiniones con estado
Pendiente de revisión. No pide ni publica email. La persona que opina tiene
que autorizar explícitamente que se muestre su nombre y su opinión.

Protecciones básicas que ya vienen implementadas:

Honeypot (campo invisible que los bots rellenan, los humanos no).

Límites de longitud.

Validación del lado del servidor.

Esto no es infalible, pero reduce mucho el spam automatizado.

Cómo moderar
Entrá a /admin → Opiniones de clientes.

Leé el texto. Si tiene info privada (teléfonos, direcciones, etc.), no la
publiques.

Para publicarla: cambiá Estado de publicación a Publicada.

Para ocultarla sin borrarla: elegí Archivada. Se guarda pero no se
muestra.

El acceso público solo permite leer opiniones publicadas. La creación se
hace únicamente a través del endpoint validado /api/feedback.

Sobre el esquema
Cuando cambiás colecciones, en desarrollo Payload sincroniza el esquema de
PostgreSQL. Antes de producción, generá y revisá la migración siguiendo los
pasos de la sección de migraciones. Verificá específicamente que la tabla de
opiniones esté incluida antes de deployar. Es un paso que se olvida y
después no aparecen las opiniones.

🧠 Notas sueltas (de las que duelen si no las sabés)
No mezcles push (sync automático) con migraciones en la misma base.
Elegí uno y quedate con ese. En desarrollo: push. En producción: migraciones.

DATABASE_URL en Vercel: usá la pooled connection. Las conexiones
directas se te agotan con poco tráfico.

Los secretos no se versionan. Nunca. Ni en capturas de pantalla, ni en
issues, ni en chats. Si se filtró uno, rotalo.

Probá los webhooks con stripe listen --forward-to antes de subir. Te
ahorra horas de debug.

El build tiene que pasar limpio. Si hay warnings de TypeScript en el
build, arreglalos antes de subir. Los warnings de hoy son los bugs de
mañana.

Cualquier duda, abrí un issue o preguntá