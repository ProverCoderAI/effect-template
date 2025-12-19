import { describe, expect, it } from "@effect/vitest";
import { Effect } from "effect";
import { vi } from "vitest";

describe("main program", () => {
	it.effect("logs default greeting when no args", () =>
		Effect.gen(function* (_) {
			const originalArgv = process.argv;
			const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
			try {
				process.argv = ["node", "main"];
				vi.resetModules();
				yield* _(Effect.promise(() => import("../../src/app/main.js")));
				expect(logSpy).toHaveBeenCalledWith("Hello from Effect!");
			} finally {
				logSpy.mockRestore();
				process.argv = originalArgv;
				vi.resetModules();
			}
		}),
	);

	it.effect("logs named greeting when name is provided", () =>
		Effect.gen(function* (_) {
			const originalArgv = process.argv;
			const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
			try {
				process.argv = ["node", "main", "Alice"];
				vi.resetModules();
				yield* _(Effect.promise(() => import("../../src/app/main.js")));
				expect(logSpy).toHaveBeenCalledWith("Hello, Alice!");
			} finally {
				logSpy.mockRestore();
				process.argv = originalArgv;
				vi.resetModules();
			}
		}),
	);
});
