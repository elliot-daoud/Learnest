# HecLearn

Plateforme de révision gratuite pour la 1re année HEC Lausanne. Next.js (App Router) + Supabase + Tailwind.

## Mise en route

1. Installer Node 20+ puis `npm install`.
2. Créer un projet Supabase (région Europe), exécuter `supabase/schema.sql` dans le SQL Editor.
3. Supabase > Authentication :
   - URL Configuration : Site URL = `https://heclearn.ch`, Redirect URLs = `https://heclearn.ch/auth/callback` et `http://localhost:3000/auth/callback`.
   - **Configurer un SMTP personnalisé** (Resend, Brevo…) : le SMTP par défaut de Supabase est limité à quelques e-mails par heure.
   - Connexion **par code** (pas de lien). Modèle d'e-mail « Magic link » : coller `supabase/email-template.html` (il ne contient que `{{ .Token }}`). Supabase n'autorise la modification des modèles qu'avec un SMTP personnalisé.
   - Authentication > Providers > Email : activer « Confirm email » et laisser la longueur du code par défaut (8 chiffres).
4. Copier `.env.example` en `.env.local` et remplir les valeurs.
5. `npm run dev`, puis http://localhost:3000.

## Ajouter du contenu

Ajouter un dossier `content/<matiere>/NN-nom-du-chapitre/` avec `fiche.md` et `qcm.json` (voir `content/statistique/01-intro`). Pas de code à modifier.
Passer `statut: publie` (fiche et questions) quand le contenu est prêt à être mis en ligne.

- `npm run validate` vérifie tous les fichiers ; il tourne aussi automatiquement avant `npm run build`.
- En production, tout ce qui est `brouillon` est ignoré. En local (`npm run dev`), les brouillons restent visibles pour la relecture.
- Pour ouvrir une matière : `"statut": "disponible"` dans son `meta.json`.

## Accès et sécurité

- Domaine vérifié à trois endroits : formulaire (serveur), callback de connexion, et trigger SQL sur `auth.users` (bloque même un appel direct à l'API Supabase). Liste à étendre dans `lib/domains.ts` **et** dans la table `allowed_email_domains`.
- Les fiches/QCM sont des fichiers du dépôt, servis uniquement par des pages qui exigent une session (middleware + `requireUser()`). RLS protège les tables de données.
- `/admin` : réservé à `ADMIN_EMAIL`. Utilise la clé `SUPABASE_SERVICE_ROLE_KEY`, qui ne doit jamais être exposée au navigateur.

## Déploiement

Vercel : importer le dépôt, définir les variables d'environnement de `.env.example`, ajouter le domaine `heclearn.ch`.

## À compléter avant la mise en ligne

- `lib/site.ts` : présentation du fondateur et adresse de contact.
- Faire relire `app/confidentialite/page.tsx` (nLPD).
