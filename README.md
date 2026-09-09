# Tech Interview Quiz

Application de révision pour entretiens techniques (Java, Spring Boot, Kafka, Redis,
Kubernetes, GitHub Actions / CI-CD, IA/GenAI, Architecture & scénarios terrain).

## Stack

- Next.js 14 (App Router)
- Données statiques (`data/questions.json`) — facile à enrichir sans backend
- Déploiement Vercel (Hobby plan, gratuit)

## Lancer en local

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:3000

## Ajouter des questions

Éditer `data/questions.json`. Chaque entrée suit ce format :

```json
{
  "category": "Kafka",
  "difficulty": "medior",
  "question": "...",
  "answer": "...",
  "tags": ["consumer-group"]
}
```

Catégories actuelles : Java, Spring Boot, Kafka, Redis, Kubernetes, CI/CD,
IA / GenAI, Architecture, Scénarios terrain.

## Fonctionnalités

- Filtrage par catégorie et par niveau (junior / medior / senior)
- Ordre aléatoire des questions à chaque changement de filtre
- Révèle la réponse à la demande, marquage "su" / "à revoir"
- Score de session + historique des questions ratées stocké en `localStorage`
