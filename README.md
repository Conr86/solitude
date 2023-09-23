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
- Tree structure for pages, similar to Notion
- Search for pages from the sidebar
- Word count
- Attractive UI including light and dark mode based on system setting
- Export a page as Markdown

### On the roadmap
- Embedded images
- Offline support, including syncing
- Backups and revision control
- Manual toggling of light/dark mode
- Basic insights on the Home page such as number of pages or total word count
- Workspaces or projects, letting you have multiple collections of pages

## Uses
- [Vite](https://vitejs.dev/) for tooling
- [Tauri](https://tauri.app/) for client bundling
- [Typescript](https://www.typescriptlang.org/)
- [Tiptap](https://www.tiptap.dev/) as editor backend
- [TailwindCSS](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io) for database queries

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

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) with your browser to see the app.

