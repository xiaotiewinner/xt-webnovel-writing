# OpenClaw / 虾魂 / 全局规则：强制两阶段 + 项目 PERSIST

本文件供 **OpenClaw 虾魂（SOUL）**、**工作区全局规则**或 **用户固定开场**整段复制；与根目录 `SKILL.md` 公理 12、§7、§9 及 `webnovel-memory/references/write-protocol.md` 一致。

---

## 1. 何时生效

| 场景 | 阶段 0–3 |
|------|-----------|
| 开新书 / 续写 / 写第 N 章 / 计划连载的正文 | **全文强制**（含 LOAD + 两阶段 + PERSIST） |
| 用户明确说「一次性短文，不建项目、不留记忆」 | 可跳过 LOAD / PERSIST；仍须 **阶段 1 + 阶段 2**（至少输出 §9 级自检表） |
| 仅大纲 / 人设 / 点评他人文稿 / 纯诊断 | 不要求 PERSIST；若输出他人章节正文，仍建议阶段 2 |

---

## 2. 强制顺序（同一轮回复内不得跳步）

### 阶段 0 · 项目前置（缺一不得进入阶段 1）

1. 已锁定 `project_root`；若无项目目录 → 先执行 `webnovel-memory` · **INIT**。
2. 写本章正文前 → 必须执行 `webnovel-memory` · **LOAD(project_root, target_chapter)**，把记忆快照（含 `used-patterns`、`soul_fields` 必现清单等）并入上下文；并读取 `全书企划/00-总览.md` + 当前章节所属 Block（仅当前 Block）。
3. 若 `target_chapter` 为 Block 首章（每 10 章第 1 章），需先确认该 Block 已有“详细10章纲要”；缺失时先补纲要再进入阶段 1。

### 阶段 1 · 仅出稿（DRAFT）

- 允许输出：本章正文、**落盘用** 完整 `chapter_meta`（将写入 `state/chapter_meta/ch<NNNN>.yaml`，**不**写入 `chapters/*.md`）。阶段 1 中可用折叠块/单独段落列出元数据要点供自检；**不得**在终稿 `chapters/ch*_*.md` 内留 YAML、注释或除 H1+正文外的任何块。
- **禁止**：用「定稿 / 可发 / 本章已完美收工 / 已写入磁盘」等语收束本轮任务。
- **禁止**：声称已完成 **PERSIST**（除非阶段 3 已真实执行完 8 步）。
- 写入项目的 `*.md` 文档默认中文；仅路径、字段键、代号（如 `REV`）可保留英文。

### 阶段 2 · 自检 + 统计对齐 + 必要时重写（VERIFY）

必须**依次**出现以下内容（可合并为同一回复的后半部分，但顺序不能反）：

1. **自检表**：对 `SKILL.md` §9 勾选逻辑逐项给出 `PASS / WARN / FAIL`；对任一 **回滚级 FAIL** 须标出退回的 workflow（见 `write-protocol` 回滚路径表）。
2. **反 AI 味 Part B**：按 `webnovel-pitfalls/workflow.md` 对**本章正文**走一遍判定思路，输出「条款 → 判定 → 量化证据（含关键 `stats` 字段）」表或等价结构。
3. **E-扩展4 风控面板（必填）**：必须单独给出 `romance_target_ratio / erotic_tension_target_ratio / explicitness_target_ratio / combat_target_ratio / suggestive_erotic_risk_hits / explicit_sexual_content_hits / high_risk_relationship_hits / chapter1_tension_hook_present`。缺任一字段视为 **FAIL**，不得进入阶段 3。
4. **E-扩展6 关系递增面板（必填）**：必须给出 `romance_arc_step / friendship_arc_step / relationship_progression_beats / relationship_jump_without_cause_hits / romance_step_delta_from_prev / friendship_step_delta_from_prev`；关系阶段允许负值到正值（如仇恨/敌对起步）。若任一 `*_step_delta_from_prev >= 2`，还必须给出 `relationship_jump_with_cause_hits / post_jump_emotional_turbulence_hits`。缺字段或无因跨级视为 **FAIL**。
5. **E-扩展7 主角与刺激面板（必填）**：必须给出 `combat_target_ratio / combat_presence_hits / protagonist_distinctive_traits_count / protagonist_initiative_conflict_hits / protagonist_impulse_or_humor_hits / protagonist_template_similarity_hits`。缺字段、主角模板化、或刺激要素缺席视为 **FAIL**。
6. **完整 `chapter_meta.stats`**：字段集合与阈值以 `webnovel-memory/references/write-protocol.md`「一致性检查」为准；数值须与正文可核对。**其中 R-补充（「不是…是…」系）须满足 `contrastive_negation_hits == 0` 且 `keyzone_contrastive_negation_hits == 0`（全章零容忍；缺字段视为 FAIL）。D-4（`narration_buffer_marks` / `clip_style_chain_max` / `d4_pov`）须与 `anti-ai-tells.md` · D-4 及同文件一致性检查一致；O-补充（`character_focus_plan_declared` / `key_character_portrayal_beats` / `important_character_portrayal_beats` / `scenic_counterpoint_portrayal_hits` / `equal_treatment_flatness_hits`）须与 `anti-ai-tells.md` · O-补充及同文件一致性检查一致；A-补充2（`opening_entry_mode` / `opening_mode_reason_code` / `opening_mode_fallback_used` / `opening_mode_streak_max_5ch` / `wakeup_opening_count_10ch` / `prev_hook_carryover_present` / `time_skip_bridge_present`）须与 `anti-ai-tells.md` · A-补充2 及同文件一致性检查一致；P-补充7 / E-补充8 / N-补充2（`background_dump_blocks_over_120` / `memory_infusion_exposition_hits` / `micro_emotion_template_repeat_hits` / `first_chapter_oath_closure_hits`）须与同文件硬门一致；新增去模板化字段（`detail_density_std` / `detail_density_flat_run_max` / `ornament_overflow_hits` / `emotion_temp_range` / `flat_affect_streak_max` / `reaction_modality_variety` / `modern_metaphor_unanchored_hits` / `decorative_crack_hits` / `symmetry_closure_hits` / `single_mode_streak_max`）须与 B/E/G/O/N/C 对应硬门一致；新增身体感与叙述者隐身字段（`opening_body_sensation_anchor_present` / `opening_exposition_first_screen_hits` / `forced_realization_statement_hits` / `nonfunctional_emotion_beats` / `temporal_anchor_consistency_score` / `seasonal_sensory_conflict_hits` / `implicit_time_transition_bridge_hits` / `hard_timestamp_overuse_hits` / `knowledge_resonance_present` / `knowledge_exposition_dump_hits` / `key_role_visual_anchor_on_debut` / `appearance_checklist_dump_hits` / `concrete_anchor_vs_abstract_ratio` / `abstract_judgement_without_anchor_hits` / `dual_function_dialogue_beats` / `info_only_dialogue_block_hits` / `tangible_hook_present` / `atmospheric_only_ending_hits` / `narrator_explanation_overt_hits` / `reader_guidance_phrases_hits`）须与 D/G/O/B/I/N/L 对应硬门一致；绿线分布字段（`style_temperature_band` / `human_noise_hits` / `clean_closure_hits` / `exposition_density_band` / `dialogue_mismatch_ratio` / `detail_density_std` / `detail_density_flat_run_max` / `emotion_temp_range` / `flat_affect_streak_max`）须输出并用于偏离说明。**
7. **闭环**：
   - 若存在任一 **FAIL** 或 **回滚级 FAIL**：**不得**进入阶段 3；须在同一回复内**改写正文**（或明确说明退回 `webnovel-plot-design` / `webnovel-story-blueprint` 重做哪一步），然后**重新执行阶段 2**。
   - 若命中 E-扩展4（露骨性描写 / 高风险关系 / 占比未确认 / 风控面板缺字段）：只能“降级改写后重跑阶段 2”，**禁止**跳过改写直接声称“已过审”。
   - 若命中 E-扩展6（无因跨级跃迁 / 跃迁缺触发或余波字段）：必须补“触发事件 + 代价后果 + 情绪余波”后重跑阶段 2。
   - 若命中 E-扩展7（主角模板化 / 主动刺激要素缺席 / 设定了打戏占比但未落地）：必须补主角主动冲突与非纯谨慎反应，并补“关系高压触点或有效打戏”后重跑阶段 2。
   - 若命中 **R-补充**（`contrastive_negation_hits ≥ 1` 或 `keyzone_contrastive_negation_hits ≥ 1`，即「不是…，是… / 不是…、是… / 不是…也不是…是…」等）：必须全文检索清零该系骨架后重跑阶段 2。
  - 若命中 **Q 禁用转场词自动检索**（正文检索到 `就在这时|与此同时|然而就在|就在他以为|三天后|第二天|一个星期后|半个月过去|时间一晃|转眼间`）：`forbidden_transition_words_hits` 必须如实计数并判 FAIL；禁止“语义解释豁免后仍记 0”。
  - 若命中 **P-补充7 / N-补充2**（`background_dump_blocks_over_120 ≥ 1`，或 chapter 1 的 `memory_infusion_exposition_hits ≥ 1` / `first_chapter_oath_closure_hits ≥ 1`）：必须改为“分批信息投放 + 非宣言式收束”后重跑阶段 2。
  - 绿线分布（`style_temperature_band` / `human_noise_hits` / `clean_closure_hits` / `exposition_density_band` / `dialogue_mismatch_ratio`）缺字段：视为**流程不完整**，需补充后再进入阶段 3；但绿线数值偏离区间仅触发告警，不得单独判 FAIL 或回滚。
   - 全章重写循环 **≤ 2 轮**；仍 FAIL → 使用 `webnovel-pitfalls` 的**拒交付模板**，不得输出虚假 PASS。

### 阶段 3 · 仅当阶段 2 全 PASS（项目正文）

- 执行 `webnovel-memory` · **PERSIST**（`write-protocol.md` 八步 + STEP 0 路径契约），并同步更新 `全书企划`（Block 进度 / 下一章承接点 / Block 首章细纲状态）。
- **仅当** PERSIST 成功完成后，方可向用户报告「本章已落盘 / 已写入 project」。

---

## 3. 极短版（直接贴入 SOUL.md「行为底线」区块，约 400 字）

```
【网文 xt-webnovel-writing · 强制两阶段 + PERSIST】
凡项目正文任务（连载/新书/第 N 章）：先 memory·LOAD（无项目则 INIT），再写稿。
写稿后禁止用「定稿」收束。必须立刻输出：§9自检表 PASS/WARN/FAIL + pitfalls式 Part B 表 + 完整 chapter_meta.stats；
必须单独输出 E-扩展4 风控面板（含感情/色情张力/露骨/打戏占比 + 风险命中）。少字段=FAIL，不得落盘。
必须输出 E-扩展6 关系递增面板；默认禁止无因跨级。若跃迁 ≥ +2，必须有 `relationship_jump_with_cause_hits` + `post_jump_emotional_turbulence_hits`。
必须输出 E-扩展7 主角与刺激面板；主角模板化或刺激要素缺席一律 FAIL。
`chapter_meta.stats` 中 `contrastive_negation_hits` 与 `keyzone_contrastive_negation_hits` 须均为 0（R-补充「不是…是…」系全章零容忍）；任一非 0 则 FAIL，不得落盘。
有 FAIL 或回滚级 FAIL 则同轮内改写并重跑自检，最多2轮；仍失败则拒交付说明。
仅当全 PASS 后才允许 memory·PERSIST；PERSIST 成功后才可说「已落盘」。
写入项目的 .md 文档默认中文（路径/字段键/代号除外）。
一次性短文用户声明不写项目时可跳过 LOAD/PERSIST，但仍须自检表。
```

---

## 4. 与宿主能力的关系

- 本文件**不依赖** Cursor / OpenClaw **hooks**；靠虾魂或全局规则把上述顺序钉进模型行为。
- 若宿主支持 hook，可在「写入 `chapters/ch*_*.md` 与 `state/chapter_meta/chNNNN.yaml` 之后」追加提醒：未完成阶段 2 全 PASS 不得结束会话（可选）。

---

## 5. 交叉引用

- `SKILL.md` §2 公理 12、§7 全流程、§9 交付前自检  
- `webnovel-memory/references/write-protocol.md` · 一致性检查 + `chapter_meta.stats`  
- `webnovel-pitfalls/workflow.md` · 诊断管线、拒交付模板  
- `webnovel-plot-design/workflow.md` · `draft_prose` 正文输出前自检  
