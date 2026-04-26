# OpenClaw Hooks Setup（two-phase-guard）

本仓库提供一个项目级 OpenClaw hook：`hooks/two-phase-guard`。  
作用：提醒章节写作遵循 `LOAD -> DRAFT -> VERIFY -> PERSIST`（VERIFY 含 `chapter_meta.stats` + 绿线字段），并在疑似“未自检先定稿”时提示补检。

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
3. 项目正文任务务必让输出包含 `chapter_meta.stats` 与绿线字段（`style_temperature_band` / `human_noise_hits` / `clean_closure_hits` / `exposition_density_band` / `dialogue_mismatch_ratio`），并执行 `write-protocol` 的一致性硬门（绿线偏离仅告警，不单独回滚）。
4. 若启用新版“去模板化反制”，需确认 `chapter_meta.stats` 同步包含 `detail_density_std` / `detail_density_flat_run_max` / `emotion_temp_range` / `flat_affect_streak_max` / `modern_metaphor_unanchored_hits` / `decorative_crack_hits` / `symmetry_closure_hits` / `single_mode_streak_max` 等字段；这些字段按 `write-protocol` 硬门判定，不受绿线豁免。
5. 若启用“叙述者隐身与身体感开局”链路，需同步包含 `opening_body_sensation_anchor_present` / `opening_exposition_first_screen_hits` / `forced_realization_statement_hits` / `nonfunctional_emotion_beats` / `knowledge_resonance_present` / `knowledge_exposition_dump_hits` / `key_role_visual_anchor_on_debut` / `appearance_checklist_dump_hits` / `concrete_anchor_vs_abstract_ratio` / `abstract_judgement_without_anchor_hits` / `dual_function_dialogue_beats` / `tangible_hook_present` / `atmospheric_only_ending_hits` / `narrator_explanation_overt_hits` / `reader_guidance_phrases_hits`；缺字段按 `write-protocol` 一致性检查 FAIL 处理。
6. 启用“全书企划”后，正文任务需确认：`LOAD` 已读取 `全书企划/00-总览.md` + 当前章节所属 Block；若为 Block 首章，必须先有该 Block 的详细10章纲要；`PERSIST` 后应回写 `blocks-index` 与当前 Block 进度。

若第 1 层缺失，模型仍可能直接“写完就收尾”。
