import { test } from '@playwright/test';

type AsyncMethod<This, Args extends unknown[], Return> = (
    this: This,
    ...args: Args
) => Promise<Return>;

/**
 * Method decorator that wraps a Page Object method in a Playwright `test.step`.
 *
 * In the HTML report the wrapped method shows up as a single top-level step
 * titled `ClassName.methodName` (or a custom title). Every locator action and
 * assertion the method performs is nested *underneath* it, so the report reads
 * as high-level intent first, with the low-level steps tucked inside each method
 * (expandable) instead of listed flat at the top level.
 *
 * @param stepName Custom step title. Defaults to `ClassName.methodName`.
 * @param options.box When true the step is rendered as an opaque box: an error
 *   inside it points at the call site rather than the internal step. Defaults to
 *   false so the inner steps stay visible when expanded.
 *
 * Uses the TC39 standard (Stage 3) decorator signature, so
 * `experimentalDecorators` must NOT be enabled in tsconfig. Playwright's own
 * loader compiles these at runtime.
 */
export function Step(stepName?: string, options: { box?: boolean } = {}) {
    return function <This, Args extends unknown[], Return>(
        target: AsyncMethod<This, Args, Return>,
        context: ClassMethodDecoratorContext<This, AsyncMethod<This, Args, Return>>,
    ): AsyncMethod<This, Args, Return> {
        const methodName = String(context.name);

        return function (this: This, ...args: Args): Promise<Return> {
            const className = (this as { constructor?: { name?: string } })?.constructor?.name;
            const title = stepName ?? (className ? `${className}.${methodName}` : methodName);

            return test.step(title, async () => target.apply(this, args), { box: options.box });
        };
    };
}
