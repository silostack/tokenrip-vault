import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

// End-to-end tour flow. No backend needed — `rip tour`, `rip tour next`,
// `rip tour restart`, and `rip tour --agent` are purely local: they read and
// write `<TOKENRIP_CONFIG_DIR>/tour.json` and render prose. None of the
// handlers touch the network or call `requireAuthClient()`.

const CLI = path.resolve(__dirname, '../../packages/cli/src/cli.ts');

let tmpCfg: string;

beforeAll(() => {
  tmpCfg = fs.mkdtempSync(path.join(os.tmpdir(), 'tour-e2e-'));
});

afterAll(() => {
  fs.rmSync(tmpCfg, { recursive: true, force: true });
});

async function rip(args: string[]): Promise<{ code: number; stdout: string; stderr: string }> {
  const proc = Bun.spawn({
    cmd: ['bun', 'run', CLI, ...args],
    env: {
      ...process.env,
      TOKENRIP_CONFIG_DIR: tmpCfg,
      // Force human mode so error output goes to stderr (not JSON on stdout).
      // Tour prose output already uses process.stdout.write directly and is
      // unaffected by this toggle, but it matters for the MISSING_ID error path.
      TOKENRIP_OUTPUT: 'human',
    },
    stdout: 'pipe',
    stderr: 'pipe',
  });
  const stdout = await new Response(proc.stdout).text();
  const stderr = await new Response(proc.stderr).text();
  await proc.exited;
  return { code: proc.exitCode ?? 0, stdout, stderr };
}

describe('rip tour end-to-end', () => {
  test('tour --agent prints the agent script', async () => {
    const { code, stdout } = await rip(['tour', '--agent']);
    expect(code).toBe(0);
    expect(stdout).toMatch(/You're giving your operator a tour/);
    expect(stdout).toMatch(/5 steps/);
    // --agent should NOT persist state
    expect(fs.existsSync(path.join(tmpCfg, 'tour.json'))).toBe(false);
  });

  test('full interactive flow from step 1 to end', async () => {
    // Be safe in case a previous test left state (it shouldn't — --agent is stateless).
    await rip(['tour', 'restart']);

    // Step 1 — initial tour call creates state and renders step 1.
    let r = await rip(['tour']);
    expect(r.code).toBe(0);
    expect(r.stdout).toMatch(/Step 1 of 5/);
    expect(r.stdout).toMatch(/rip --human auth whoami/);

    // Step 2 — `next` with no ID (step 1 doesn't collect one).
    r = await rip(['tour', 'next']);
    expect(r.code).toBe(0);
    expect(r.stdout).toMatch(/Step 2 of 5/);
    expect(r.stdout).toMatch(/rip --human asset publish/);

    // Step 2 expects an asset id on `next` — calling without it must error.
    r = await rip(['tour', 'next']);
    expect(r.code).not.toBe(0);
    expect(r.stderr).toMatch(/asset id/i);

    // Provide a fake asset id to advance.
    r = await rip(['tour', 'next', 'fake-asset-uuid']);
    expect(r.code).toBe(0);
    expect(r.stdout).toMatch(/Step 3 of 5/);
    expect(r.stdout).toMatch(/rip --human operator-link/);

    // Step 4 — `next` with no ID (step 3 doesn't collect one).
    r = await rip(['tour', 'next']);
    expect(r.code).toBe(0);
    expect(r.stdout).toMatch(/Step 4 of 5/);
    // The collected asset id from step 2 should interpolate into the thread-create command.
    expect(r.stdout).toMatch(/fake-asset-uuid/);

    // Step 4 expects a thread id on `next`.
    r = await rip(['tour', 'next']);
    expect(r.code).not.toBe(0);
    expect(r.stderr).toMatch(/thread id/i);

    // Provide a fake thread id to advance to the final step.
    r = await rip(['tour', 'next', 'fake-thread-uuid']);
    expect(r.code).toBe(0);
    expect(r.stdout).toMatch(/Step 5 of 5/);
    expect(r.stdout).toMatch(/fake-thread-uuid/);

    // End of tour — state should be wiped.
    r = await rip(['tour', 'next']);
    expect(r.code).toBe(0);
    expect(r.stdout).toMatch(/end of the tour/i);
    expect(fs.existsSync(path.join(tmpCfg, 'tour.json'))).toBe(false);

    // Running `rip tour` again starts fresh at step 1.
    r = await rip(['tour']);
    expect(r.code).toBe(0);
    expect(r.stdout).toMatch(/Step 1 of 5/);

    // Clean up for test isolation.
    await rip(['tour', 'restart']);
  });
});
