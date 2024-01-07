# Solitude

A minimalist web-app for focused writing and note-taking. Currently in early stages of development.

![Screenshot of software](.github/images/screenshot.png)

## Features

### Currently implemented
- Rich (but constrained) text editing
    - Headings, bold, italics, lists, links, blockquotes etc.
    - Markdown shortcuts e.g. #Heading, \*\*emphasis\*\* are supported
    - @mention other pages to create dynamic links
- Autosaving with save status and 'last updated' indicators
- Offline-first design using browser's IndexedDB
- Optional syncing with a remote [Supabase](https://supabase.com/) instance
- Tree structure for page organisation, similar to Notion
- Search for pages from the sidebar
- Word count
- Attractive UI including light and dark mode
- Export a page as Markdown

### On the roadmap
- Intelligent conflict-handling while syncing
- Row-level security, authentication and user-scoped pages
- Embedded images
- Backups and revision control
- Workspaces or projects, letting you have multiple collections of pages

## Uses
- [Vite](https://vitejs.dev/) for React bundling
- [Tauri](https://tauri.app/) for offline client bundling
- [Tiptap](https://www.tiptap.dev/) as text editor backend
- [TailwindCSS](https://tailwindcss.com/) for styling
- [RxDB](https://github.com/pubkey/rxdb) for local offline database
- [Supabase](https://supabase.com/) for remote database

## Development

Install dependencies:

```bash
npm install
```

If you want to use the Supabase replication, set up a new Supabase project and run the following to create the replication table:

```sql
CREATE EXTENSION IF NOT EXISTS moddatetime
	SCHEMA "extensions";
CREATE TABLE public.pages (
    id text NOT NULL,
    title text NOT NULL,
    content text,
    index smallint,
    parent_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    _deleted boolean DEFAULT false NOT NULL,
    _modified timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE ONLY public.pages ADD CONSTRAINT pages_pkey PRIMARY KEY (id);

CREATE TRIGGER update_modified_datetime BEFORE UPDATE ON public.pages FOR EACH ROW
EXECUTE FUNCTION extensions.moddatetime('_modified');
```

Then, run the API server and frontend:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) with your browser to see the app.

You can set your Supabase API url and anon key in the settings page to enable syncing.

