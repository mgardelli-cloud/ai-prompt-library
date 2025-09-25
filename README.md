# 🤖 AI Prompt Library

Una libreria moderna e intuitiva per salvare, categorizzare e cercare i tuoi prompt AI preferiti. Costruita con Next.js, Supabase e Tailwind CSS.

![AI Prompt Library](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Funzionalità

- **📚 Libreria Prompt**: Salva e organizza i tuoi prompt AI in un'interfaccia pulita e moderna
- **🔍 Ricerca Avanzata**: Cerca prompt per titolo, contenuto, categoria o tag
- **🏷️ Sistema di Tag**: Organizza i prompt con tag personalizzabili
- **📋 Copia Rapida**: Copia i prompt negli appunti con un solo click
- **🌓 Tema Scuro/Chiaro**: Interfaccia adattiva con supporto per tema scuro e chiaro
- **📱 Design Responsive**: Ottimizzato per desktop, tablet e mobile
- **⚡ Performance**: Caricamento veloce con Next.js 14 e caching intelligente
- **🔒 Sicurezza**: Row Level Security con Supabase per proteggere i dati

## 🛠️ Tecnologie Utilizzate

- **Frontend**: Next.js 14, React 19, TypeScript
- **Styling**: Tailwind CSS 4, shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Autenticazione**: Supabase Auth
- **Deployment**: Vercel
- **Icons**: Lucide React
- **Form Handling**: React Hook Form + Zod

## 📦 Installazione

### Prerequisiti

- Node.js 18+ 
- npm o pnpm
- Account Supabase
- Account Vercel (per il deploy)

### Setup Locale

1. **Clona il repository**
   \`\`\`bash
   git clone https://github.com/tuo-username/ai-prompt-library.git
   cd ai-prompt-library
   \`\`\`

2. **Installa le dipendenze**
   \`\`\`bash
   npm install
   # oppure
   pnpm install
   \`\`\`

3. **Configura le variabili d'ambiente**
   
   Crea un file `.env.local` nella root del progetto:
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   \`\`\`

4. **Setup del Database**
   
   Esegui gli script SQL in Supabase nell'ordine:
   - `scripts/001_create_prompts_schema.sql`
   - `scripts/002_seed_sample_prompts.sql`
   - `scripts/003_create_rpc_function.sql`

5. **Avvia il server di sviluppo**
   \`\`\`bash
   npm run dev
   # oppure
   pnpm dev
   \`\`\`

6. **Apri il browser**
   
   Vai su [http://localhost:3000](http://localhost:3000)

## 🗄️ Struttura del Database

### Tabella `prompts`

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| `id` | UUID | Identificatore univoco |
| `title` | VARCHAR(255) | Titolo del prompt |
| `content` | TEXT | Contenuto del prompt |
| `description` | TEXT | Descrizione opzionale |
| `category` | VARCHAR(100) | Categoria del prompt |
| `tags` | TEXT[] | Array di tag |
| `user_id` | UUID | ID dell'utente (FK) |
| `created_at` | TIMESTAMP | Data di creazione |
| `updated_at` | TIMESTAMP | Data di aggiornamento |
| `usage_count` | INTEGER | Contatore utilizzi |

## 🏗️ Struttura del Progetto

\`\`\`
ai-prompt-library/
├── app/                    # App Router di Next.js
│   ├── globals.css        # Stili globali e temi
│   ├── layout.tsx         # Layout principale
│   └── page.tsx           # Homepage
├── components/            # Componenti React
│   ├── ui/               # Componenti UI di shadcn
│   ├── header.tsx        # Header dell'app
│   ├── prompt-gallery.tsx # Galleria dei prompt
│   ├── search-filters.tsx # Filtri di ricerca
│   ├── theme-toggle.tsx  # Toggle tema scuro/chiaro
│   └── ...
├── lib/                  # Utilities e configurazioni
│   ├── supabase/        # Client Supabase
│   ├── utils.ts         # Utility functions
│   └── copy-utils.ts    # Utilities per copia
├── scripts/             # Script SQL per il database
└── public/              # Asset statici
\`\`\`

## 🎨 Personalizzazione

### Temi

L'app supporta temi personalizzabili tramite CSS custom properties in `app/globals.css`:

\`\`\`css
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --primary: 240 5.9% 10%;
  /* ... altri colori */
}

.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --primary: 0 0% 98%;
  /* ... altri colori */
}
\`\`\`

### Categorie

Modifica le categorie disponibili in `components/search-filters.tsx`:

\`\`\`typescript
const categories = [
  "Writing",
  "Coding", 
  "Marketing",
  "Design",
  "Business",
  // Aggiungi le tue categorie
];
\`\`\`

## 🚀 Deploy

### Deploy su Vercel

1. **Push su GitHub**
   \`\`\`bash
   git add .
   git commit -m "Ready for deploy"
   git push origin main
   \`\`\`

2. **Connetti a Vercel**
   - Vai su [vercel.com](https://vercel.com)
   - Importa il repository GitHub
   - Configura le variabili d'ambiente
   - Deploy!

3. **Configura Supabase**
   - Aggiungi l'URL di Vercel nelle "Redirect URLs" di Supabase
   - Aggiorna la "Site URL" con l'URL di produzione

### Deploy su Altre Piattaforme

L'app è compatibile con qualsiasi piattaforma che supporta Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contribuire

I contributi sono benvenuti! Per contribuire:

1. **Fork** il progetto
2. **Crea** un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** le tue modifiche (`git commit -m 'Add some AmazingFeature'`)
4. **Push** al branch (`git push origin feature/AmazingFeature`)
5. **Apri** una Pull Request

### Linee Guida per i Contributi

- Segui le convenzioni di codice esistenti
- Aggiungi test per le nuove funzionalità
- Aggiorna la documentazione se necessario
- Assicurati che il build passi

## 🐛 Segnalazione Bug

Hai trovato un bug? [Apri una issue](https://github.com/tuo-username/ai-prompt-library/issues) con:

- Descrizione dettagliata del problema
- Passi per riprodurre il bug
- Comportamento atteso vs comportamento attuale
- Screenshots se applicabili
- Informazioni sul browser/sistema operativo

## 📋 Roadmap

- [ ] Autenticazione utenti multipli
- [ ] Condivisione prompt pubblici/privati
- [ ] Esportazione in vari formati (JSON, CSV, MD)
- [ ] API REST per integrazioni esterne
- [ ] Versioning dei prompt
- [ ] Collaborazione in tempo reale
- [ ] Plugin per editor di codice
- [ ] App mobile (React Native)

## 📄 Licenza

Questo progetto è rilasciato sotto la licenza MIT. Vedi il file [LICENSE](LICENSE) per i dettagli.

## 🙏 Ringraziamenti

- [Next.js](https://nextjs.org/) per il framework
- [Supabase](https://supabase.com/) per il backend
- [shadcn/ui](https://ui.shadcn.com/) per i componenti UI
- [Tailwind CSS](https://tailwindcss.com/) per lo styling
- [Lucide](https://lucide.dev/) per le icone
- [Vercel](https://vercel.com/) per l'hosting

## 📞 Supporto

- 📧 Email: [tuo-email@example.com](mailto:tuo-email@example.com)
- 🐦 Twitter: [@tuo-twitter](https://twitter.com/tuo-twitter)
- 💬 Discord: [Server Discord](https://discord.gg/tuo-server)

---

<div align="center">
  <p>Realizzato con ❤️ da <a href="https://github.com/tuo-username">Il Tuo Nome</a></p>
  <p>Se questo progetto ti è stato utile, considera di dargli una ⭐!</p>
</div>
