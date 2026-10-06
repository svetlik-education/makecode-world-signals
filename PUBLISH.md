# Publish to GitHub

The code is prepared for a **public pilot repository**, but the GitHub connector is disabled by the workspace administrator, and this authoring session has no GitHub CLI/authentication. No repository or release has been created. No live import URL exists yet. Ask the workspace administrator to enable the GitHub connector for direct assisted publishing, or use the browser route below on your own account.

## Browser route

1. Sign into your GitHub account and create a **public** repository called `makecode-world-signals`. Use your account or an organization you administer. Leave it empty initially.
2. Extract the supplied ZIP. Open its `makecode-world-signals` folder.
3. In the repository, choose **Add file → Upload files**. Upload the contents of that folder, not the enclosing folder. At minimum, put `pxt.json`, `main.ts`, `test.ts`, `README.md`, and `LICENSE` at the repository root. Also upload the examples, docs, test runner, validation report, publishing guide, and student starter.
4. Commit the upload. If your file browser omits hidden directories, add `.github/workflows/test.yml` separately using **Add file → Create new file** to enable the automated logic tests.
5. Copy the actual repository URL. Replace the `OWNER` placeholder in README's installation instructions with your real GitHub account/organization. The docs must not suggest the placeholder is a working URL.
6. Import that exact URL into a fresh Minecraft MakeCode project as an extension. Run the teacher pilot. A public GitHub repository does not mean the extension has passed compilation or runtime testing.
7. Update `VALIDATION.md` with actual PXT, Blocks, and in-game results. If the pilot fails, keep the prototype status and open an issue with the version/device/results.
8. After successful pilot testing, create a `v0.1.0` tag/release in GitHub and describe the tested device/version and sampling limits. Keep it labeled a pilot until the full classroom matrix passes. Download and archive the tested source version.

Students paste the real repository URL into **Extensions**. Search/gallery approval is a separate process; an exact public GitHub URL can be used without gallery listing. Do not publish student names or account details with test results.

## Optional command-line route

On your own computer, with Git and GitHub CLI installed and authenticated, from the extracted repository folder:

```bash
git init -b main
git add .
git commit -m "Add World Signals pilot extension and student starter"
gh repo create makecode-world-signals --public --source=. --remote=origin --push
```

Use the repository owner returned by GitHub, then follow the same import/pilot/release steps above. Do not paste a GitHub token into a chat or put one in the code.

## Publishing through MakeCode

Minecraft MakeCode exposes GitHub integration in its browser editor at https://minecraft.makecode.com/?github=1. Microsoft's documentation explains authoring and hosting extensions. The direct GitHub upload route above preserves the complete package and accompanying guides.
