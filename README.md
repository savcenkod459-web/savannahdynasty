# Welcome to your Lovable project

## Project info

**URL**: https://savcenkod459-web.github.io/savannahdynasty/

**Live Site**: https://savcenkod459-web.github.io/savannahdynasty/

**GitHub Repository**: [github.com/savcenkod459-web/savannahdynasty](https://savcenkod459-web.github.io/savannahdynasty/)

**GitHub Pages**: https://savcenkod459-web.github.io/savannahdynasty/

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://savcenkod459-web.github.io/savannahdynasty/) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

### Deploy on Lovable

Simply open [Lovable](https://savcenkod459-web.github.io/savannahdynasty/) and click on Share -> Publish.

### Deploy on GitHub Pages

1. Push your code to GitHub repository
2. Go to repository Settings → Secrets and variables → Actions
3. Add the following secrets:
   - `VITE_SUPABASE_URL` - your Supabase project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY` - your Supabase anon key
   - `VITE_SUPABASE_PROJECT_ID` - your Supabase project ID
4. Go to repository Settings → Pages
5. Under "Build and deployment", select "GitHub Actions" as source
6. The site will automatically deploy on push to main branch
7. Your site will be available at `https://savcenkod459-web.github.io/savannahdynasty/`

Note: The GitHub Actions workflow is already configured in `.github/workflows/deploy.yml`

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
