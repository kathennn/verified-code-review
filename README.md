# Verified Code Review

<p align="center">
  <strong>Evidence-first code reviews for safer changes with Claude Code.</strong><br />
  Independent scrutiny, real verification, protected Git operations, and developer understanding — before approval.
</p>

<p align="center">
  <a href="https://github.com/kathennn/verified-code-review/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/kathennn/verified-code-review?style=for-the-badge" /></a>
  <a href="https://github.com/kathennn/verified-code-review/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues/kathennn/verified-code-review?style=for-the-badge" /></a>
  <a href="https://github.com/kathennn/verified-code-review/commits/main"><img alt="Last commit" src="https://img.shields.io/github/last-commit/kathennn/verified-code-review?style=for-the-badge" /></a>
  <img alt="Status: early development" src="https://img.shields.io/badge/status-early%20development-orange?style=for-the-badge" />
  <img alt="npm: planned" src="https://img.shields.io/badge/npm-publication%20planned-blueviolet?style=for-the-badge" />
</p>

> **Current status:** this repository contains the Verified Code Review skill and its plugin metadata. It is public source code, but it is **not published on npm yet**. The future goal is to make setup available through a simple `npx` command once the npm package and installer are implemented and tested.

## Why Verified Code Review?

A green test suite is useful, but it is not the same as understanding or independently validating a change. Verified Code Review turns code review into an evidence-based engineering workflow: inspect first, agree on the task, verify the exact change, challenge it independently, and make sure the developer can explain what is being approved.

It is designed for repositories where work is assisted by **Claude Code**. It encourages careful use of the model and the tools actually available in the project; it does not assume that a particular model, test runner, hook manager, or CI provider is installed.

## What it guides you through

1. **Inspect before editing** — read repository instructions, project conventions, Git state, tests, build scripts, and existing hooks.
2. **Agree on the task** — clarify the intended result, out-of-scope work, and observable acceptance evidence; record the approved brief.
3. **Use an independent reviewer** — examine the diff with a clean reviewer context, report concrete findings, and avoid treating a vague “looks good” as approval.
4. **Verify the exact change** — run the repository's real checks and associate their results with the precise working-tree state or commit.
5. **Protect Git operations** — plan and test safeguards such as verification-aware stop checks and pre-push checks; document where client-side controls cannot provide authoritative enforcement.
6. **Check developer understanding** — answer five questions about the actual diff and its assumptions before recording approval.
7. **Report honestly** — distinguish executed checks from proposed checks, preserve command results, and disclose remaining risks.

## Repository contents

```text
.
├── plugin.json
├── README.md
└── skills/
    └── verified-code-review/
        └── SKILL.md
```

- `plugin.json` — plugin metadata and user-facing description.
- `skills/verified-code-review/SKILL.md` — the complete workflow instructions.

## Getting started today

Until the planned npm installer is available, use the skill from this repository manually:

1. Clone or download this repository.
2. Copy `skills/verified-code-review/` into your Claude Code skills directory, for example `.claude/skills/verified-code-review/` in the target project (or the corresponding personal skills directory if you want it available across projects).
3. Start or restart your Claude Code session if needed, then invoke the `verified-code-review` skill by name.
4. Review the proposed setup plan before authorizing any repository changes. The workflow is intentionally approval-first.

The exact skill discovery behavior can depend on your Claude Code version and configuration. Consult the official Claude Code documentation if your installation uses a different skills location.

## Coming later: npm + `npx`

The intended distribution experience is a command along these lines:

```bash
npx verified-code-review
```

This is a **planned interface, not a working command today**. Before publishing to npm, the project still needs a package manifest, a tested installer/CLI, clear installation and upgrade behavior, package metadata, and a release process. The installer should explain every file it creates and never silently overwrite existing project instructions or hooks.

No npm package is currently published under this name. Do not rely on the command above until this README and the npm registry listing are updated to announce an actual release.

## Safety principles

- Never claim a check, review, hook, or installation ran unless it really did.
- Never weaken or delete tests just to obtain a passing result.
- Never bypass verification with `--no-verify` as a workaround.
- Do not commit or push on the user's behalf unless explicitly authorized and required checks have passed.
- Keep secrets and credentials out of repository files, logs, and review output.
- Treat client-side hooks as defense-in-depth, not a substitute for server-side branch protection and CI.
- The developer remains responsible for understanding and approving published changes.

## Scope and limitations

Verified Code Review is a workflow skill, not a security certification or a guarantee that code is defect-free. Hooks can be removed or bypassed by someone with sufficient local access; independent review quality depends on the reviewer actually receiving and examining the relevant diff and evidence. Adapt commands and safeguards to the repository's existing tooling rather than installing conflicting frameworks.

## Contributing

Contributions, bug reports, and thoughtful suggestions are welcome through GitHub Issues and Pull Requests. Please include the expected behavior, a reproducible example where possible, and the evidence used to validate a change. Changes to safety rules should explain the risk they address and their limitations.

## License

A license has not been selected yet. Until one is added to this repository, all rights are reserved; please open an issue to discuss licensing before reusing or redistributing the project.

---

**Built around a simple rule: no evidence, no approval.**
