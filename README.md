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
- Offline support using browser's IndexedDB
- Tree structure for page organisation, similar to Notion
- Search for pages from the sidebar
- Word count
- Attractive UI including light and dark mode
- Export a page as Markdown

### In development
- Syncing local database with server
- Intelligent conflict-handling while syncing

### Potentially on the roadmap
- Authentication and user-scoped pages
- Embedded images
- Backups and revision control
- Workspaces or projects, letting you have multiple collections of pages

## Uses
- [Vite](https://vitejs.dev/) for React bundling
- [Tauri](https://tauri.app/) for offline client bundling
- [Typescript](https://www.typescriptlang.org/) for (almost) everything
- [Tiptap](https://www.tiptap.dev/) as text editor backend
- [TailwindCSS](https://tailwindcss.com/) for styling
- [Prisma](https://www.prisma.io) for database queries
- [RxDB](https://github.com/pubkey/rxdb) for local offline database

Currently, uses a SQLite database via Prisma, but this can be swapped out for any database that Prisma supports with minimal changes.

## Development

Install dependencies:

```bash
npm install
```

Set up the database:

```bash
npx prisma generate
npx prisma db push
```

Then, run the API server and frontend:

```bash
npm run server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) with your browser to see the app.

