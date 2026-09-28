import { signIn } from "../../../../auth";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  const googleEnabled = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);

  return (
    <main className="signin-page section-wrap">
      <span className="eyebrow"><span className="eyebrow-line" /> TU CUENTA</span>
      <h1>Hola de nuevo.</h1>
      <p>Iniciá sesión con Google para acceder a tu cuenta.</p>
      {googleEnabled ? (
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/" });
          }}
        >
          <Button type="submit">Continuar con Google</Button>
        </form>
      ) : (
        <p className="setup-notice">
          El acceso con Google todavía no está configurado. Agregá AUTH_GOOGLE_ID,
          AUTH_GOOGLE_SECRET y AUTH_SECRET en el archivo de entorno para habilitarlo.
        </p>
      )}
    </main>
  );
}
