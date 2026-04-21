# OpenClaw Hooks Setup（two-phase-guard）

本仓库提供一个项目级 OpenClaw hook：`hooks/two-phase-guard`。  
作用：提醒章节写作遵循 `LOAD -> DRAFT -> VERIFY -> PERSIST`，并在疑似“未自检先定稿”时提示补检。

## 1) 前提

- 你已在 OpenClaw 工作区使用本仓库
- OpenClaw 已识别该目录

## 2) 启用方式（推荐 CLI）

```bash
# 查看已发现 hooks（含 bundled / plugin / workspace）
openclaw hooks list

# 启用本项目 hook
openclaw hooks enable two-phase-guard

# 检查状态与可用性
openclaw hooks check
openclaw hooks info two-phase-guard
```

如果 `two-phase-guard` 未被发现，确认工作区目录下存在：

```text
hooks/two-phase-guard/HOOK.md
hooks/two-phase-guard/handler.ts
```

然后重启 gateway 再执行 `openclaw hooks list`。

## 3) 配置方式（可选）

可参考 `references/openclaw-hooks-config.example.json`，把其中 `hooks.internal` 段合并到你的 OpenClaw 配置中。

## 4) 验证

1. 触发 `/new` 或 `/reset`，应出现两阶段提醒
2. 执行 `/stop`，应出现“停前自检”提醒
3. 发送一条包含“定稿/已落盘”但无自检字段的回复，可能触发补检警告

## 5) 边界

- 该 hook 是**提醒型护栏**，不做强阻断。
- 强制顺序仍以 `references/openclaw-enforcement-two-phase.md`（SOUL/全局规则）为主。

## 6) 常见问题：明明装了 skill 但还是不遵守

这是常见现象：skill 负责“规则知识”，不是自动执行器。请叠加三层：

1. `references/openclaw-strict-rules.md` 粘到 SOUL/全局规则（强制“先走 skill、再两阶段、再 PERSIST”）。
2. 启用本 hook（会话内持续提醒，减少漏检）。
3. 长篇务必让输出包含 `chapter_meta.stats` 并执行 `write-protocol` 的一致性硬门。

若第 1 层缺失，模型仍可能直接“写完就收尾”。
