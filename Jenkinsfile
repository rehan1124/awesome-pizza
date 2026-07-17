// Jenkins equivalent of .github/workflows/playwright.yml
// Runs the Awesome Pizza e2e suite inside the official Playwright Docker image.
pipeline {
    agent {
        docker {
            // Keep this tag in sync with @playwright/test in playwright/package.json.
            // The image ships the matching browsers, so no `playwright install` is needed.
            image 'mcr.microsoft.com/playwright:v1.61.0-noble'
            // --ipc=host: recommended by Playwright to stop Chromium from crashing (OOM) in Docker.
            args '--ipc=host'
        }
    }

    environment {
        // GitHub Actions sets CI=true automatically; Jenkins does not. playwright.config.ts
        // keys off process.env.CI for retries(2), workers(1), forbidOnly, and
        // retain-on-failure traces/screenshots — so set it to get true CI behavior.
        CI = 'true'
        // The container runs as the Jenkins UID (not root), whose $HOME may be unwritable.
        // Point HOME and the npm cache into the workspace so `npm ci` / npx can write.
        HOME = "${WORKSPACE}"
        npm_config_cache = "${WORKSPACE}/.npm"
    }

    options {
        timeout(time: 60, unit: 'MINUTES')
        timestamps()
        disableConcurrentBuilds()
    }

    stages {
        stage('Install dependencies') {
            steps {
                // Root deps: the Playwright webServer boots `tsx ./api/server.ts` from the
                // repo root (cwd: '..'), so tsx/express must be installed here too.
                sh 'npm ci'
                // The Playwright test project lives in ./playwright with its own package.json.
                dir('playwright') {
                    sh 'npm ci'
                }
            }
        }

        // Fast static gate — mirrors the GitHub Actions `quality` job. Fails the build in
        // seconds on a lint/format/type error, before spending time on the browser run.
        stage('Quality (lint, format, types)') {
            steps {
                dir('playwright') {
                    sh 'npm run lint'
                    sh 'npm run format:check'
                    sh 'npm run typecheck'
                }
            }
        }

        stage('E2E tests') {
            steps {
                dir('playwright') {
                    // Override the reporter to HTML so Jenkins can publish one readable report.
                    // (Under CI the config defaults to the `blob` reporter, which is only useful
                    // for the sharded merge step in GitHub Actions.)
                    sh 'npx playwright test --reporter=html'
                }
            }
        }
    }

    post {
        always {
            // Publish the browsable report (needs the "HTML Publisher" plugin).
            publishHTML(target: [
                reportName           : 'Playwright HTML Report',
                reportDir            : 'playwright/playwright-report',
                reportFiles          : 'index.html',
                keepAll              : true,
                alwaysLinkToLastBuild: true,
                allowMissing         : true
            ])
            // Keep the raw report + failure traces/screenshots as build artifacts.
            archiveArtifacts(
                artifacts: 'playwright/playwright-report/**, playwright/test-results/**',
                allowEmptyArchive: true
            )
        }
    }
}
