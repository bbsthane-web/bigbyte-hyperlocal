"""
Automated 1-Click Deployment Script for BigByte Systems
Deploys website, Mobile VSD, and Presentation Deck to GitHub Pages.
"""

import sys
import subprocess
import json
import shutil
from pathlib import Path

# Fix Windows console encoding
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

GH_BIN = r"C:\Program Files\GitHub CLI\gh.exe"
GIT_BIN = r"C:\Program Files\Git\cmd\git.exe"

def run_cmd(cmd, cwd=None):
    try:
        res = subprocess.run(cmd, cwd=cwd, shell=True, capture_output=True, text=True, encoding="utf-8", errors="ignore")
        return res.returncode, res.stdout.strip(), res.stderr.strip()
    except Exception as e:
        return 1, "", str(e)

def deploy_with_token(github_user: str, token: str, repo_name: str = "bigbyte-hyperlocal"):
    print(f"🚀 Deploying to GitHub account: {github_user}...")
    remote_url = f"https://{github_user}:{token}@github.com/{github_user}/{repo_name}.git"
    
    # 1. Update git remote
    run_cmd(f'"{GIT_BIN}" remote remove origin')
    code, out, err = run_cmd(f'"{GIT_BIN}" remote add origin "{remote_url}"')
    
    # 2. Push master branch and tags
    print(f"📦 Pushing code and assets to GitHub ({repo_name})...")
    code, out, err = run_cmd(f'"{GIT_BIN}" push -u origin master --tags --force')
    if code != 0:
        print(f"❌ Push failed: {err or out}")
        return False
        
    print(f"✅ Code pushed successfully!")
    print(f"🌐 Your live site will be ready at: https://{github_user}.github.io/{repo_name}/")
    return True

def deploy_with_gh_cli(repo_name: str = "bigbyte-hyperlocal"):
    # Check if gh CLI is authenticated
    code, out, err = run_cmd(f'"{GH_BIN}" auth status')
    if code != 0:
        print("⚠️ GitHub CLI is not yet logged in.")
        return False
        
    print("🚀 Creating repository and deploying via GitHub CLI...")
    # Create repo if not exists
    create_cmd = f'"{GH_BIN}" repo create {repo_name} --public --source=. --remote=origin --push'
    code, out, err = run_cmd(create_cmd)
    
    # Enable GitHub Pages via API
    print("⚙️ Enabling GitHub Pages...")
    pages_cmd = f'"{GH_BIN}" api repos/:owner/{repo_name}/pages -X POST -F "source[branch]=master" -F "source[path]=/"'
    run_cmd(pages_cmd)
    
    # Get user
    _, user_name, _ = run_cmd(f'"{GH_BIN}" api user -q .login')
    if user_name:
        print(f"🎉 SUCCESS! Deployed to GitHub Pages: https://{user_name}.github.io/{repo_name}/")
    return True

if __name__ == "__main__":
    if len(sys.argv) >= 3:
        user = sys.argv[1]
        token = sys.argv[2]
        repo = sys.argv[3] if len(sys.argv) > 3 else "bigbyte-hyperlocal"
        deploy_with_token(user, token, repo)
    else:
        success = deploy_with_gh_cli()
        if not success:
            print("Usage for direct token deployment:")
            print("  python deploy.py <your-github-username> <your-github-pat-token> [repo-name]")
