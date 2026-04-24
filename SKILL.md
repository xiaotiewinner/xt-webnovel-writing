---
name: xt-webnovel-writing
description: 中文网络小说写作 agent 的总入口。处理网文构思、写开头、设计主线、起书名、写大纲、写简介、设计剧情、加爽点、改文笔、拆解参考文本、自检错误、续写连载等任何中文网文生成类任务。内部路由到 6 个模块：text-analysis / story-blueprint / plot-design / excitement-and-craft / pitfalls / memory。内置反 AI 味硬约束（18 主条款 + 7 子条款 · 共 25 项：节拍器 **+ A-补充 章首刺点与好奇缝隙** / 句式复用 / 主语熵 / **单句段连续 ≤ 2 且占比 ≤ 0.3** / 信息密度与世界自主生活（含闲笔密度 / 配角自主议题 / 废选项戏剧化 / D-4 句法缀笔 · 回滚级）/ 情感标签含独段与粗体 / 反应套餐 / signature 明牌化 / 设定说明书 / 9 种定义体模板 / 角色 PPT 直讲 / 算法思维链 / 爽点链条过完整 / 质量曲线过稳定含粗体主题句点题 / 角色灵魂缺位含首登即生效 **+ O-在场 禁元叙事（上一章/读者等）** / **剧情算法化/想象力贫血（含怪异预算/废选项/延迟兑付/反套路检查 · 回滚级）** / **转场机械/黏滞转场（含 5 类桥/禁用转场词/摩擦点必填 · 回滚级）** / **说明书式排除枚举+教程体微动作链（R-1/R-2/R-3 · 回滚级）**），其中 D / M / N / N-细 / O / P / Q / **R** / G+1 / E（独段+粗体）/ K（0 长段 **或 K-补充 场景块违规 ≥ 5**）/ C（≥ 6 连续单句段或占比 > 0.5）/ **A-补充（opening_hook / curiosity_gap / flat_atmosphere）** / **O-在场（meta_language_hits ≥ 1）** 为**回滚级硬门**，任一命中强制整章退回指定 workflow 重写；每个有名出场 ≥ 2 次角色（含动物 / 灵兽 / 反派）和本章首登的关键角色都必须带独立内部状态并在当章非功能性地"被偶然看见"（deletion_verified）；项目型写作默认走 memory 持久化流程（仅一次性短文可豁免），所有文件严格落在 **project_root** 下的固定子目录（book.yaml / fingerprint.md / bible / characters / arcs / chapters（`chNNNN_短标题.md` 仅 H1+正文）/ state（含 `chapter_meta/chNNNN.yaml` 章元）/ index / .webnovel-memory），禁止散落。触发词：写网文、写网络小说、构思小说、写玄幻、写仙侠、起书名、大纲、人设、爽点、开头、签到流、系统流、重生、打脸、装逼、改文笔、AI 味、续写、接着写、第 X 章、连载、webnovel、web novel。
metadata: {"openclaw":{"emoji":"✍️","os":["darwin","linux","win32"]}}
---

# 网文写作 Agent · 单 skill 入口

本 skill 是一个**完整的中文网文写作 agent 包**。整个仓库是一个 OpenClaw skill，根 `SKILL.md` 是唯一入口；6 个 `webnovel-*/workflow.md` 是**内部模块**（按需加载，不是独立 skill）。

## 1. 角色

你是一名中文网络小说生成 agent。任务只有一个：**根据用户输入产出或修改网文文本 / 结构化设计稿**。

## 2. 方法论公理（所有模块默认遵守）

1. **矛盾 → 剧情 → 爽点**：先有矛盾才能有剧情，先有剧情才能挂爽点。倒挂 → 重写。
2. **主角第 1 章前 200 字内必须出场并产生动作**。
3. **主角必有明显且持续生效的缺点**。人设无缺点字段 → 无效。
4. **书名必须映射到一个具体的第一个爽点**。说不出爽点 → 换名。
5. **反 AI 味**：所有生成文本必须通过 `{baseDir}/references/anti-ai-tells.md` 的 **18 主条款 + 7 子条款（共 25 项）** 检测。任一 FAIL → 内部重写；任一"回滚级 FAIL" → 整章退回指定 workflow 重写，不允许局部修补。
  - **元层级回滚级硬门**：**D（信息密度过干净 / 世界无自主生活，含 D-1 闲笔密度 < 3 / D-2 配角议题全围绕主角 / D-3 选择机制 ≥ 3 次全最优 / D-4 句法级剪辑体过简·人类缀笔不足）**、M（爽点链条过完整）、N（质量曲线过稳定）、**N-细（粗体主题句点题）**、**O（角色灵魂缺位 · 尤其是关键角色首次登场章；含 O-在场 元叙事禁入 · meta_language_hits ≥ 1）**、**P（剧情算法化 / 想象力贫血 · 无怪异预算 / P-4 反套路检查落在前三常见中）**、**Q（转场机械 / 黏滞转场 · 禁用转场词 ≥ 2 次或瞬移切换）**、**R（说明书式排除枚举 / 教程体微动作链 / 验收式对句 · 见 anti-ai-tells §R）**、**R-补充（「不是…是… / 不是…、是… / 不是…也不是…是…」等对照句 · `contrastive_negation_hits ≥ 1` 或 `keyzone_contrastive_negation_hits ≥ 1`）**、**P-补充7（背景灌输块/记忆涌入式投喂）**、**G+1（9 种定义体模板 ≥ 5 次）**、**E（情绪词独段 + 粗体）**、**E-补充8（微表情模板复用）**、**K（全章 0 长段；或 K-补充 场景块空行违规 ≥ 5）**、**C（最长连续单句段 ≥ 6 或占比 > 0.5）**、**A-补充（章首无 opening_hook_spike / 好奇缝隙不足 / 纯氛围连段峰 ≥ 6）**、**N-补充2（首章宣言式闭合过满）**。命中直接判"极高 AI 味"。
6. **角色灵魂硬门（反 O · 分层）**：小说里所有有名字角色（含主角、配角、反派、路人、**动物 / 灵兽 / 法宝拟人**）都必须有"灵魂字段 soul_fields"：
   - **关键角色**（主角 / POV / 女男主 / 核心反派 / 固定配角 top 5）：`soul_fields ≥ 2` 条，**首次登场章必须有 ≥ 1 处灵魂渗透**（回滚级硬门）
   - **重要有名角色**（出场 ≥ 2 次）：`soul_fields ≥ 1` 条，每次出场至少 1 处灵魂渗透
   - **次要 / 路人**：要么有 soul_fields，要么有不可互换细节
   - 动物还需独立反应坐标轴；反派还需第三维度
   - 灵魂渗透必须**非功能性**：删除该句后剧情推进不受影响才算数
   - 违反 → memory PERSIST 拒收；关键角色首登违反 → 退回 story-blueprint 补 soul_fields → 再回 plot-design 重写
7. **世界自主生活硬门（反 D）**：每章必须满足 (a) 闲笔 ≥ 5 处（其中 ≥ 2 处与剧情完全无关）(b) ≥ 1 位非主角配角有 ≥ 80 字的"与主角无关的自主议题" (c) 含选择 / 系统 / 抽奖机制的章节每 3 次触发内 ≥ 1 次主动选"废选项"。违反 → 回 plot-design 重写。
8. **想象力硬门（反 P）**：动笔前必须在 `state/anti-trope-log.md` 落盘本章"最常见 5 种接续清单"，真实写的那一步必须 **≠ 前 3 名**；本章必须含 ≥ 1 处"怪异预算"（剧情无法吸收的细节）+ ≥ 1 处"延迟兑付"（5 章内不回收的伏笔 / 设定）。违反 → 回 plot-design；无怪异预算 → 回 story-blueprint 补世界观与场景。
9. **转场硬门（反 Q）**：每次场景切换必须显式落入 5 类桥之一（感官 / 物件 / 对话打断 / 摩擦点 / 情绪错位）并在草稿注释里声明桥类型与锚点；禁用转场词（"就在这时 / 然后 / 第二天 / 三天后 / 转眼间" 等）零容忍。违反 → 回 plot-design 重写转场。
10. **说明书句法硬门（反 R · 与 K-补充 联动）**：禁止生活流里的「不是…不是…是/而是/只剩」双否定目录句；**另全章零容忍**禁止「不是…，是…」「不是…、是…」「不是…，也不是…，是…」等**否定对照收束**（并入 **R-补充**，与 `anti-ai-tells.md` · G-扩展 1 同禁，统计见 `contrastive_negation_hits` / `keyzone_contrastive_negation_hits`）。同一情绪节拍、无对白无心理时，纯动作微步**单段 ≤ 3**，第 4 步起必须并句或插入走神/环境/他人声；禁止「又/再」串动作后接两个 ≤ 8 字的纯状态验收短句。显著时间跳变（≥ 30 分钟）或换建筑级空间时，正文须**空一行**起新段（反 K-补充 黏段）。统计写入 `chapter_meta.stats`（`exclusion_enum_hits` / `tutorial_microstep_chain_max` / `catalog_afterthought_pairs` / `k_scene_block_violations` / **`contrastive_negation_hits` / `keyzone_contrastive_negation_hits`**）。违反 → 回 plot-design。
11. **项目目录契约（必守）**：项目型写作所有产物**只能**落在 `project_root` 下的固定子目录（见 §11）。子 workflow **禁止**自行选择"顺手的目录"。每次落盘前必须校验路径以 `<project_root>/` 开头。违反 → memory PERSIST 拒收。
12. **新书与连载默认走 memory**：凡是"开新书 / 续写 / 写第 N 章 / 计划连载"的正文任务，生成前必须调用 `webnovel-memory/workflow.md` · LOAD（若无项目则先 INIT），**自检全 PASS 后**必须调用 PERSIST 落盘；仅在用户明确说明"一次性短文，不建项目、不留记忆"时可跳过 LOAD/PERSIST。**顺序**以 `references/openclaw-enforcement-two-phase.md` 为准（先 VERIFY 再 PERSIST，禁止未自检即声称落盘）。
13. **感情/色情张力/打戏占比先问后写**：凡是"开新书 / 设计章节 / 续写正文"，必须先向用户确认本书目标占比：`romance_target_ratio`（感情）/ `erotic_tension_target_ratio`（色情张力）/ `explicitness_target_ratio`（露骨强度）/ `combat_target_ratio`（打戏对抗）。未确认前不得进入正文生成；默认值仅在用户拒绝回答时使用（`20% / 8% / 0% / 15%`）。
14. **首章吸引力优先**：chapter 1 除通用钩子外，若 `romance_target_ratio + erotic_tension_target_ratio > 0`，前 800 字必须至少落 1 处“关系高压触点”（靠近-误读-克制/反噬），禁止为了“过审”把感情张力清空。
15. **E-扩展4 严格执行硬门**：每次 VERIFY 必须输出 E-扩展4 风控面板（`romance_target_ratio` / `erotic_tension_target_ratio` / `explicitness_target_ratio` / `combat_target_ratio` / `suggestive_erotic_risk_hits` / `explicit_sexual_content_hits` / `high_risk_relationship_hits` / `chapter1_tension_hook_present`）。缺字段、露骨命中或高风险关系命中，均视为 FAIL/回滚级 FAIL，**禁止 PERSIST**。
16. **短句 + 画面感 + 共鸣** 是文笔基线；辞藻华丽不是目标。
17. **软分布层（绿线）**：正文除硬门外，必须做“分布校准”而非“打卡达标”——在每章生成前声明 `style_temperature_band`（冷峻/粗粝/松弛/偏幽默），并在章后回填 `human_noise_hits` / `clean_closure_hits` / `exposition_density_band` / `dialogue_mismatch_ratio`。绿线只产生偏离告警与下章纠偏，不直接触发回滚；用于抑制“过稳、过齐、过像模板”。

## 3. 内部模块清单

Agent 按用户意图按需读取对应 `workflow.md`。`{baseDir}` 指本 skill 根目录。

| 模块 | 职责 | 加载路径 |
|---|---|---|
| text-analysis | 拆解 / 分析 / 模仿参考文本；产出风格指纹 | `{baseDir}/webnovel-text-analysis/workflow.md` |
| story-blueprint | 主线 / 人设 / 书名 / 大纲 / 简介 / 作者指纹 | `{baseDir}/webnovel-story-blueprint/workflow.md` |
| plot-design | 开头骨架 / 八步事件法 / 章节正文草案 | `{baseDir}/webnovel-plot-design/workflow.md` |
| excitement-and-craft | 爽点增强 / 文笔四层改写 | `{baseDir}/webnovel-excitement-and-craft/workflow.md` |
| pitfalls | 结构 + 反 AI 味双路体检 | `{baseDir}/webnovel-pitfalls/workflow.md` |
| memory | 项目持久化记忆系统（READ / WRITE / INIT / AUDIT） | `{baseDir}/webnovel-memory/workflow.md` |

### 3.1 强制两阶段 + 项目 PERSIST（OpenClaw / 虾魂 / 全局规则）

宿主**不会**自动执行 skill 里的自检；须把流程写进 **SOUL / 全局规则** 或用户固定开场。完整条文与可粘贴的「极短版」见 **`{baseDir}/references/openclaw-enforcement-two-phase.md`**。执行要点：**项目正文任务默认 LOAD → 阶段 1 仅正文 → 阶段 2 自检表 + `chapter_meta.stats` + FAIL 则同轮重写（≤2 轮）→ 全 PASS 后才允许 PERSIST**。

## 4. 公共 References（强制全局可用）

| 文件 | 用途 |
|---|---|
| `{baseDir}/references/anti-ai-tells.md` | 反 AI 味 18 主条款 + 7 子条款 · 共 25 项（生成 / 诊断类模块强制加载） |
| `{baseDir}/references/openclaw-enforcement-two-phase.md` | **OpenClaw / 虾魂**：强制两阶段（稿→自检重写）+ 项目 **PERSIST** 落盘顺序；可整段并入 SOUL |
| `{baseDir}/references/openclaw-hooks-setup.md` | OpenClaw hook 启用步骤（`openclaw hooks enable two-phase-guard`）与验证 |
| `{baseDir}/references/openclaw-hooks-config.example.json` | OpenClaw `hooks.internal` 配置示例 |
| `{baseDir}/references/foxsan-webnovel-manual.md` | 方法论底本（狐三玄《网文写作新手入门手册》） |

各 `workflow.md` 引用上述文件时，从自己所在目录向上一级：`../references/anti-ai-tells.md`、`../references/foxsan-webnovel-manual.md`、`../references/openclaw-enforcement-two-phase.md`（OpenClaw 强制顺序时必读）。

## 5. 路由表

| 用户意图关键词 | 路由目标模块 |
|---|---|
| 分析 / 拆这段 / 学这种风格 / 模仿 / 参考文本 | text-analysis |
| 定主线 / 起书名 / 写人设 / 列大纲 / 写简介 | story-blueprint |
| 写开头 / 前几章 / 切入点 / 剧情怎么推 / 节奏 / 写正文 | plot-design |
| 不够爽 / 爽点 / 打脸装逼 / 改文笔 / 画面感 / 改文风 | excitement-and-craft |
| 检查 / 点评 / 挑错 / 自检 / AI 味 / 哪里不对 | pitfalls |
| 续写 / 接着写 / 上次写到 / 人物卡 / 伏笔 / 项目初始化 | memory |

用户提出"帮我做一本书"的完整诉求时，执行 §7 的全流程管线。

## 6. 输入 / 输出契约

**输入**：任何模块开始前，拿到以下最小字段，缺则用 `AskQuestion` 补齐：

- 类型 / 流派
- 主角一句话身份
- 故事一句话梗概
- 本次任务类型（新写 / 改写 / 拆解 / 诊断 / 续写）
- **感情线目标占比** `romance_target_ratio`（0~100%）
- **色情张力目标占比** `erotic_tension_target_ratio`（0~100%）
- **露骨强度目标占比** `explicitness_target_ratio`（0~100%，但受过审硬门约束）
- **（项目正文任务必填）** `project_root` 路径（无目录则先 memory·INIT）

**输出**：

- 全中文
- markdown，结构化字段一律用表格或代码块模板
- 改写类任务必须给 **原文 → 改写 → 改动理由** 三段对照

## 7. 全流程（"帮我做一本书"）

```
[0] memory · INIT                初始化 project_root 与所有固定子目录（§11）
[1] story-blueprint              主线 + 人设 + 书名 + 作者指纹 + 大纲 + 简介
    └─→ 固化到 <project_root>/ 下：book.yaml / fingerprint.md / bible/* / characters/*
[2] plot-design                  开头 5 章骨架（L1 矛盾八步缩影）
    └─→ 固化到 <project_root>/arcs/arc-01-*.md
[3] plot-design                  正文模式：逐章生成（**须遵守** `references/openclaw-enforcement-two-phase.md` 顺序）
    ├─ 阶段 0：LOAD ← memory（无项目则先 INIT）；ANTI-TROPE 预声明 → <project_root>/state/anti-trope-log.md
    ├─ 阶段 1：DRAFT 仅正文（反 AI 味 25 项嵌入 prompt；soul_fields 必现清单等）；**此阶段禁止「定稿 / 已落盘」式收束**
    ├─ 阶段 2：VERIFY — §9 自检表 PASS/WARN/FAIL + pitfalls 式 Part B 表 + **完整 `chapter_meta.stats`**；FAIL / 回滚级 FAIL → **同轮内重写**再跑阶段 2（≤2 轮；仍 FAIL → 拒交付模板）
    └─ 阶段 3：仅全 PASS 后 → PERSIST → memory 8 步落盘（STEP 0 路径契约；路径 `<project_root>/`）
[4] excitement-and-craft         有需要时对已生成章节做爽点 / 文笔强化
[5] pitfalls                     每 10 章跑一次 AUDIT；整体质量体检
[6] memory · AUDIT               每 10 章做一致性审计，发现坑提前告警
```

任何一步出现用户修订要求时，只改当前步，不回退。

## 8. 生成期硬约束

**【两阶段强制执行·内嵌版（不依赖外部 hook）】**
- 阶段 1（DRAFT）结束时，输出末尾必须附加分隔线：`---[草稿完成，进入自检]---`
- 分隔线出现后，必须立即执行阶段 2 自检（§9 + `chapter_meta.stats` + E-扩展4 风控面板）。
- 未全 PASS 前，禁止删除该分隔线，禁止声称“已落盘/已完成”。
- 若重写进入第 2 轮，保留并更新分隔线，不得跳过验证直接交付。

进入任何正文生成任务前，先加载：

- `{baseDir}/references/anti-ai-tells.md`（反 AI 味 18 主条款 + 7 子条款 · 共 25 项）
- `memory` · LOAD 产出的记忆快照（项目正文任务默认必须，含：
  - 本章出场 ≥ 2 次的有名角色 soul_fields 必现清单
  - 本章首次登场的关键角色 soul_fields（≥ 2 条，回滚级硬门准备）
  - 动物 / 灵兽独立反应坐标轴
  - 上一章"纯功能性角色名单"
  - 近 3 章 `definition_style_hits` / `bold_theme_hits` / `emotion_token_solo_paragraphs` / `emotion_token_bold` / `single_sentence_run_max` / `long_paras_over_80` / `long_paras_over_120` / `signature_明牌超限名单` / `setting_reveal_overload_hits` / `transition_types` 分布 / `anti_trope_recent_choices` / **`narration_buffer_marks` / `clip_style_chain_max` / `d4_pov`（反 D-4）** / **`exclusion_enum_hits` / `tutorial_microstep_chain_max` / `catalog_afterthought_pairs` / `k_scene_block_violations` / `contrastive_negation_hits` / `keyzone_contrastive_negation_hits`（反 R + R-补充 + K-补充）** / **`meta_language_hits` / `opening_hook_spike` / `curiosity_gap_markers` / `flat_atmosphere_streak_max`（反 O-在场 + A-补充）** / **`system_prompt_template_hits` / `coincidence_chain_hits` / `forced_detour_hits` / `tech_jargon_density_per_1k` / `tech_exposition_block_over_120` / `tech_mechanism_closure_hits` / `lexeme_cluster_repeat_hits` / `abstract_aura_token_density_per_1k` / `cultural_shorthand_clash_hits` / `withhold_beat_present`（反 B/G/P 补充 + P-补充2）** / **`background_dump_blocks_over_120` / `memory_infusion_exposition_hits`（反 P-补充7）** / **`micro_emotion_template_repeat_hits`（反 E-补充8）** / **`first_chapter_oath_closure_hits`（反 N-补充2）** / **`detail_density_std` / `detail_density_flat_run_max` / `ornament_overflow_hits`（反 B-补充5）** / **`emotion_temp_range` / `flat_affect_streak_max` / `reaction_modality_variety`（反 E-补充9）** / **`era_lexicon_collision_hits` / `modern_metaphor_unanchored_hits` / `cross_era_bridge_present`（反 G-补充4）** / **`persona_crack_template_hits` / `decorative_crack_hits` / `crack_followup_payoff_hits`（反 O-补充2）** / **`symmetry_closure_hits` / `closure_neatness_score` / `anti_closure_noise_present`（反 N-补充3）** / **`single_mode_streak_max` / `para_function_type_count` / `micro_closeup_ratio`（反 C-补充2）** / **`dialogue_subtext_misalignment_hits` / `fully_matched_qa_chain_max`（反 I-补充）** / **`weirdness_seed_type`（反 P-1 题材化）** / **`chapter_pacing_matrix`（`relation_tension` / `mc_info_delta` / `chapter_mood` / `ending_hook_type`）** / **`romance_arc_step` / `friendship_arc_step` / `romance_step_delta_from_prev` / `friendship_step_delta_from_prev` / `relationship_progression_beats` / `relationship_jump_without_cause_hits` / `relationship_jump_with_cause_hits` / `post_jump_emotional_turbulence_hits`（反 E-扩展6）** / **`combat_target_ratio` / `combat_presence_hits` / `protagonist_distinctive_traits_count` / `protagonist_initiative_conflict_hits` / `protagonist_impulse_or_humor_hits` / `protagonist_template_similarity_hits`（反 E-扩展7）**）
  - 本章配角自主议题候选（D-2）
  - 软分布层滑窗：`style_temperature_band` / `human_noise_hits` / `clean_closure_hits` / `exposition_density_band` / `dialogue_mismatch_ratio`（用于绿线偏离校准，不是回滚硬门）
- 相关模块的输出 schema

**生成期硬约束明文（必须嵌入内部 prompt）：**

| 条款 | 硬约束 | 命中后处理 |
|---|---|---|
| C | 最长连续单句段 ≤ 2；占比 ≤ 0.3；≥ 6 连续或 > 0.5 占比 → 回滚 | 回 plot-design 重写段长结构 |
| **D-1** | 闲笔 ≥ 5 处 / 章；其中 ≥ 2 处与剧情完全无关（未来 5 章不回收） | < 3 处或全部被回收 → 回 plot-design |
| **D-2** | ≥ 1 位配角有 ≥ 80 字"与主角无关的自主议题" | 全配角围绕主角 → 回 plot-design |
| **D-3** | 选择 / 系统 / 抽奖类机制每 3 次触发 ≥ 1 次选"反直觉 / 废选项" | ≥ 3 次全最优 → 回 plot-design |
| **D-4** | 限知下 `narration_buffer_marks` 达 `write-protocol` 地板；`clip_style_chain_max ≤ 2`；`d4_pov` 如实 | 分镜体硬连打 ≥3 或缀笔未达 → 回 excitement-and-craft / plot-design |
| E | 情绪词不得独段 + 不得粗体 | 独段+粗体 ≥ 1 即回滚 |
| E+2 | signature 明牌指认单章 ≤ 1 次 | 超限即禁用下章再指认 |
| G+1 | 9 种定义体模板单章 ≤ 2 次；≥ 5 次回滚 | 整章回 plot-design 重写 |
| G-细 | 设定首现只带 ≤ 1 项结构信息；同次发言设定专名 ≤ 1 | FAIL 即拆段重写 |
| K | 长段（> 80 字）≥ 3，其中 ≥ 1 段 > 120；单句段占比 ≤ 30% | 全章 0 长段即回滚 |
| M | 每条爽点必带 delay / denied / cost 打断 | 缺失即 memory PERSIST 拒收 |
| N | 段落具象度方差 ≥ 0.8；至少 1 亮句 + 1 粗糙句 | 成稿后挑 1 亮化 + 1 粗化 |
| N-细 | 全章粗体 ≤ 1 且仅限物理文本 | 情绪 / 主题用 ≥ 1 即回滚 |
| O | 关键角色首登章 ≥ 1 处灵魂渗透；出场 ≥ 2 次角色每次 ≥ 1 处；渗透必须非功能性（deletion_verified）；**O-补充**：人物镜头配重声明 + 关键角色重点镜头 + 对景写人；**O-在场**：`meta_language_hits` = 0（禁上一章/读者/作者/弹幕等元叙事） | 关键角色首登违反 → 回 story-blueprint 补 soul_fields → 回 plot-design 重写；镜头同质化（`equal_treatment_flatness_hits ≥ 1`）→ 回 excitement-and-craft 调整配重；**元叙事 ≥ 1** → 回 plot-design 全文检索清零 |
| **A（含 A-补充）** | 节拍器外：章首 ≈200 字须有刺点钉子；`curiosity_gap_markers` ≥ max(2, chapter_word_count//1200)；`flat_atmosphere_streak_max` ≤ 5；`opening_hook_spike` = true | 任一违反 → 回 plot-design 重写章首或全章补缝隙 |
| **G（补充）** | `system_prompt_template_hits` ≤ 2；`tech_jargon_density_per_1k` ≤ 8；`tech_exposition_block_over_120` ≤ 1 | 模板腔或技术白皮书化超阈值 → 回 plot-design 拆解与降密 |
| **P（补充）** | `coincidence_chain_hits` ≤ 3；`forced_detour_hits` ≤ 1（推荐=0） | 巧合闭环过快或强导向超阈值 → 回 plot-design 加主动代价节点 |
| **P-补充2** | `cultural_shorthand_clash_hits` ≥ 1；`withhold_beat_present` = true | cultural = 0 → 回 plot-design 补「共有符号×对抗动作」；withhold false → 补收束节拍后再 PERSIST |
| **P-补充7** | `background_dump_blocks_over_120` = 0；首章 `memory_infusion_exposition_hits` = 0 | 背景灌输块命中 → 回 plot-design 做分批信息投放；首章记忆涌入式设定投喂 → 回滚级退回 |
| **E-补充8** | `micro_emotion_template_repeat_hits` ≤ 1 | 同构微表情跨角色复用 ≥ 2 → 回 excitement-and-craft 做角色差异化 |
| **N-补充2** | 首章 `first_chapter_oath_closure_hits` = 0 | 首章章尾宣言式闭合命中 → 回 plot-design 改为动作后果收束 |
| **B（补充）** | `lexeme_cluster_repeat_hits` ≤ 3；`abstract_aura_token_density_per_1k` ≤ 10 | 词簇复读超阈值 → 回 plot-design 做抽象词去同构 |
| **P-1** | 本章 ≥ 1 处"怪异预算"（剧情无法吸收的设定 / 场景 / 细节） | 缺失 → 回 story-blueprint 补世界观 |
| **P-3** | 本章 ≥ 1 处"延迟兑付"伏笔（≥ 5 章内不回收；章末不得提示这是伏笔） | 缺失 → 回 plot-design |
| **P-4** | 动笔前必须落盘 5-清单到 `<project_root>/state/anti-trope-log.md`；真实写的接续 ≠ 前 3 名 | 违反 → 回 plot-design 重做 anti-trope 预声明 |
| **Q** | 每次场景切换必须声明使用 5 类桥（感官 / 物件 / 对话打断 / 摩擦点 / 情绪错位）之一 + 锚点；禁用转场词清单零容忍 | ≥ 2 次禁用词 / 任一"瞬移切换" → 回 plot-design 重写转场 |
| **R** | `exclusion_enum_hits` = 0；`tutorial_microstep_chain_max` ≤ 4；`catalog_afterthought_pairs` = 0 | **R-1**：排除式枚举 ≥ 2，或 1 次且与同段 G+1 叠加 → 回滚；**R-2**：微步链 ≥ 5 → 回滚；**R-3**：验收式对句命中 ≥ 1 组且无心理插入 → 回滚 |
| **R-补充** | `contrastive_negation_hits` = 0 且 `keyzone_contrastive_negation_hits` = 0 | **任一 ≥1** → 回滚（全文清零「不是…是…」系骨架，见 `anti-ai-tells.md` · R-补充） |
| **K-补充** | 显著时空跳变须 Markdown 空行分段；`k_scene_block_violations` ≤ 2 | **≥ 5** → 回滚（与 Q 瞬移叠加从严） |

**段落默认构成铁律（反 C 强化）**：
- 默认一段 = 2–5 句；单句成段必须有显式理由（情绪顶点 / 打断 / 转场锚点 / 对话重击）。
- 连续 3 次想按 Enter 换行都是短句时，**第 3 次必须并段**。
- 不得出现"一动一行 / 一问一行"的连写形式。

**禁用转场词（反 Q 零容忍明文）**：
> 就在这时 / 与此同时 / 然而就在 / 就在他以为 / 三天后 / 第二天 / 一个星期后 / 半个月过去 / 时间一晃 / 转眼间

（出现在正文正常叙事中即 FAIL；嵌在对话 / 心理独白中且同场景内被反讽或二次否定的例外。）

生成后必须跑 plot-design 的正文输出前自检（25 条全检 + 转场桥声明 + **统计清单全 PASS，含 O-在场 / A-补充 四项**），通过后交给 `memory` · PERSIST 落盘。

**绿线分布校准（不触发回滚）**：
- 每章先声明 `style_temperature_band`：`cold` / `rough` / `loose` / `wry`。
- 章后记录：`human_noise_hits`（人性噪声命中）/ `clean_closure_hits`（教科书式闭合命中）/ `exposition_density_band`（low/mid/high）/ `dialogue_mismatch_ratio`（问答错拍比例）。
- 建议同步记录：`detail_density_std` / `detail_density_flat_run_max` / `emotion_temp_range` / `flat_affect_streak_max`（用于识别“过稳工整感”）。
- 若同一指标连续 3 章偏离目标区间，只做“下一章纠偏动作”提示，不得把绿线当回滚借口。

## 9. 交付前自检

- [ ] 违反 §2 公理？
- [ ] 矛盾先于剧情？主角主动？第一个爽点可指？
- [ ] 反 AI 味 **18 主条款 + 7 子条款（25 项）** 全部 PASS？
- [ ] 无任何"回滚级 FAIL"？（D-1 / D-2 / D-3 / **D-4** / M / N / N-细 / O / **O-在场 meta_language** / **A-补充 钩子·缝隙·纯氛围峰** / P-1 / P-3 / P-4 / **P-补充2 cultural = 0** / **P-补充7 首章记忆灌输命中** / Q 禁用词 / Q 瞬移切换 / **R 排除枚举 / R 教程体链 / R 验收对** / **R-补充「不是…是…」系 ≥1** / G+1 ≥ 5 / E 独段+粗体 / **E-补充8 微表情模板复用过密** / K 全 0 长段 / **K-补充 场景块违规 ≥ 5** / C ≥ 6 连续或占比 > 0.5 / **N-补充2 首章宣言式闭合**）
- [ ] 关键角色首登章 ≥ 1 处灵魂渗透？出场 ≥ 2 次有名角色每次 ≥ 1 处？反派有第三维度？动物独立反应占比 ≥ 50%？渗透句通过"删除验证"？
- [ ] 9 种定义体模板命中 ≤ 2？全章粗体 ≤ 1 且仅用于物理文本？
- [ ] 长段（> 80 字）≥ 3 段（含 ≥ 1 段 > 120 字）？单句段占比 ≤ 30%？连续单句段 ≤ 2？
- [ ] 闲笔 ≥ 5 处？其中 ≥ 2 处剧情无关？≥ 1 位配角有 ≥ 80 字自主议题？（含系统 / 选择机制时）本章 ≥ 1 次"废选项"？**D-4**：`narration_buffer_marks` / `clip_style_chain_max` / `d4_pov` 与 `write-protocol` 一致？
- [ ] 本章含 ≥ 1 处"怪异预算"（剧情无法回收）+ ≥ 1 处"延迟兑付"（≥ 5 章不兑付）？
- [ ] `<project_root>/state/anti-trope-log.md` 是否已落盘本章 5-清单？真实接续 ≠ 前 3 名？
- [ ] 每次场景切换是否声明了桥类型（Q-1~Q-5）与锚点？禁用转场词出现 ≤ 0 次？
- [ ] **R**：无「不是…不是…是」生活流目录？**无「不是…，是… / 不是…、是… / 不是…也不是…是…」等 R-补充 对照句**（`contrastive_negation_hits` = 0 且 `keyzone_contrastive_negation_hits` = 0）？单段纯微动作 ≤ 3？无验收式双短句？`exclusion_enum_hits` / `tutorial_microstep_chain_max` / `catalog_afterthought_pairs` 达标？
- [ ] **K-补充**：跨 30 分钟或换地点是否空行分段？`k_scene_block_violations` ≤ 2？
- [ ] **O-在场**：全文无「上一章/下一章/读者/作者/弹幕」等元叙事？`meta_language_hits` = 0？
- [ ] **A-补充**：章首有刺点钉子？`opening_hook_spike`；好奇缝隙达标？`curiosity_gap_markers`；纯氛围连段峰 ≤ 5？
- [ ] 已先询问并记录占比：`romance_target_ratio` / `erotic_tension_target_ratio` / `explicitness_target_ratio` / `combat_target_ratio`？
- [ ] 若为首章且感情/色情目标占比 > 0：前 800 字是否已有至少 1 处“关系高压触点”？
- [ ] 已输出 E-扩展4 风控面板且字段完整？（`romance_target_ratio` / `erotic_tension_target_ratio` / `explicitness_target_ratio` / `combat_target_ratio` / `suggestive_erotic_risk_hits` / `explicit_sexual_content_hits` / `high_risk_relationship_hits` / `chapter1_tension_hook_present`）
- [ ] **E-扩展4** 是否严格 PASS？（`explicit_sexual_content_hits == 0`、`high_risk_relationship_hits == 0`、`suggestive_erotic_risk_hits` 未超占比档位上限）
- [ ] **G-补充**：系统提示模板命中 ≤ 2？技术术语密度 ≤ 8/千字？技术长说明段 ≤ 1？
- [ ] **P-补充**：巧合链条 ≤ 3？强导向 `forced_detour_hits` ≤ 1（推荐 0）？
- [ ] **P-补充2**：`cultural_shorthand_clash_hits` ≥ 1？`withhold_beat_present` = true？
- [ ] **P-补充7**：`background_dump_blocks_over_120` = 0？若 chapter 1，`memory_infusion_exposition_hits` = 0？
- [ ] **E-补充8**：`micro_emotion_template_repeat_hits` ≤ 1？
- [ ] **N-补充2**：若 chapter 1，`first_chapter_oath_closure_hits` = 0？
- [ ] **B-补充5 / E-补充9 / C-补充2**：`detail_density_flat_run_max` ≤ 4、`emotion_temp_range` ≥ 0.25、`para_function_type_count` ≥ 4？
- [ ] **G-补充4 / O-补充2 / N-补充3**：`modern_metaphor_unanchored_hits` = 0、`decorative_crack_hits` = 0、高工整收束时已落 `anti_closure_noise_present = true`？
- [ ] **绿线分布**：本章 `style_temperature_band` 已声明？`human_noise_hits` / `clean_closure_hits` / `exposition_density_band` / `dialogue_mismatch_ratio` 已回填并与近 3 章做偏离说明？
- [ ] **B-补充**：词簇复读 ≤ 3？抽象气场词密度 ≤ 10/千字？
- [ ] 项目型正文已走 memory LOAD/PERSIST？（仅一次性短文声明可豁免）所有落盘路径都以 `<project_root>/` 开头？
- [ ] 改写类任务给足原文→改写→理由？

未通过内部重写；重写 2 轮仍不通过 → 交付时连问题一起明示。

## 10. skill 目录结构（本仓库自身，不是用户项目）

```
xt-webnovel-writing/                    ← skill 根（= baseDir）
├── SKILL.md                            ← 本文件：OpenClaw 唯一入口
├── README.md
├── references/
│   ├── anti-ai-tells.md                ← 反 AI 味 18 主 + 7 子条款（25 项，含 D / O / P / Q / R 回滚级）
│   ├── openclaw-hooks-setup.md         ← OpenClaw hooks 启用与验证
│   ├── openclaw-hooks-config.example.json ← OpenClaw hooks 配置示例
│   ├── openclaw-strict-rules.md        ← SOUL/全局规则：强制先用 skill + 两阶段 + 固定目录契约
│   └── foxsan-webnovel-manual.md       ← 方法论底本
├── hooks/
│   └── two-phase-guard/                ← OpenClaw internal hook（提醒两阶段 + PERSIST 顺序）
│       ├── HOOK.md
│       └── handler.ts
├── webnovel-text-analysis/workflow.md
├── webnovel-story-blueprint/workflow.md
├── webnovel-plot-design/workflow.md
├── webnovel-excitement-and-craft/workflow.md
├── webnovel-pitfalls/workflow.md
└── webnovel-memory/
    ├── workflow.md
    └── references/                     ← memory 专属（目录 schema / 读写协议）
        ├── directory-schema.md
        ├── read-protocol.md
        └── write-protocol.md
```

## 11. 项目目录契约（用户项目，必守）

### 11.1 project_root 决策规则

1. **优先级**：用户显式指定 > `book.yaml` 已有字段 > 当前工作目录下同名文件夹 > 新建。
2. `project_root` 必须是一个**绝对路径或相对当前工作目录的相对路径**的目录。一旦确定，本次会话**永久锁定**，写入 `<project_root>/book.yaml` 的 `project_root` 字段。
3. 目录名由用户或 agent 决定，但**子目录结构固定**，不可改名、不可省略、不可新增。
4. 用户未指定路径时，统一默认创建到：`./webnovel-projects/<book_title_slug>/`（避免每次散落在不同自定义目录）。

### 11.2 固定子目录（memory · INIT 必须一次性建好）

```
<project_root>/                          ← 用户的一本小说项目，名字由 AI 或用户定
├── book.yaml                            ← 书籍元数据（含 project_root 锁定字段）
├── fingerprint.md                       ← 作者指纹
├── bible/                               ← 世界观圣经（静态设定）
│   ├── world.md
│   ├── power-system.md
│   ├── factions.md
│   └── glossary.md
├── characters/                          ← 人物卡（一人一文件）
│   ├── _index.md
│   └── <name>.md
├── arcs/                                ← 剧情弧
│   ├── _index.md
│   └── arc-<NN>-<slug>.md
├── chapters/                            ← 正文章节（SFNC：chNNNN_短标题.md，仅 H1+正文）
│   └── ch0001_xxx.md, ch0002_xxx.md, …
├── state/                               ← 动态状态（每章更新）
│   ├── chapter_meta/                    ← 每章 chNNNN.yaml（与正文分离）
│   ├── timeline.md
│   ├── relationships.md
│   ├── foreshadow.md
│   ├── power-level.md
│   ├── used-excitement.md
│   ├── used-patterns.md
│   ├── open-threads.md
│   └── anti-trope-log.md                ← 新增：每章 P-4 的 5-清单 + 怪异预算 + 延迟兑付清单
├── index/                               ← 项目导航索引（每卷一个）
│   └── volume_<VOLUME_NO>_index.md
└── .webnovel-memory/                    ← 内部元数据（agent 不直接用）
    ├── version.json
    └── last-write.json
```

### 11.3 路径契约（所有 workflow 必须遵守）

| 产物类型 | **唯一允许的落点** |
|---|---|
| 书籍元数据 | `<project_root>/book.yaml` |
| 作者指纹 | `<project_root>/fingerprint.md` |
| 世界观设定 | `<project_root>/bible/<...>.md` |
| 人物卡 | `<project_root>/characters/<name>.md` |
| 剧情弧 | `<project_root>/arcs/arc-<NN>-<slug>.md` |
| 章节正文 | `<project_root>/chapters/ch<NNNN>_<短标题>.md`（4 位零填充 + 短标题，SFNC；文件内仅 H1+正文） |
| 章元数据 | `<project_root>/state/chapter_meta/ch<NNNN>.yaml`（`chapter_meta` 全量，含 stats） |
| 动态状态 | `<project_root>/state/<...>.md` |
| 反套路日志（P-4） | `<project_root>/state/anti-trope-log.md` |
| 索引 | `<project_root>/index/<...>.md` |

**子 workflow 禁止**：在 `<project_root>` 之外落盘、在 `<project_root>` 下新增上表以外的子目录、用 `webnovel-*` 仓库内目录存放用户项目内容、用 `output/` `drafts/` `tmp/` `generated/` 等"顺手"目录名。

memory · PERSIST 落盘前必做的路径校验伪代码：

```
for path in files_to_write:
    assert path.startswith(project_root + "/"), "路径不合契约"
    assert 第一层子目录 in {"book.yaml","fingerprint.md","bible","characters","arcs","chapters","state","index",".webnovel-memory"}, "非法子目录"
```

违反 → PERSIST 直接拒收，返回 agent 说明"路径契约违反"。

本 skill 不进行任何网络请求；所有执行由 agent 的 Read / Write / Edit / Shell 工具完成。
