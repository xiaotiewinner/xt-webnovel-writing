---
name: webnovel-plot-design
description: 生成网文剧情结构：开头章节骨架、矛盾驱动的剧情段、八步事件法节奏、章节正文草案。触发于用户要求"写开头 / 前几章 / 切入点 / 第一章怎么写 / 剧情怎么推 / 节奏 / 高潮铺垫 / 分剧情 / 这段剧情不顺 / 写正文 / 续写第 X 章"等。强制遵循"矛盾 → 剧情 → 爽点"顺序，并在生成前把反 AI 味 18 主条款 + 7 子条款 · 共 25 项嵌入 prompt 作为硬约束（含 D：世界自主生活 + 配角自主议题 + 废选项戏剧化 + **D-4 句法缀笔（反剪辑体）**；含 O：关键角色首次登场即须灵魂渗透；含 P：怪异预算 + 延迟兑付 + 反套路 5-清单预声明；含 Q：5 类转场桥 + 禁用转场词 + 摩擦点必填；含 **R：说明书式排除枚举 + 教程体微动作链 + 验收式对句**；含 **K-补充：显著时空跳变必须 Markdown 空行分段**；含 G-扩展 1 九种定义体模板禁用；含 E / N-细化 情绪词与主题句禁粗体；含 G-细化 角色 PPT 直讲禁令）；项目正文任务默认必须先调用 webnovel-memory · LOAD 拉上下文，生成完调用 PERSIST 落盘（仅一次性短文可跳过）。所有产物严格遵守 SKILL.md §11 项目目录契约（chapters/ / characters/ / arcs/ / state/ / bible/ / index/），不允许在契约外落盘。触发词：开头、前几章、第一章、剧情、节奏、八步、切入点、续写、接着写、写第 X 章、写正文、outline、draft prose。
metadata: {"openclaw":{"emoji":"🎬","os":["darwin","linux","win32"]}}
---

# 剧情设计 Agent · 矛盾驱动 + 八步节奏

## 铁律（不可违反）

1. **先矛盾，后剧情，最后爽点**。矛盾不清则拒绝产出。
2. **主角主动**。任何"主角随便走走 / 碰巧遇到"的桥段改为"主角为 X 目的主动前往"。
3. **每段剧情必须能用八步事件法至少对上 4 步**，否则打回自己重写。
4. **反 AI 味必读**：启动生成前加载 `../references/anti-ai-tells.md`，把 A–R 主条款 + B / E / G / H / N / D / P 的 7 个子条款（共 18 主 + 7 子 = 25 项）全部嵌入 prompt 作为硬约束，生成后逐项自查。其中 **D（世界无自主生活 · 回滚级）**、**M（爽点链条过完整）**、**N（质量曲线过稳定）+ N-细化（粗体主题句）**、**O（角色灵魂缺位）**、**P（剧情算法化 · 回滚级）**、**Q（转场机械 · 回滚级）**、**R（说明书句法 · 回滚级）**、**K-补充（场景块空行 · 回滚级）**、**G-扩展 1（9 种定义体模板）**、**E-情感标签独段 / 粗体**、**G-细化（角色 PPT 直讲）** 是元层级 / 回滚级硬门，单独 FAIL 即视为整体失败并按相应等级回滚。
5. **正文默认走 memory（新书也适用）**：当 `output_mode == draft_prose` 时，生成前必须先调 `webnovel-memory`（有 `project_root` 则 LOAD；无则先 INIT 再 LOAD），生成后必须调 PERSIST 落盘。仅用户明确声明"一次性短文，不建项目、不留记忆"时可跳过。
6. **项目目录契约**：所有产物按 SKILL.md §11 的固定子目录落盘（`chapters/chNNNN_短标题.md` / `state/chapter_meta/chNNNN.yaml` / `characters/<name>.md` / `arcs/arc-<NN>-<slug>.md` / `state/...` / `bible/...` / `index/...`）；禁止在 `project_root` 之外或契约外子目录写文件。违反者 PERSIST 直接拒收。
7. **P-4 反套路预声明**（draft_prose 必跑）：动笔前将"当前场景最常见 5 种接续 + 真实要写的接续（必须 ≠ 前 3 名）"写入 `state/anti-trope-log.md`，未落盘不得进入正文生成。
8. **Q 转场桥预声明**（draft_prose 必跑）：每一次场景 / 时间切换必须在章纲阶段标记使用哪类桥（Q-1 感官 / Q-2 物件 / Q-3 对话打断 / Q-4 摩擦点 / Q-5 情绪错位）及其锚点，未声明不得下场。

## 输入契约

```yaml
blueprint_ref: <来自 webnovel-story-blueprint 的立书档案；缺失则先补>
author_fingerprint: <来自立书档案 STEP 6；空则打回>
stage: opening | mid_arc | climax | ending | tiny
arc_goal: <本段剧情要解决主线第几层矛盾，例如 L1 身份 | L2 实力>
length_scale: tiny（单场景）| small（3–5 章）| medium（1 个完整 arc）| large（跨 arc）
output_mode: outline | draft_prose   # outline=骨架；draft_prose=正文草稿
target_chapter: <整数；output_mode=draft_prose 时必填>
project_root: <绝对路径；若作品已有 webnovel-memory 目录则必填>
constraints: <用户给定的硬约束，如"不能死人""必须有双女主登场"等；可空>
```

`author_fingerprint` 为空时拒绝生成正文（`output_mode=draft_prose`），但允许生成骨架。

## 项目持久化 memory 接入（output_mode = draft_prose 时强制）

当 `output_mode == draft_prose` 且未被用户明确豁免 memory：

1. **生成前**调用 `webnovel-memory` · LOAD(project_root, target_chapter)
   - 得到"记忆快照"（预算 ≤ 4800 字，见 `webnovel-memory/references/read-protocol.md`）
   - 把快照中的"必须承接 / 必须规避 / 活跃角色状态 / 作者指纹"整段并入本章 prompt
2. **生成后**调用 `webnovel-memory` · PERSIST(chapter_body, chapter_meta)
   - 其中 `chapter_meta` 由本 skill 生成正文时同步产出，至少含：arc / pov / locations / characters_present / excitement_types / plot_nodes / hooks_planted / hooks_resolved / power_changes / new_characters / new_locations / new_items / new_glossary / summary
   - PERSIST 的 8 步落盘（含 STEP 0 路径契约校验）+ 一致性检查全部 PASS 才算交付成功

绕过 memory 直接写章（且无用户豁免）→ 拒绝交付。

## 三个生成场景

根据 `stage` 选分支。每个分支的输出 schema 不同，不允许混用。

---

## SCENARIO A · 开头段骨架（stage = opening）

### 设计原则
开头段 = 主线 L1 矛盾的完整八步缩影。目标是让读者在前 5 章内经历"小冲突 → 小爽点 → 升级冲突 → 小高潮 → 外部大冲击"的闭环。

### 动作
1. 从 `blueprint_ref` 抽取：切入点事件 / L1 矛盾 / 主角缺点 / 书名预示的第一个爽点。
2. 把 L1 矛盾切成 5 章，每章承担八步的一到两步：
   - 第 1 章 = 八步 1（开局） + 小胜（八步 3 的压缩版）
   - 第 2 章 = 八步 2（升级）+ 信息嵌入（把世界观分散埋）
   - 第 3 章 = 八步 4（转折）+ 第二次小爽点
   - 第 4 章 = 八步 5（调整）+ 大剧情预警
   - 第 5 章 = 八步 6-7（爆发+高潮）+ 大钩子留白
3. 每章必须填完下列字段。任何字段为空 → 不可输出。

### 输出 schema

```markdown
## 开头 5 章骨架 · 《书名》

- L1 矛盾（来自立书档案）：
- 书名预示的第一个爽点：
- 主角缺点（缺点如何在这 5 章里被反复使用）：

### 第 1 章
- 承担八步：1 + 3-压缩
- 切入点事件具象化：
- 主角登场方式（≤200 字内）：
- 本章小矛盾：
- 本章小爽点（读者在哪一段感到满足）：
- 代入感安排（画面感起点 / 情感绑定点）：
- 结尾钩子：

### 第 2 章
- 承担八步：2
- 新增信息（世界观分散嵌入 1–2 条）：
- 本章次要矛盾（升级方式）：
- 小爽点：
- 结尾钩子：

### 第 3 章
- 承担八步：4
- 转折来源（让第 1 章的"小胜"变得不可靠）：
- 第二次爽点（不同于第 1 章类型，避免同类爽点重复）：
- 结尾钩子：

### 第 4 章
- 承担八步：5
- 主角的目标 / 手段调整：
- 外部冲击预警（第 5 章大剧情的种子）：
- 本章唯一爽点（避免过度）：
- 结尾钩子：

### 第 5 章
- 承担八步：6 + 7
- 大危机具象：
- 高潮场面（画面感 + 爽点类型）：
- 留给后续的大钩子（必须比第 1 章钩子更大）：
```

### 自检
- [ ] 主角在第 1 章的前 200 字内出场。
- [ ] 第 1 章出现了书名对应的第一个爽点。
- [ ] 第 1–3 章的爽点不是同类型（避免武力-武力-武力这种堆叠）。
- [ ] 第 5 章的钩子大于第 1 章。
- [ ] 没有一章的主角动作链是"走-看-碰到"。

---

## SCENARIO B · 中段 Arc 骨架（stage = mid_arc）

### 设计原则
中段 = 一个完整 arc = 一次完整八步事件法。用于主线 L2–L4 任一层的推进。

### 动作
1. 对应 `arc_goal` 选定本 arc 的矛盾。
2. 按八步切分，每步标注主角动作、场面重心、爽点类型。

### 输出 schema

```markdown
## 中段 Arc · 《书名》· 目标：解决 [L?] 的矛盾

- 本 arc 矛盾句：
- 继承自上一 arc 的遗留钩子：

| 步 | 名称 | 主角动作 | 场面重心 | 爽点类型 | 承接下一步的钩子 |
|---|---|---|---|---|---|
| 1 | 开局 | | | 无 / 微 | |
| 2 | 升级 | | | 无 / 微 | |
| 3 | 虚假解决 | | | 中 | |
| 4 | 转折 | | | 无 / 反差 | |
| 5 | 调整 | | | 微 | |
| 6 | 爆发 | | | 高压 | |
| 7 | 高潮 | | | 极高 | |
| 8 | 结局 | | | 余韵 | |

## 资源消耗表
- 本 arc 引入的新角色：
- 本 arc 揭示的新世界观信息：
- 本 arc 为下一 arc 埋的伏笔：
```

### 自检
- [ ] 八步每步都有内容，不允许合并或跳步。
- [ ] "虚假解决"之后"转折"必须破掉虚假，不能是外部无关事件插入。
- [ ] 高潮步必须明确场面重心（打斗 / 揭秘 / 对峙 / 反转）。

---

## SCENARIO C · 单场景修剧情（stage = tiny / length_scale = tiny）

用户贴来一段现成剧情让你改。

### 动作
1. 先倒推这段剧情承担的矛盾是什么。若用户没说且文本里看不出 → 拒绝改写，反问矛盾。
2. 按下列三栏输出。

### 输出 schema

```markdown
## 场景修订

### 诊断
- 承担的矛盾：
- 八步中对应哪一步：
- 踩到的问题（从下列选）：
  - 主角被动 / 无目标
  - 爽点浮空（没有矛盾铺垫就打脸）
  - 信息密度过高（堆设定）
  - 主角登场过晚
  - 动作链是"走-看-碰"

### 改写对照
| 原文（节选） | 改写 | 改动理由 |
|---|---|---|
| | | |

### 保留与重用
- 原文值得保留的句子：
- 可迁入素材库的描写：
```

---

## 代入感模块（三个分支都会用到）

### 画面感 VR 三步
```
原点（主角所在位置 / 视线起点）
→ 视觉（1 个具体细节）
→ 听觉 / 嗅觉 / 触觉（至少再叠 1 层）
→ 生理反应或情绪反应（闭环）
```

### 情感绑定（需要读者代入主角时使用）
```
主角的身份/能力先写强
→ 立刻写他在乎的人受苦
→ 从关系角色（丈夫/父亲/挚友）的角度描写
→ 主角被迫行动的理由变得不可拒绝
```

## 八步事件法 · 速查表

| 步 | 功能 | 常见错误 |
|---|---|---|
| 1 开局 | 交代主角位置 + 出现危机 | 花太多篇幅背景介绍 |
| 2 升级 | 主角被迫面对 | 主角主动上赶（太容易） |
| 3 虚假解决 | 一度化解 | 做成真正解决 → 后面没法推 |
| 4 转折 | 危机恶化 | 用无关事件插入（不相关） |
| 5 调整 | 主角改方法 | 主角开挂 / 等天降好运 |
| 6 爆发 | 两难抉择 | 只是"更厉害的敌人" |
| 7 高潮 | 全力一击 | 高潮缺场面 / 只写结果 |
| 8 结局 | 安放情绪 + 留钩子 | 写成复盘总结 |

## 章节正文生成（output_mode = draft_prose）

当用户要求把骨架写成正文草案时，除以上步骤外，还必须应用反 AI 味硬约束：

### 写正文前的加载
1. 加载 `author_fingerprint`（偏好动词 / 物象 / 口头禅 / 断句偏好 / 章末钩子偏好）。
2. 加载 `../references/anti-ai-tells.md` 的 18 主条款（A–R）+ 7 子条款（B+ / C / D-1 / D-2 / D-3 / **D-4** / E+1 / E+2 / G+1 / G+2 / G-细 / H+ / N-细 / P-1 / P-3 / P-4 / **P-补充2** / Q-1..Q-5 / **R-1..R-3** / **K-补充**）全部规则。**注：I-补充 / P-补充2 等并入扩展为主条款内细化信号，不额外增加 25 项计数。**
3. **默认必须**调用 `webnovel-memory` · LOAD(project_root, target_chapter) 获取记忆快照，把"必须承接钩子 / 禁用句式 / 禁用爽点类型 / 活跃角色当前状态 + soul_fields / 动物独立反应坐标轴 / live 伏笔（top 3） / 上一章'纯功能性角色名单'与'动物纯工具化名单' / 上一章 used-patterns 命中项（definition_style_hits / bold_theme_hits / emotion_token_solo_paragraphs / emotion_token_bold / single_sentence_run_max / long_paras_over_80 / long_paras_over_120 / signature_明牌超限名单 / setting_reveal_overload_hits / system_prompt_template_hits / coincidence_chain_hits / forced_detour_hits / **cultural_shorthand_clash_hits / withhold_beat_present / dialogue_subtext_misalignment_hits / fully_matched_qa_chain_max / weirdness_seed_type / chapter_pacing_matrix（relation_tension / mc_info_delta / chapter_mood / ending_hook_type） / romance_arc_step / friendship_arc_step / romance_step_delta_from_prev / friendship_step_delta_from_prev / relationship_progression_beats / relationship_jump_without_cause_hits / relationship_jump_with_cause_hits / post_jump_emotional_turbulence_hits**）"全部并入 prompt；仅用户明确声明"一次性短文，不建项目、不留记忆"时可跳过。
4. **反 O 必现清单**：下列任一角色的 `soul_fields` 至少 1 条必须作为**本章必现项**写进 prompt：
   - 本章出场 ≥ 2 次的每个有名角色
   - **本章首次登场的关键角色（主角 / POV / top 5 配角 / 核心反派 / 女主男主）——无论出场几次**
   - 连续 2 章灵魂渗透缺位的任一角色
   非人角色（动物 / 灵兽 / 法宝拟人）则把独立反应坐标轴 ≥ 1 条作为**本章必现项**。
5. **禁用清单明文化**（直接写进 prompt，不允许"原则上不用"这种软表述）：
   - G-扩展 1 九种模板全文列入：`不是 X，是 Y` / `不是 X——是 Y` / `不是那种 A——是 B` / `不是那种 A。是 B` / `不是 A。是某种 B` / `不是对 A 的 X。是对 B 的 X` / `不是 A 的 X。是 B 的 X` / `不是 A 了。是 B 了` / `X，意味着——Y`
   - 全章粗体数 ≤ 1，且仅允许用于**物理文本**（招牌、系统提示、书信）；禁止情绪词、主题句、内心独白加粗
   - 情绪词（恐惧 / 愤怒 / 警惕 / 保护欲 / 饥饿 等）禁止独立成段、禁止以"词 + 句号"形式连列
   - 设定专有名词首次出现禁止在同一对话 / 叙述段内携带 ≥ 2 项结构性信息（规模 / 性质 / 运作 / 历史任选其二）
   - 上一章 used-patterns 命中项转为本章禁用词：上一章 `definition_style_hits ≥ 2` 则本章该结构全部禁；上一章 `bold_theme_hits ≥ 1` 则本章全章禁粗体；上一章 signature 明牌 ≥ 2 则本章该 signature 只许现象级出现

### 章节类型骨架（先定生长方向，再过闸门）

先判本章主类型（可 1 主 1 副，不可 2 主并列）：

| 章节类型 | 主目标 | 必须抖动点 | 禁止模板化 |
|---|---|---|---|
| 关系推进章 | 关系状态发生可感变化（靠近/后撤/误读/重估） | 至少 1 次“台词与内心错位” + 至少 1 次“动作后悔/补救” | 靠近→触碰→异能触发→中断→撤退 的镜像复用 |
| 伏笔埋设章 | 只埋不兑付，推进疑问债 | 至少 1 处“可见异常但不解释” + 1 处“拒展示收束” | 当章解释完新设定、章末明牌提示“这是伏笔” |
| 战斗/对抗章 | 决策与代价，不是纯结果 | 至少 1 次非最优选择 + 1 次节奏打断（delay/denied/cost） | 四步算法链（观察→判断→调整→成功）整段直出 |
| 世界展开章 | 增加世界自主生活密度 | 至少 1 位配角自主议题（≥80字） + 至少 2 处剧情无关闲笔 | 设定打包讲解/PPT 化陈述 |

**反镜像硬门（生成驱动）**：
- 若与上一章主类型相同，必须在“冲突触发点”或“收束方式”至少变更 1 项，并在草稿注释写出：`variation_point`。
- 若近 2 章出现同一“场景骨架序列”（如靠近→触碰→能力触发→撤退），本章必须改为“错位对话先行”或“外部事件先行”，不得复用镜像节拍。

### 写正文前的十八项闸门（未通过不得开写）
0. **占比确认闸门（新书/设计/续写必问）**：开写前必须先确认并记录 `romance_target_ratio` / `erotic_tension_target_ratio` / `explicitness_target_ratio` / `combat_target_ratio`。若用户未给值，先追问；仅在用户明确拒答时可落默认 `20% / 8% / 0% / 15%`。若用户不回复占比细节，必须按题材给出“基础刺激提案”并在本章执行（关系高压触点或有效打戏至少一项）。
1. **词簇闸门**：`lexeme_cluster_repeat_hits` 近 3 章均值 < 4 且 `abstract_aura_token_density_per_1k` 近 3 章均值 ≤ 10；否则先做“抽象词→具象细节”替换再开写。
2. **模板闸门**：`system_prompt_template_hits` 近 3 章均值 < 3；否则先重写本章系统提示策略（残片化+去同构）。
3. **巧合闸门**：本章章纲 `coincidence_chain_hits` 预估 ≤ 3 且 `forced_detour_hits` 预估 = 0；否则先补主动决策代价节点。
4. **技术闸门**：本章章纲 `tech_jargon_density_per_1k` 预估 ≤ 8 且 `tech_exposition_block_over_120` 预估 ≤ 1；否则先把技术解释拆为体验+残缺信息。
5. **想象力 shorthand 闸门（反 P-补充2）**：章纲内须预标 ≥1 处「读者共有文化/历史/典故/俗语符号 × 具体对抗动作」并置落点，且 ≥1 处「抬高预期 → 拒展示/留白收束」节拍落点；禁止纯【】标题式点名而无动作承载。近 2 章 `cultural_shorthand_clash_hits` 均为 0 时本章该闸门**强制通过档**（预标必须可验收）。
6. **去重闸门（反 B-补充2）**：章纲草稿到正文前必须做段级去重扫描，要求 `near_duplicate_paragraph_pairs` 预估 = 0 且 `max_paragraph_similarity` 预估 < 0.88；若出现重复对话开场，必须提前写明“本次重复带来的新信息”。
7. **模板链闸门（反 P-补充3）**：章纲 `trope_chain_hits` 预估 < 4，且不得形成 `trope_chain_max_run >= 3` 的直线链；若接近高风险，先补 1 个“非收益扰动节点”（误判/岔路/关系反转）再开写。
8. **修辞闸门（反 B-补充3 / E-扩展3）**：章纲预估 `simile_density_per_1k ≤ 10`、`simile_pattern_repeat_hits ≤ 2`，并限制单角色 `signature_tick_overuse_hits = 0`（同 tick 不得作为章首+章尾固定符号）。
9. **首章开胃闸门（反 A-补充 · chapter 1 特判）**：若为新书首章，前 ≈500 字必须预标至少 2 个抓手并置（关系/动作声音/物件处境中任两类），并预埋 1 个“当章不完全兑付”的具体追问债；若 `romance_target_ratio + erotic_tension_target_ratio > 0`，前 800 字还必须预标 ≥1 处“关系高压触点”（靠近/越界边缘 + 误读或克制反噬）；未满足不得开写。
10. **数值化感知闸门（反 B-补充4）**：无仪器场景下，高精度数字细节（角度/厘米/小数）预估命中不得超过 1；超过则先改为体感表达再开写。
11. **系统面板闸门（反 G-补充3）**：完整 A/B/C/D 选项矩阵本章预估 ≤ 1，`【系统块】`预估 ≤ 4；超阈值必须改为残片化提示。
12. **跨题材缝合闸门（反 P-补充4）**：首章强曝光题材轨道 ≤ 2；若已出现职场+系统+修真+悬疑四线并行，必须降到“两强一弱”后再开写。
13. **伏笔装载闸门（反 P-补充5）**：章纲 `foreshadow_pack_density_per_1k` 预估 ≤ 3，`high_priority_foreshadow_count` 预估 ≤ 2；超阈值先删减伏笔再开写。
14. **金句收束闸门（反 N-补充）**：章尾不得预置“总结真理句”；结尾必须优先落在动作后果/未完成动作上。
15. **对照句闸门（反 R-补充）**：**全章零容忍**禁用「不是…是…」「不是…、是…」「不是…，也不是…，是…」「不是…——是…」等否定对照收束（与 `anti-ai-tells.md` · R-补充 / G-扩展 1 同禁）；**任意位置出现即本章不得开写/不得过检**，必须改写完再进入正文或 PERSIST。
16. **感情过审闸门（反 E-扩展4）**：感情/暧昧段允许按用户占比提升强度，但必须是“可过审表达”：禁露骨器官/体液/步骤化性动作；若存在高风险关系元素（未成年人/强迫/权力滥用/血缘），本章禁止进入正文生成。不得以“过审”为由把用户要求的感情/色情张力清零。**本闸门未通过时不得进入草稿写作，不得以“先写后改”绕过。**
17. **反差钩子闸门（反 P-补充6，可选低频）**：默认关闭；仅当本章存在“关系单线化”风险且 `contrast_hook_frequency_10ch ≤ 2`、`contrast_hook_chapter_gap ≥ 3` 时可开启。未满足条件不得启用反差桥段。

### 关系线构思硬约束（爱情 + 友情，题材自适应）
1. **先定感情功能位**：每段感情戏必须标注功能：`推进关系` / `制造代价` / `反转认知` / `加深人设` 四选一（可复合）；未标注不得写入正文。
2. **欲望梯度五级递进**：按 `目光层 -> 距离层 -> 触碰层 -> 气味/呼吸层 -> 后果层` 推进，禁止同章从 1 级直接跳 5 级。
3. **隐晦表达范式**：写“反应与控制失败”而非“部位清单”；优先写喉结/指尖/呼吸/步伐、停顿半秒、环境共振、事后痕迹。
4. **题材占比约束**：玄幻/升级流 15-25%，悬疑/惊悚 10-20%，都市/职场 25-40%，言情主线 45%+ 且每 2-3 章关系状态必须变化。
5. **暧昧场景模板**：优先使用三类模板（危险后处理 / 公共场合失控 / 夜间同空间），且必须含 `触发点 -> 失控瞬间 -> 收束动作 -> 余波` 四步。
6. **角色参数先行**：CP 双方必须先落三参数：`欲望表达方式`、`羞耻触发点`、`亲密边界`；边界未定义前禁止写触碰层以上段落。
7. **不可控噪声必现**：每个关键感情场景至少加入 1 种噪声（误读/嘴硬/回避/延迟回复/说反话后补救）；禁止“每次都正确沟通”。
8. **关系回摆机制**：连续两章至少 1 次“靠近后后撤”或“承诺后迟疑”，防止线性甜化。
9. **双向接住改为“分布约束”**：全章必须同时存在“接住”和“错频”。`bilateral_dialogue_technique_hits` 至少 1 次；但上限跟 `relationship_tacit_band` 走：`low ≤ 1`、`mid ≤ 2`、`high ≤ 3`。禁止全程完美接住，也禁止全程不接住。
10. **反差钩子低频配额**：反差桥段属于“低频可选味精”，10 章内最多 2 次，且启用章节间隔 ≥ 3；禁止把“由恨转爱/敌对转护”当默认主流程。
11. **双轨递进阶梯（反 E-扩展6）**：爱情与友情都按“阶段阶梯”推进，支持负值到正值：爱情 `仇恨→厌恶→戒备→陌生→注意→试探→共担→承诺边缘→稳定亲密`；友情 `死敌→敌对→不信任→陌生→同阵营→互信试用→共担风险→主动维护→生死托付`。默认每章最多前进 1 级；允许短期回摆；允许“恨极转爱/骤然顿悟/友情突变”等非线性跃迁，但必须有触发事件与后果余波，禁止无因跨级。
12. **递进动作落地（反 E-扩展6）**：当章有爱情或核心友情场景时，必须落 ≥1 个“关系递进动作”（承担代价/共享秘密/公开站队/主动维护边界）；仅用台词表态不计入递进。
13. **跃迁三件套（反 E-扩展6）**：若本章关系阶段跃迁 `+2` 及以上，必须同章落地三件套：`触发事件`（可复核）+ `代价后果`（行为/关系成本）+ `情绪余波`（失控/躲闪/嘴硬/反复确认），缺一不得通过。
14. **主角去同质化（反 E-扩展7）**：主角必须预置 ≥3 条“非通用人格特征”（如执拗/黑色幽默/好胜/冒险/嘴硬等），且本章至少 1 处“非纯谨慎”行为（冲动、反讽、主动挑衅、越界尝试之一）；禁止整章只剩“沉默+谨慎+被动观察”。
15. **刺激要素主动触发（反 E-扩展7）**：即使用户未点名，也需在不过审前提下主动落地至少一类刺激要素：`关系高压触点` 或 `有效打戏/对抗（有目标+阻力+代价）`；不得全部回避为“平稳对话”。

### 写正文时的硬手法（全部是反 AI 味 A–R 的落地）

#### 节奏与语言层
1. 每 3–5 段插入一次**节奏抖动**（主角失误 / 闲笔 / 非功能性对话）。（反 A）
2. 同一句式在同场景内出现 ≥ 2 次后必须换写。（反 B）
3. **主语轮替**：同一主语"他 / 她"连续开头段不得 ≥ 3；第 3 段起必须省略主语 / 换视角主语 / 用介词/副词起头。章内 top-1 主语段落占比 ≤ 40%。（反 B-扩展）
4. **句长轮替**：连续 ≥ 4 段的段长标准差必须 ≥ 8 字；每 5 段至少 1 段 > 80 字或含 ≥ 2 分句的复合句。（反 B-扩展 + K）
5. **默认以段落组织文本**：默认一段 2–5 句；单句成段必须有显式理由（情绪顶点 / 打断 / 转场锚点 / 对话重击）。连续 3 次想按 Enter 换行都是短句时，**第 3 次必须并段**。（反 C 强化）
6. **禁止**"第二剑。第三剑。第四剑。"式递增单句成段；需要同动作重复时换维度（角度 / 代价 / 对手反应）。**连续单句成段上限 2 段**（2026-04 收紧）；仅在“情绪顶点/高密对话区”可临时放宽到 3 段，但必须在后续 100 字内补 ≥ 50 字复合段作为呼吸回补；全章 ≥ 3 段丛数 ≤ 2，单句段占比 ≤ 30%。（反 C）
7. **段长硬门**：全章 > 80 字长段 ≥ 3（其中 ≥ 1 段 > 120 字）；单句成段（≤ 15 字）占比 ≤ 30%（2026-04 收紧）。不达标禁止交付。（反 K 硬门）

#### 世界自主生活层（反 D · 回滚级）
7a. **闲笔密度硬门（反 D-1）**：每 300 字至少 1 句"剧情层面删掉也不影响"的非功能描写；全章非功能描写片段 ≥ 5 处 / 6000 字，其中 ≥ 2 处 **5 章内不得被剧情回收**（写作时明确标记）。闲笔 < 3 处 / 章或所有闲笔都被"剧情化回收" → **回滚级 FAIL，退回本 workflow 的人设与场景阶段**。
7a′. **句法缀笔硬门（反 D-4，与 D-1 不同层）**：限知/第一人称下，禁止「分镜体」连拍——短句推进 + 比喻金句对仗、零迟疑；每 ≈1000 字须有加 **迟疑/从句/而则** 等人类缀笔（**禁止** R「不是…是…」）。成稿时填报 `narration_buffer_marks` / `clip_style_chain_max`；`clip_style_chain_max ≥ 3` 或缀笔未达 `write-protocol` 地板 → **回滚级 FAIL**（可转 `webnovel-excitement-and-craft` 整段加缀笔）。
7b. **配角自主议题（反 D-2）**：动笔前为 ≥ 1 位非主角配角预定义"独立议题"（自己的家事 / 八卦 / 烦恼 / 与主角无关的八卦）；在场景中落地 ≥ 80 字或 ≥ 5 轮对话，该议题不得与主角主线挂钩。全章所有配角台词 100% 围绕主角 → **回滚级 FAIL**。
7c. **废选项戏剧化（反 D-3）**：若本章含选择 / 系统 / 抽奖 / 分支机制且触发 ≥ 3 次，至少 1 次主角主动选最差 / 最无意义 / 最反直觉的选项，并用该选择带出性格或世界观细节；3 次以上全选最优 → **回滚级 FAIL**。

#### 想象力与反套路层（反 P · 回滚级）
7d. **反套路 5-清单预声明（反 P-4）**：动笔前在 `state/anti-trope-log.md` 写入本章/本场景最常见的 5 种接续 + 真实要写的接续（**必须 ≠ 前 3 名**，且由主角 / 配角性格驱动）。未落盘或真实接续命中前 3 名 → **回滚级 FAIL**。
7e. **怪异预算（反 P-1）**：本章 ≥ 1 处"剧情无法吸收"的设定 / 场景 / 细节（5 章内不被主线回收）。写作时自问"这个 3 章内会被回收吗？会 = 换一个"。怪异预算连续 2 章 = 0 → 退回 `webnovel-story-blueprint` 补世界观怪异预算池。
7f. **延迟兑付（反 P-3）**：本章 ≥ 1 处伏笔 5 章内不回收；禁止章末用"他不知道的是……"这类独白暗示这是伏笔。
7g. **废选项 / 反直觉选择（反 P-2）**：至少一方（主角 / 配角 / 反派）在本章做 ≥ 1 个由性格驱动的"非最优"选择。

#### 转场层（反 Q · 回滚级）
7h. **5 类转场桥必选**：每次场景 / 时间 / 视角切换必须显式使用下列之一并写出锚点：
    - Q-1 感官桥（同一感官延续：风声 / 气味 / 光线 / 温度）
    - Q-2 物件桥（一个具体物件横跨两场景）
    - Q-3 对话打断桥（有人在上一场景把话说了一半，下一场景才接上 / 永不接上）
    - Q-4 摩擦点桥（中间插一件有阻力的小事：鞋带散了 / 电话响了 / 车没打着）
    - Q-5 情绪错位桥（角色情绪与新场景氛围不搭，且不立刻调整）
    章纲阶段已预声明的桥类型与锚点必须在正文兑现。
7i. **禁用转场词（零容忍）**：`就在这时 / 与此同时 / 然而就在 / 就在他以为 / 三天后 / 第二天 / 一个星期后 / 半个月过去 / 时间一晃 / 转眼间` 在正文中命中 ≥ 2 次 → **回滚级 FAIL**（嵌在对话 / 心理独白中且同场景内被反讽或二次否定的例外）。
7j. **瞬移切换禁止**：上段结束在 A 场景，下段直接在 B 场景，中间无任何桥 → 单次 = **回滚级 FAIL**。
7k. **摩擦点必填**：任何超过 5 分钟场景跨度必含 ≥ 1 处摩擦点（小意外 / 小延迟 / 小错位）。
7l. **桥类型分散**：近 3 章任一桥类型命中 ≥ 3 次 → 本章禁用该类型。

#### 说明书句法 + 场景块分段（反 R + K-补充 · 回滚级）
7m. **禁止生活流排除式目录（R-1）**：禁止在同一段用「不是 A，不是 B，是 C」「既非…也非…而是」组织日常认知；每段对同一对象**最多 1 个否定**再写现象。`exclusion_enum_hits` ≥ 2，或 = 1 且同段 `definition_style_hits ≥ 1` → **回滚级 FAIL**。
7n. **禁止教程体微动作链（R-2）**：同一情绪节拍、无对白、无心理插入时，**单段纯动作微步 ≤ 3**；更多动作须并句或插入走神 / 环境 / 他人半句声。`tutorial_microstep_chain_max` ≥ 5 → **回滚级 FAIL**。
7o. **禁止验收式双短句（R-3）**：「又 / 再 / 然后」串动作后，禁止接两个 ≤ 8 字的纯状态短句各占一行（例：「界面没关。」「白字还在。」）。`catalog_afterthought_pairs` ≥ 1 → **回滚级 FAIL**。
7p. **场景块空行分段（K-补充）**：时间跨 ≥ 30 分钟或换建筑级空间 → 正文 **Markdown 空一行** 起新段（时间 / 地点锚可单独成行再续叙述）。`k_scene_block_violations` ≥ 5 → **回滚级 FAIL**。
7q. **元叙事禁入（O-在场 · 回滚级）**：叙述 / 对白 / 内心**禁止**出现「上一章 / 下一章 / 本章 / 读者 / 作者 / 弹幕 / 评论区」等书籍体外坐标。人物只知道故事内时间——用「刚才 / 昨天夜里 / 前一阵 / 上次点开时」。`meta_language_hits ≥ 1` → **回滚级 FAIL**。
7r. **章首抓眼 + 好奇缝隙（A-补充 · 回滚级）**：章首 ≈200 字内必须有 **刺点钉子**（非常规关系或称谓 + 非常规动作/声音/物件并置，参见 `anti-ai-tells` 小姨子范式）；全章每 800–1200 字须有 ≥1 处**好奇缝隙**（具体信息先抛出、滞后数行再收一小步）；连续纯氛围 / 纯位移段 **≥ 6** → **回滚级 FAIL**。`opening_hook_spike` / `curiosity_gap_markers` / `flat_atmosphere_streak_max` 落盘到 `chapter_meta.stats`。
7ab. **新书首章开胃硬门（A-补充 · chapter 1 特判）**：首章前 ≈500 字须 `series_opening_strike_count >= 2`，且 `opening_question_debt_present == true`；任一不满足 → **回滚级 FAIL**（重写开头，不得以后文补偿替代）。
7s. **系统提示去模板化（G-补充）**：同构提示模板（`【X：Y——Z】`）单章命中 ≤ 2；第 3 次起必须改为角色化残片提示。`system_prompt_template_hits ≥ 5` → **回滚级 FAIL**。
7t. **巧合闭环限速（P-补充）**：连续偶然驱动节点 `coincidence_chain_hits ≤ 3`；达到 3 后后续推进必须改为主角主动决策并付代价。`coincidence_chain_hits ≥ 6` 或 `forced_detour_hits ≥ 2` → **回滚级 FAIL**。
7u. **技术白皮书化限额（G-补充2）**：技术术语密度 `tech_jargon_density_per_1k ≤ 8`；技术说明长段（>120字）`tech_exposition_block_over_120 ≤ 1`；同段完整讲完触发→过程→结果的 `tech_mechanism_closure_hits ≤ 1`。`tech_jargon_density_per_1k > 12` 或 `tech_exposition_block_over_120 ≥ 3` → **回滚级 FAIL**。
7v. **词簇复读限额（B-补充）**：高频抽象气场词簇复读 `lexeme_cluster_repeat_hits ≤ 3`，抽象词密度 `abstract_aura_token_density_per_1k ≤ 10`；`lexeme_cluster_repeat_hits ≥ 7` 或 `abstract_aura_token_density_per_1k > 18` → **回滚级 FAIL**。
7w. **文化 shorthand 贴脸对抗 + 收束节拍（P-补充2 · 回滚级 / 硬门）**：全章须 `cultural_shorthand_clash_hits ≥ 1`（共有符号与对抗动作同场并置，可不用【】；**≠ 旁白堆原创专名讲设定**，与 G-细不冲突）；须 `withhold_beat_present == true`（至少一处抬高预期后的拒展示/留白/一句挡回）。`cultural_shorthand_clash_hits == 0` → **回滚级 FAIL**；`withhold_beat_present == false` → **FAIL（补收束后才可 PERSIST）**。连续 2 章 `cultural == 0` → 下一章本项按回滚级硬门执行（见 `anti-ai-tells` P-补充2）。
7x. **近重复段落硬门（B-补充2）**：全章 `near_duplicate_paragraph_pairs == 0` 且 `max_paragraph_similarity < 0.88`；`near_duplicate_paragraph_pairs >= 1` 或 `duplicate_dialogue_openers >= 1` → **FAIL**；`pairs >= 2` 或 `similarity >= 0.92` → **回滚级 FAIL**。
7y. **模板剧情链限额（P-补充3）**：`trope_chain_hits < 4` 且 `predictability_score != high`；若 `trope_chain_max_run >= 3` 且 `weirdness_budget_count == 0` → **回滚级 FAIL**（必须重排节拍并插入非收益扰动节点）。
7z. **比喻密度与同构限额（B-补充3）**：`simile_density_per_1k ≤ 10`、`simile_cluster_max ≤ 3`、`simile_pattern_repeat_hits ≤ 2`；任一超阈值 → **FAIL**（改为动作/物件证据）。
7aa. **标志动作去符号化（E-扩展3）**：`signature_tick_overuse_hits == 0`，且 `chapter_edge_tick_reuse` 不得连续章复用；同一 tick 单章出现 ≥ 3 次判 **FAIL**。
7ac. **数值化感知限额（B-补充4）**：`hyper_precision_detail_hits ≤ 1` 且 `noninstrumental_numeric_density_per_1k ≤ 6`；无仪器高精度数字持续出现 → **FAIL**。
7ad. **系统面板去模板化（G-补充3）**：`system_option_matrix_hits ≤ 1`、`bracket_system_block_count ≤ 4`；完整选项矩阵 ≥2 次或系统块 ≥7 次 → **FAIL**。
7ae. **跨题材缝合限额（P-补充4）**：`multi_genre_graft_count ≤ 2` 且 `graft_overload_hits == 0`；首章缝合过载命中按 **回滚级 FAIL**。
7af. **伏笔装载限额（P-补充5）**：`foreshadow_pack_density_per_1k ≤ 3` 且 `high_priority_foreshadow_count ≤ 2`；超阈值 → **FAIL**（先降线索密度再写）。
7ag. **金句收束限额（N-补充）**：`golden_closing_line_hits ≤ 1` 且 `maxim_style_summary_hits ≤ 1`；格言体总结句 ≥2 → **FAIL**。
7ah. **对照句全章硬门（R-补充）**：`contrastive_negation_hits == 0` 且 `keyzone_contrastive_negation_hits == 0`；**任一 ≥1 → 回滚级 FAIL**（全文检索清零「不是…是…」系骨架后再检）。
7ai. **感情过审硬门（E-扩展4）**：`explicit_sexual_content_hits == 0` 且 `high_risk_relationship_hits == 0`；`suggestive_erotic_risk_hits` 采用占比驱动上限：`explicitness_target_ratio == 0` 时 `< 2`，`0 < explicitness_target_ratio ≤ 10%` 时 `≤ 2`，`explicitness_target_ratio > 10%` 时 `≤ 3`。`explicitness_target_ratio` 不封顶，但不得突破过审阈值。命中露骨性描写或高风险关系 → **回滚级 FAIL**。**若占比字段缺失或 E-扩展4 面板缺字段，同样按 FAIL 处理且禁止 PERSIST。**
7aj. **感情功能位硬门**：`romance_functional_scene_ratio >= 0.8`（感情段中有明确功能位的占比）；不足 → **FAIL**。
7ak. **欲望梯度硬门**：`desire_gradient_jump_hits == 0` 且 `desire_gradient_coverage >= 3`（同章至少覆盖 3 级）；违规 → **FAIL**。
7al. **模板完整度硬门**：`ambiguity_scene_template_compliance >= 0.7`（暧昧场景四步模板达标占比）；不足 → **FAIL**。
7am. **不可控噪声硬门（E-扩展5）**：`emotional_unpredictability_hits >= 2` 且 `emotion_response_variance_score >= 0.3`；不足 → **FAIL**。
7an. **关系回摆硬门（E-扩展5）**：`affection_flow_reversal_count >= 1`（按章或两章滑窗）；不足 → **FAIL**。
7ao. **双向对话术硬门（E-扩展5，全章分布）**：`bilateral_dialogue_technique_hits >= 1` 且按 `relationship_tacit_band` 满足上限（`low ≤ 1`、`mid ≤ 2`、`high ≤ 3`）；任一违例 → **FAIL**。
7ap. **反差钩子配额硬门（P-补充6）**：`contrast_hook_misuse_hits == 0` 且（若启用）`contrast_hook_frequency_10ch ≤ 2`、`contrast_hook_chapter_gap ≥ 3`；违规 → **FAIL**。
7aq. **关系递进硬门（E-扩展6）**：当章存在爱情或核心友情场景时，`relationship_progression_beats >= 1`；不足 → **FAIL**。
7ar. **关系跳级硬门（E-扩展6）**：`relationship_jump_without_cause_hits == 0`；若 `romance_step_delta_from_prev` 或 `friendship_step_delta_from_prev` 出现 `+2` 及以上，必须满足 `relationship_jump_with_cause_hits >= 1` 且 `post_jump_emotional_turbulence_hits >= 1`，否则 **FAIL**。
7as. **主角去同质化硬门（E-扩展7）**：`protagonist_distinctive_traits_count >= 3`、`protagonist_initiative_conflict_hits >= 1`、`protagonist_impulse_or_humor_hits >= 1` 且 `protagonist_template_similarity_hits == 0`；任一不满足 → **FAIL**。
7at. **主动刺激要素硬门（E-扩展7）**：`combat_target_ratio > 0` 时 `combat_presence_hits >= 1`；若未显式给占比，也必须满足“关系高压触点 >= 1 或 combat_presence_hits >= 1”二选一，未命中 → **FAIL**。

#### 情绪与反应层
8. 情绪表达每用一次形容词必须紧跟一个具体动作或生理反应作为证据。（反 E）
9. **禁止情感标签独段 / 粗体**：情绪词禁止作为独立句子或独立段落出现（"恐惧。愤怒。警惕。"这种全禁）；禁止对情绪词加粗（"**保护欲。**"全禁）。情绪必须嵌入叙述句之中，作为动作 / 生理反应 / 画面的副产品。（反 E · 情感标签式独段）
10. **反派反应禁止标准套餐**（脸色 / 冷汗 / 胸口 / 沉默 / "不可能"）。每个有名有姓角色的 `characters/<name>.md` 必有 `signature_reactions`，本章段落必须至少引用 2 条。反派首次遭遇决定性打击时必须出现一个"不合时宜"的小反应。（反 E-扩展 1）
11. **signature_reactions 明牌化上限**：同一个 signature 反应（耳垂红 / 小指抖 / 摸手腕等）在单章内被"明文指认 + 含义注解"**上限 1 次**。第二次及以后只写现象，不写"X 注意到了 / X 看到了"这类指认语，也不写"她说谎时的习惯"这类解读。（反 E-扩展 2）

#### 设定与能力层
12. 修为 / 等阶 **禁止独段**，必须嵌入场景化呈现 + 代价。（反 F）
13. 设定**禁止 "XX——YY。" 列表式输出**；一次只透一条，通过体感或对白碎片带出。（反 G）
14. **禁止角色 PPT 直讲**：设定专有名词（体系名 / 组织名 / 能力名）**首次出现**时，必须走**体感 / 转述 / 残缺** 三选一；当章不得同时携带"群体规模 + 性质 + 运作方式 + 历史 / 日常 / 识别法"中的 ≥ 2 项。同一角色单次发言不得包含 ≥ 2 个设定专有名词。（反 G-细化）
15. **禁止 9 种定义体模板**（见上表）：`不是 X，是 Y` / `不是 X——是 Y` / `不是那种 A——是 B` / `不是那种 A。是 B` / `不是 A。是某种 B` / `不是对 A 的 X。是对 B 的 X` / `不是 A 的 X。是 B 的 X` / `不是 A 了。是 B 了` / `X，意味着——Y`。**单章命中上限 2 次**；≥ 3 次立即重写对应段；≥ 5 次回滚全章。只能体验式 / 他人转述 / 残缺式。（反 G-扩展 1）
16. **体系 / 典籍 / 地图 / 势力 ≥ 3 项时禁止同章打包讲完**；拆到 ≥ 3 章，每次透露 ≤ 1 项 + 1 句模糊暗示。（反 G-扩展 2）

#### 战斗与思考层
17. 战斗至少植入一次干扰变量（失败 / 超预期 / 自身波动），并嵌入一处战场外感官。（反 H）
18. **主角思考链禁止"观察 → 判断 → 调整 → 成功"四步流程图**；≥ 300 字的主角思考片段必须嵌入至少 1 条**非理性噪声**（误判 / 走神 / 情绪干扰 / 杂念 / 非最优选择），且 1/3 次**没有用处**只是一下停顿。（反 H-扩展）

#### 对话与节点层
19. 每段对话自问"换一个角色说会不会一字不差"；会 → 重写。（反 I）
20. 一章不得 ≥ 3 个类型节点（破阵 / 夺宝 / 升级 / 政治 / 皆敌 …）；超 → 拆章。（反 J）

#### 爽点与质量曲线层
21. **本章爽点链条必须至少被打断一次**，三选一：延迟（奖励没拿到 / 拿到用不了） / 不给（反派不认输 / 当面羞辱） / 代价（当章兑现一个无法补偿的损失）。章纲无打断点 → 拒绝进入正文生成。（反 M）
22. **质量曲线禁止平顺**：每 2000–3000 字出现一次风格偏差——1 句明显跳的金句或 1 段明显"快写过去"的粗糙叙述或 1 处风格切换；全章必须至少存在 1 句"不够好"的句子和 1 句"特别亮"的句子，不得同时缺失。（反 N）
23. **禁止粗体主题句点题**：全章粗体数 ≤ 1；禁止"粗体 + 独立成段 + 情绪 / 感悟 / 判断句"三件套；禁止用粗体标记"他意识到 X" / "他终于明白 Y" / "一切都变了"之类的主题句 / 觉醒句 / 转折句。主题类内容必须埋进正常叙述，不加格式，不单独成段。（反 N-细化）

#### 角色主体性层（反 O）
24. **关键角色（主角 / POV / top 5 配角 / 核心反派 / 男女主）首次登场章必有灵魂渗透**，不因出场次数豁免。未渗透 → 回滚级 FAIL，退回 story-blueprint 补 soul_fields 再重写本章。
25. **每个本章出场 ≥ 2 次的有名角色**必须有至少 1 处"灵魂渗透段"——一个不推动剧情、不解释、不兑现的细节，把其 `soul_fields`（core_wound / private_desire / contradictory_belief / unreasonable_preference）之一**被偶然看见**。示例："柳长风说话前先揉了揉右手腕"（旧伤，从未对人提起）。**把该句删除后剧情推进不受影响**才算数——有功能性的不算"渗透"。
26. **动物 / 灵兽 / 法宝拟人**不得在全章段落 100% 服务于主角意图。至少有一次：与主角情绪不同步、自己私下做一件与剧情无关的事、有一个非本能偏好。禁止"点头 / 摇头 / 预警 / 救主"当作角色完整刻画。
27. **反派**当章所有行动与台词不得折叠为"想赢 / 恨主角"两项。必须有一处"与主角无关、与权力无关"的第三维度露脸——可以只是一个动作、一句自言自语、一个眼神飘过的对象，不必解释。
28. **路人 / 单场景 NPC**：台词 ≥ 2 句的，必须带 1 条与身份无关的小细节（口齿不清 / 袖口有饭粒 / 边说话边看外面 / 称呼用词跳出阶层）。绝不允许"可互换的证人"。

### 段长分布要求（2026-04 收紧）
- ≤ 30 字短段 ≤ 60% 总段数
- 30–80 字中段 ≥ 30%
- **> 80 字长段 ≥ 3 段**，其中 ≥ 1 段 > 120 字（承担描写 / 心理 / 环境 / 铺垫）
- 单句成段（≤ 15 字）占比 ≤ 30%
- 连续单句成段 ≤ 2 段；全章 ≥ 3 连续段丛数 ≤ 2
- 全章无任何 > 80 字段落 → 回滚级 FAIL
- 单句段占比 > 50% → 回滚级 FAIL

### 正文输出前自检
生成后，agent 内部对反 AI 味**25 项基础计数体系（18 主 + 7 子）及并入扩展硬门**逐项自打 PASS/WARN/FAIL/回滚级 FAIL，命中任一 FAIL 则重写当章，命中回滚级 FAIL 则退回对应 workflow。重写 2 轮仍未通过 → 交付时把命中项与原因一起告知用户。

另外必跑下列统计项（**全部**必须 PASS 才能 PERSIST）：
- `top_subject_ratio` ≤ 40%（top-1 主语段落占比）
- `para_length_std` ≥ 8 字（连续 5 段）
- `excitement_interruption`：本章每条爽点至少标注一种 `delay` / `denied` / `cost`
- `definition_style_hits` ≤ 2（9 种定义体模板单章合计命中次数；≥ 3 立即重写）
- `bold_theme_hits` = 0（粗体主题 / 情绪句；≥ 1 立即重写）
- `emotion_token_solo_paragraphs` ≤ 1 且 `emotion_token_bold` = 0（情绪词独段 / 粗体；`emotion_token_bold ≥ 1` 立即重写）
- `single_sentence_run_max` ≤ 2（全章最长连续单句成段段数；≥ 3 立即重写该段；≥ 6 回滚级）
- `single_sentence_para_ratio` ≤ 0.3（单句段占比；> 0.5 回滚级）
- `long_paras_over_80` ≥ 3 且 `long_paras_over_120` ≥ 1（> 80 字段落数；其中 ≥ 1 段 > 120 字）
- `signature_明牌次数`：每个 signature 反应 ≤ 1 次/章；超出立即去指认改为现象级
- `setting_reveal_overload_hits` = 0（设定专有名词首次出现携带 ≥ 2 项结构性信息；≥ 1 立即拆句）
- `filler_count` ≥ 5 且 `filler_plot_unrelated` ≥ 2（反 D-1；< 3 回滚级）
- `side_char_autonomous_agenda_chars` ≥ 80 且 ≥ 1 位配角（反 D-2；= 0 回滚级）
- `choice_mechanic_bad_pick_ratio` ≥ 1 / 3（反 D-3；选择机制 ≥ 3 次全最优则回滚级）
- `weirdness_budget_count` ≥ 1（反 P-1；连续 2 章 = 0 退 story-blueprint）
- `delayed_payoff_count` ≥ 1 且跨章距 ≥ 5（反 P-3；= 0 FAIL）
- `anti_trope_list_logged` = true 且 `real_continuation_rank` ≥ 4（反 P-4；未落盘或 ≤ 3 回滚级）
- `forbidden_transition_words_hits` = 0（反 Q；≥ 2 回滚级）
- `teleport_cuts` = 0（反 Q；≥ 1 回滚级）
- `transition_bridges_declared` = 所有切换数（反 Q；缺 1 即 FAIL）
- `friction_points_per_5min_scene` ≥ 1（反 Q）
- `exclusion_enum_hits` = 0（反 R-1；≥ 2 或 (=1 且 definition_style_hits≥1) 回滚级）
- `tutorial_microstep_chain_max` ≤ 4（反 R-2；≥ 5 回滚级）
- `catalog_afterthought_pairs` = 0（反 R-3；≥ 1 回滚级）
- `k_scene_block_violations` ≤ 2（反 K-补充；≥ 5 回滚级）
- `meta_language_hits` = 0（反 O-在场；≥ 1 回滚级）
- `opening_hook_spike` = true（反 A-补充；false 回滚级）
- `curiosity_gap_markers` ≥ max(2, chapter_word_count // 1200)（反 A-补充；不足回滚级）
- `flat_atmosphere_streak_max` ≤ 5（反 A-补充；≥ 6 回滚级）
- 若 `chapter == 1`：`series_opening_strike_count ≥ 2` 且 `opening_question_debt_present = true`（反 A-补充首章特判；任一不满足回滚级）
- `system_prompt_template_hits` ≤ 2（反 G-补充；≥ 5 回滚级）
- `coincidence_chain_hits` ≤ 3（反 P-补充；≥ 6 回滚级）
- `forced_detour_hits` = 0（反 P-补充；≥ 2 回滚级）
- `tech_jargon_density_per_1k` ≤ 8（反 G-补充2；> 12 回滚级）
- `tech_exposition_block_over_120` ≤ 1（反 G-补充2；≥ 3 回滚级）
- `tech_mechanism_closure_hits` ≤ 1（反 G-补充2；≥ 2 FAIL）
- `lexeme_cluster_repeat_hits` ≤ 3（反 B-补充；≥ 7 回滚级）
- `abstract_aura_token_density_per_1k` ≤ 10（反 B-补充；> 18 回滚级）
- `cultural_shorthand_clash_hits` ≥ 1（反 P-补充2；= 0 回滚级）
- `withhold_beat_present` = true（反 P-补充2；false 为 FAIL，补收束后重检）
- `near_duplicate_paragraph_pairs` = 0 且 `max_paragraph_similarity` < 0.88（反 B-补充2；pairs≥2 或 similarity≥0.92 回滚级）
- `trope_chain_hits` < 4 且 `predictability_score` != high（反 P-补充3）
- `simile_density_per_1k` ≤ 10、`simile_cluster_max` ≤ 3、`simile_pattern_repeat_hits` ≤ 2（反 B-补充3）
- `signature_tick_overuse_hits` = 0（反 E-扩展3）
- `hyper_precision_detail_hits` ≤ 1 且 `noninstrumental_numeric_density_per_1k` ≤ 6（反 B-补充4）
- `system_option_matrix_hits` ≤ 1 且 `bracket_system_block_count` ≤ 4（反 G-补充3）
- `multi_genre_graft_count` ≤ 2 且 `graft_overload_hits` = 0（反 P-补充4）
- `foreshadow_pack_density_per_1k` ≤ 3 且 `high_priority_foreshadow_count` ≤ 2（反 P-补充5）
- `golden_closing_line_hits` ≤ 1 且 `maxim_style_summary_hits` ≤ 1（反 N-补充）
- `contrastive_negation_hits` = 0 且 `keyzone_contrastive_negation_hits` = 0（反 R-补充 · 全章零容忍）
- `explicit_sexual_content_hits = 0` 且 `high_risk_relationship_hits = 0`，并按 `explicitness_target_ratio` 控制 `suggestive_erotic_risk_hits`（0%: <2；1-10%: ≤2；>10%: ≤3；占比不封顶）（反 E-扩展4）
- `romance_functional_scene_ratio` ≥ 0.8（感情段功能位覆盖）
- `desire_gradient_jump_hits` = 0 且 `desire_gradient_coverage` ≥ 3（欲望梯度递进）
- `ambiguity_scene_template_compliance` ≥ 0.7（触发->失控->收束->余波四步模板）
- `emotional_unpredictability_hits` ≥ 2 且 `emotion_response_variance_score` ≥ 0.3（感情不可控噪声）
- `affection_flow_reversal_count` ≥ 1（关系回摆）
- `bilateral_dialogue_technique_hits` 满足分布约束：至少 1 次且不超过默契档位上限（`low ≤ 1`、`mid ≤ 2`、`high ≤ 3`）
- `relationship_progression_beats` ≥ 1（存在爱情或核心友情场景时必须有递进动作，反 E-扩展6）
- `relationship_jump_without_cause_hits` = 0；若出现 `romance_step_delta_from_prev` / `friendship_step_delta_from_prev` ≥ +2，则 `relationship_jump_with_cause_hits` ≥ 1 且 `post_jump_emotional_turbulence_hits` ≥ 1（反 E-扩展6）
- `protagonist_distinctive_traits_count` ≥ 3，`protagonist_initiative_conflict_hits` ≥ 1，`protagonist_impulse_or_humor_hits` ≥ 1，`protagonist_template_similarity_hits` = 0（反 E-扩展7）
- `combat_target_ratio > 0` 时 `combat_presence_hits` ≥ 1；未显式给占比时“关系高压触点 >=1 或 combat_presence_hits >=1”至少满足一项（反 E-扩展7）
- `contrast_hook_misuse_hits` = 0，且（启用时）`contrast_hook_frequency_10ch ≤ 2`、`contrast_hook_chapter_gap ≥ 3`（反差钩子低频）

**反 O 专项必跑**（回滚级）：
- **灵魂渗透计数**：本章出场 ≥ 2 次的每个有名角色 + 首次登场的关键角色都必须 ≥ 1 次灵魂渗透（可删除不影响剧情）；缺位 → 该角色进入"纯功能性名单"，当章整体判 FAIL，回滚 story-blueprint 补 soul_fields
- **动物独立反应占比**：若本章出现动物 / 灵兽 / 法宝拟人，其独立反应段落占比 ≥ 50%，否则 FAIL
- **反派第三维度**：若该章有反派登场，折叠测试若落入"想赢 / 恨主角" → FAIL，补第三维度
- **配角可互换测试**：随机抽 2 句配角台词做"换成另一个同阵营同身份角色说"的替换测试，可无违和 → FAIL

### 落盘（项目正文模式强制）
PASS 通过后，调用 `webnovel-memory` · PERSIST 执行 8 步落盘（含 STEP 0 路径契约校验）+ 一致性检查。失败（路径违约 / 一致性断裂：伏笔未兑现 / 修为矛盾 / 名词未入词典 …） → 回滚本章并重写。

---

## 最终交付前自检

- [ ] 矛盾先于剧情被明确写出？
- [ ] 主角全程主动？
- [ ] 八步至少对上 4 步？
- [ ] 每个爽点都能追溯到对应矛盾的解决动作？
- [ ] 画面感 VR 三步在关键场面被应用？
- [ ] （正文模式）反 AI 味 A–R 主条款 + 7 个子条款（25 项）全部 PASS？尤其 **D（世界自主生活）、M / N / O 元条款、P（想象力）、Q（转场）、R（说明书句法）、K-补充（场景块空行）、G-扩展 1（9 模板）、N-细化（粗体主题句）、E（情感标签独段 / 粗体）、G-细化（PPT 直讲）** 回滚级硬门？
- [ ] （正文模式）本章所有出场 ≥ 2 次的有名角色 + 首次登场的关键角色都拿到"可删除不影响剧情"的灵魂渗透段？动物 / 灵兽 / 反派的专项规则都达标？
- [ ] （正文模式）`state/anti-trope-log.md` 本章 P-4 5-清单已落盘？真实接续命中第几名（必须 ≥ 4）？
- [ ] （正文模式）本章转场每次都已声明桥类型与锚点？禁用转场词 = 0？瞬移切换 = 0？
- [ ] （正文模式）闲笔 ≥ 5 处且剧情无关 ≥ 2？配角自主议题 ≥ 80 字 ≥ 1 位？**D-4** 缀笔计数与 `clip_style_chain_max` 达标？
- [ ] （正文模式）怪异预算 ≥ 1 + 延迟兑付 ≥ 1？
- [ ] （正文模式）**P-补充2**：`cultural_shorthand_clash_hits` ≥ 1 且 `withhold_beat_present` = true？
- [ ] （首章模式）前 500 字 `series_opening_strike_count ≥ 2` 且 `opening_question_debt_present = true`？
- [ ] （正文模式）**B-补充2**：`near_duplicate_paragraph_pairs = 0` 且 `max_paragraph_similarity < 0.88`？
- [ ] （正文模式）**P-补充3**：`trope_chain_hits < 4` 且 `predictability_score != high`？
- [ ] （正文模式）**B-补充3 / E-扩展3**：比喻密度同构与标志动作复用均未超阈？
- [ ] （正文模式）**B-补充4 / G-补充3 / P-补充4**：数值化感知、系统面板模板化、跨题材缝合均未超阈？
- [ ] （正文模式）**E-扩展4**：感情段已做过审降级（无露骨性描写/无高风险关系）？
- [ ] （正文模式）E-扩展4 风控面板字段齐全？（`romance_target_ratio` / `erotic_tension_target_ratio` / `explicitness_target_ratio` / `combat_target_ratio` / `suggestive_erotic_risk_hits` / `explicit_sexual_content_hits` / `high_risk_relationship_hits` / `chapter1_tension_hook_present`）
- [ ] （正文模式）若 E-扩展4 任一项 FAIL：已在本轮重写并重跑验证，且未宣称“已落盘/已通过”？
- [ ] （正文模式）上述统计清单**全部** PASS？（含 R 四项 + K-补充 + **O-在场 meta_language** + **A-补充 钩子/缝隙/纯氛围峰** + **P-补充2**）
- [ ] （正文模式）作者指纹字段在文本中可被识别到至少 2 条？
- [ ] （项目目录）所有写入路径都落在 `<project_root>/{book.yaml,fingerprint.md,bible/,characters/,arcs/,chapters/,state/,index/,.webnovel-memory/}`？
- [ ] （正文默认）已跑 webnovel-memory · LOAD 与 PERSIST 且一致性检查 PASS？（仅一次性短文声明可豁免）

不通过则内部重写，不交付。

## 底本

- `../references/foxsan-webnovel-manual.md` §4.6 / §5.3 / §5.4
- `../references/anti-ai-tells.md` 全文（正文模式必读）
- `webnovel-memory` · `references/read-protocol.md` + `references/write-protocol.md`（项目型写作 / 正文落盘必读）
