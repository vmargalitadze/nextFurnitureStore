"use client"
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function CredentialsForm({ callbackUrl }: { callbackUrl: string }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("auth.signIn");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: callbackUrl || "/",
    });

    setLoading(false);

    if (result?.error) {
      setError(result.error === "CredentialsSignin" ? t("invalidCredentials") : result.error);
    } else if (result?.ok && result.url) {
      router.push(result.url);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div>
          <Label className="text-xl font-bold" htmlFor="email">{t("email")}</Label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            required 
            autoComplete="email" 
            placeholder={t("emailPlaceholder")}
          />
        </div>
        <div>
          <Label className="text-xl font-bold" htmlFor="password">{t("password")}</Label>
          <PasswordInput 
            id="password" 
            name="password" 
            required 
            autoComplete="current-password" 
            placeholder={t("passwordPlaceholder")}
          />
          <div className="text-right mt-2">
            <Link 
              href="/forgot-password" 
              className="text-xl font-bold "
            >
              {t("forgotPassword")}
            </Link>
          </div>
        </div>
        <div>
          <Button disabled={loading} className="w-full px-4 mb-10 py-2 text-[20px] font-bold text-white bg-[#438c71] rounded-lg hover:bg-[#3a7a5f] transition-colors" variant="default">
            {loading ? t("signingIn") : t("signInButton")}
          </Button>
        </div>
        {error && <div className="text-center text-destructive">{error}</div>}
        <div className="text-xl font-bold text-center ">
          {t("dontHaveAccount")}{" "}
          <Link href="/sign-up" target="_self" className="link font-bold">
            {t("signUp")}
          </Link>
        </div>
      </div>
    </form>
  );
}