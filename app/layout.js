import "./globals.css";

export const metadata = {
  title: "Tech Interview Quiz",
  description: "Révise Java, Spring Boot, Kafka, Redis, Kubernetes, CI/CD et IA pour tes entretiens techniques.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
