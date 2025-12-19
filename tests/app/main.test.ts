import { describe, expect, it } from "@effect/vitest"
import { Effect } from "effect"
import { vi } from "vitest"

const withLogSpy = Effect.acquireRelease(
  Effect.sync(() => vi.spyOn(console, "log").mockImplementation(() => {})),
  (spy) =>
    Effect.sync(() => {
      spy.mockRestore()
    })
)

const withArgv = (nextArgv: ReadonlyArray<string>) =>
  Effect.acquireRelease(
    Effect.sync(() => {
      const previous = process.argv
      process.argv = [...nextArgv]
      return previous
    }),
    (previous) =>
      Effect.sync(() => {
        process.argv = previous
        vi.resetModules()
      })
  )

describe("main program", () => {
  it.effect("logs default greeting when no args", () =>
    Effect.scoped(
      Effect.gen(function*(_) {
        const logSpy = yield* _(withLogSpy)
        yield* _(withArgv(["node", "main"]))
        yield* _(Effect.sync(() => vi.resetModules()))
        yield* _(Effect.promise(() => import("../../src/app/main.js")))
        yield* _(Effect.sync(() => {
          expect(logSpy).toHaveBeenCalledWith("Hello from Effect!")
        }))
      })
    ))

  it.effect("logs named greeting when name is provided", () =>
    Effect.scoped(
      Effect.gen(function*(_) {
        const logSpy = yield* _(withLogSpy)
        yield* _(withArgv(["node", "main", "Alice"]))
        yield* _(Effect.sync(() => vi.resetModules()))
        yield* _(Effect.promise(() => import("../../src/app/main.js")))
        yield* _(Effect.sync(() => {
          expect(logSpy).toHaveBeenCalledWith("Hello, Alice!")
        }))
      })
    ))
})
