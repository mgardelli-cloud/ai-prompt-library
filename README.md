# AI Prompt Library

Una libreria moderna per organizzare, salvare e condividere prompt AI con un'interfaccia elegante e funzionalità avanzate di ricerca.

## ✨ Caratteristiche

- 🔍 **Ricerca Avanzata**: Filtra per categoria, tag, contenuto e descrizione
- 📱 **Design Responsive**: Interfaccia moderna e mobile-friendly
- 🌙 **Tema Scuro/Chiaro**: Supporto completo per entrambi i temi
- 📋 **Copia Facile**: Un clic per copiare i prompt negli appunti
- 🏷️ **Sistema di Tag**: Organizza i prompt con tag personalizzati
- 📊 **Statistiche d'Uso**: Traccia l'utilizzo dei prompt più popolari
- 🔒 **Privacy**: Gestione di prompt pubblici e privati

## 🚀 Tecnologie Utilizzate

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS v4, Radix UI
- **Database**: Supabase
- **Autenticazione**: Supabase Auth
- **Deployment**: Vercel

## 🛠️ Installazione

1. **Clona il repository:**
   ```bash
   git clone https://github.com/TUO_USERNAME/ai-prompt-library.git
   cd ai-prompt-library
   ```

2. **Installa le dipendenze:**
   ```bash
   npm install
   ```

3. **Configura le variabili d'ambiente:**
   - Copia `env.example` in `.env.local`
   - Aggiungi le tue credenziali Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Avvia il server di sviluppo:**
   ```bash
   npm run dev
   ```

5. **Apri [http://localhost:3000](http://localhost:3000) nel browser**

## 📦 Comandi Disponibili

- `npm run dev` - Avvia il server di sviluppo
- `npm run build` - Crea la build di produzione
- `npm run start` - Avvia il server di produzione
- `npm run lint` - Esegue il linting del codice

## 🗄️ Schema Database

Il progetto utilizza Supabase con la seguente tabella principale:

```sql
CREATE TABLE prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  usage_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT false
);
```

## 🤝 Contribuire

1. Fai un fork del progetto
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Committa le tue modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Pusha il branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📄 Licenza

Questo progetto è sotto licenza MIT. Vedi il file `LICENSE` per i dettagli.

## 🙏 Riconoscimenti

- [Radix UI](https://www.radix-ui.com/) per i componenti UI
- [Tailwind CSS](https://tailwindcss.com/) per lo styling
- [Supabase](https://supabase.com/) per il backend
- [Lucide React](https://lucide.dev/) per le icone
