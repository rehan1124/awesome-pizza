// Runs the Awesome Pizza Playwright suite and publishes the HTML report in Jenkins.
pipeline {
    agent any

    environment {
        // playwright.config.ts keys off process.env.CI for retries(2), workers(1),
        // forbidOnly, and retain-on-failure traces. Jenkins does not set it, so we do.
        CI = 'true'
    }

    // Job-wide guardrails (optional — the pipeline runs fine without them):
    //  - timeout: fail the build after 30 min instead of letting a hung run hold the
    //    agent forever (e.g. the webServer never comes up on port 3000).
    //  - disableConcurrentBuilds: queue builds instead of running them side by side.
    //    The test server binds a fixed port (127.0.0.1:3000), so two builds at once
    //    would clash on the port or share state and fail in confusing ways.
    options {
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    stages {
        stage('Install dependencies') {
            steps {
                // Root deps: the Playwright webServer starts `tsx ./api/server.ts`
                // from the repo root (cwd: '..'), so tsx/express must be installed here.
                sh 'npm ci'
                // The test project lives in ./playwright with its own package.json.
                dir('playwright') {
                    sh 'npm ci'
                }
            }
        }

        stage('Install browsers') {
            steps {
                dir('playwright') {
                    // Chromium only, to keep the install fast. --with-deps also installs
                    // the OS libraries the browser needs. It requires root; if the agent
                    // runs as a non-root user, drop the flag and run
                    // `sudo npx playwright install-deps chromium` once on the agent.
                    sh 'npx playwright install --with-deps chromium'
                }
            }
        }

        stage('Run tests') {
            steps {
                dir('playwright') {
                    // --project=chromium: the config also defines a `webkit` project, but
                    // we only install Chromium above, so limit the run to match.
                    // --reporter=html: under CI the config defaults to `blob`, which is
                    // only useful for the sharded merge step in GitHub Actions.
                    sh 'npx playwright test --project=chromium --reporter=html'
                }
            }
        }
    }

    post {
        always {
            // Browsable report in the build sidebar (needs the "HTML Publisher" plugin).
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
