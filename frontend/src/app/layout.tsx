import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TalenToss - O Sistema Inteligente de Recrutamento",
  description: "A inteligência que conecta vagas aos talentos certos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">{children}</body>
    </html>
  );
}
