import type { Config } from '@playwright/test';
import type { GitHubActionOptions } from '@estruyf/github-actions-reporter';

// Used only by `playwright merge-reports --config merge.config.ts` in CI.
// Merges the per-shard blob reports into one HTML report and one combined
// GitHub Actions run summary (flat "without details" table).
export default {
  reporter: [
    ['html', { open: 'never' }],
    ['@estruyf/github-actions-reporter', { useDetails: false } as GitHubActionOptions],
  ],
} satisfies Config;
