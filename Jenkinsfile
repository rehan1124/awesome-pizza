// Runs the Awesome Pizza Playwright suite inside the official Playwright Docker image
// and publishes the HTML report in Jenkins. See https://playwright.dev/docs/ci#jenkins
pipeline {
    agent {
        docker {
            // Keep this tag in sync with @playwright/test in playwright/package-lock.json
            // (currently 1.61.1). The image ships Node plus the matching browsers and
            // their OS libraries, so there is no `playwright install` step to run.
            image 'mcr.microsoft.com/playwright:v1.61.1-noble'
            // --ipc=host: recommended by Playwright to stop Chromium running out of
            // shared memory and crashing inside Docker.
            args '--ipc=host'
        }
    }

    environment {
        // playwright.config.ts keys off process.env.CI for retries(2), workers(1),
        // forbidOnly, and retain-on-failure traces. Jenkins does not set it, so we do.
        CI = 'true'
        // Jenkins runs the container as the Jenkins UID, not root, so the image's
        // default HOME (/root) is unwritable. Point HOME and the npm cache at the
        // workspace, otherwise `npm ci` fails trying to write its cache.
        HOME = "${WORKSPACE}"
        npm_config_cache = "${WORKSPACE}/.npm"
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

        stage('Run tests') {
            steps {
                dir('playwright') {
                    // --project=chromium: the config also defines a `webkit` project.
                    // The image ships both browsers, so drop this flag to run the full set.
                    // --reporter=html: under CI the config defaults to `blob`, which is
                    // only useful for the sharded merge step in GitHub Actions.
                    sh 'npx playwright test --project=chromium --reporter=html'
                }
            }
        }
    }

    post {
        always {
            // Archive first: this is the fallback copy of the report, so it must not be
            // skipped if the publishHTML step below fails (e.g. plugin not installed).
            archiveArtifacts(
                artifacts: 'playwright/playwright-report/**, playwright/test-results/**',
                allowEmptyArchive: true
            )
            // Browsable report in the build sidebar. Needs the "HTML Publisher" plugin;
            // without it the build fails with "No such DSL method 'publishHTML'".
            publishHTML(target: [
                reportName           : 'Playwright HTML Report',
                reportDir            : 'playwright/playwright-report',
                reportFiles          : 'index.html',
                keepAll              : true,
                alwaysLinkToLastBuild: true,
                allowMissing         : true
            ])
        }
    }
}
