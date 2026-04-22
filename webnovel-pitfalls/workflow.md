---
name: webnovel-pitfalls
description: 对已生成或已提交的网文文本执行结构化体检，产出可执行的"诊断卡"。触发于用户要求"检查 / 点评 / 挑错 / 自检 / 是不是 AI 写的 / AI 味 / 哪里不对 / 这段问题在哪"等，或在其他子 skill 输出正文之前自动调用作为发布前检查。覆盖两部分：Part A 结构 10 项（矛盾 / 主角 / 爽点 / 大纲 / 钩子 …），Part B 反 AI 味 18 主条款 + 7 子条款 · 共 25 项（节拍器 **+ A-补充 章首刺点/好奇缝隙** / 句式复用 / 主语熵 / 单句段瀑布流 / 世界无自主生活含闲笔密度/配角议题/废选项戏剧化 / 情感标签 含独段与粗体 / 反应套餐 / signature 明牌化 / 设定说明书 / 9 种定义体模板 / PPT 直讲 / 三项并列讲解 / 算法思维链 / 爽点链条过完整 / 质量曲线过稳定 + 粗体主题句点题 / 角色灵魂缺位 **+ O-在场 元叙事禁入** / 剧情算法化含怪异预算/废选项/延迟兑付/反套路检查 / 转场机械含 5 类桥/禁用转场词/摩擦点必填 / **说明书式排除枚举+教程体链+验收式对句（R）** / **场景块空行分段（K-补充）**）。长篇场景可直接读取 webnovel-memory 的 chapters/*、foreshadow.md、used-excitement.md、used-patterns.md、anti-trope-log.md 做跨章一致性体检（含灵魂渗透缺位名单、动物纯工具化名单、definition_style_hits、bold_theme_hits、signature_明牌超限名单、transition_types 分布、filler_density、side_char_autonomous_agenda 名单、**meta_language_hits / opening_hook_spike / curiosity_gap_markers / flat_atmosphere_streak_max**）。触发词：检查、点评、挑错、诊断、AI 味、是不是 AI、体检、audit。
metadata: {"openclaw":{"emoji":"🧪","os":["darwin","linux","win32"]}}
---

# 误区诊断 Agent · 结构 + 反 AI 味 · 双路体检

## 触发时机

1. 用户主动要求检查文本。
2. `webnovel-plot-design` / `webnovel-excitement-and-craft` 生成正文后，交付前内部调用一次。
3. 用户说"是不是 AI 写的 / 读着像 AI / AI 味太重"→ Part B 优先。
4. 用户说"我感觉哪里不对但说不上来"→ 两部分都跑。

## 输入契约

```yaml
text: <被检查的完整文本>
unit: chapter | excerpt | full_opening_5 | synopsis | outline
book_meta:
  title: <书名；可空>
  type: <题材>
  first_excitement: <书名对应的第一个爽点；可空>
  l1_conflict: <主线 L1 矛盾；可空>
  author_fingerprint: <若已生成；可空>
focus: structural | anti_ai | all   # 默认 all
```

## Part A · 结构 10 项

| # | 项目 | 可验证方式 |
|---|---|---|
| 1 | 开头堆设定 | 前 1000 字专有名词/术语数量 |
| 2 | 开头不见主角 | 主角首次动作出现在第几字 |
| 3 | 主角被动瞎逛 | 主角动作链是否含明确目标 |
| 4 | 为了爽而爽 | 爽点前 500 字是否有明确矛盾铺垫 |
| 5 | 文笔喧宾夺主 | 环境/外貌描写段占比 |
| 6 | 大纲缺位 | 本段/本章能否对应主线某一层矛盾 |
| 7 | 同类爽点堆叠 | 最近 3 次爽点类型是否重复 |
| 8 | 悬空梗 / 梗无承接 | 梗使用后 3 章内是否有余波承接 |
| 9 | 章节无钩子结尾 | 结尾最后 100 字是否留悬念 |
| 10 | 空话模板 | 是否出现"踏上征程 / 命运齿轮"等 |

### 阈值

| # | PASS | WARN | FAIL |
|---|---|---|---|
| 1 堆设定 | 前 1000 字专有名词 ≤ 3 | 4–6 | ≥ 7 |
| 2 主角晚出 | 前 200 字内 | 200–500 字 | > 500 字 |
| 3 被动瞎逛 | 有明确目标句 | 目标模糊 | 完全没目标 |
| 4 悬浮爽点 | 有矛盾 + 对手具象 | 有矛盾无具象 | 无矛盾 |
| 5 文笔喧宾 | 描写段 ≤ 40% | 40–60% | > 60% |
| 6 大纲缺位 | 能说清对应主线哪层 | 勉强 | 说不出 |
| 7 同类堆叠 | 3 次不同 | 2 次同类 | 3 次同类 |
| 8 悬空梗 | 有余波 | 承接弱 | 用完即弃 |
| 9 无钩子 | 有明确悬念句 | 弱悬念 | 平稳收束 |
| 10 空话模板 | 0 处 | 1 处 | ≥ 2 处 |

### 空话黑名单（#10 专用）

```
踏上征程 / 揭开序幕 / 拉开帷幕 / 命运的齿轮 / 命运的轮盘 /
冥冥之中 / 谁曾想 / 殊不知 / 殊不料 / 不禁感叹 /
让我们拭目以待
```

## Part B · 反 AI 味 18 主 + 7 子条款（25 项）

每项对应 `../references/anti-ai-tells.md` 中的一条。**任意 FAIL 即判定文本 AI 味过重，另一台 LLM 会抓出来**。命中"回滚级 FAIL"必须标出退回哪个 workflow。

| # | 项目 | 信号 |
|---|---|---|
| A | 节拍器式推进（**+ A-补充**） | 连续 ≥ 5 段都能被单独打上"功能标签"；**章首 ≈200 字无刺点钉子**；**好奇缝隙不足**；**纯氛围连段峰 ≥ 6** |
| B | 句式复用 | 同一主谓句式同场景 ≥ 3 次 |
| B+ | 主语单调 / 句长熵过低 | "他/她"开头段 ≥ 40%，或连续 ≥ 4 段段长标准差 < 8 字 |
| B-补充 | 词簇复读 | 高抽象气场词簇重复（掠食者/猩红/宿命等） |
| B-补充2 | 近重复段落 | 同义替换式段落重复并排保留（改稿残留） |
| B-补充3 | 比喻密度同构 | “像/仿佛/如同”密度过高且句法重复 |
| B-补充4 | 感知数值化过度 | 无仪器场景持续出现高精度数字感知 |
| N-补充 | 金句收束过密 | 章尾格言体总结过稳，像“作文结尾” |
| C | 单句成段瀑布流（2026-04 收紧） | 最长连续单句段 / 丛数 / 单句段占比 |
| **D** | 信息密度过干净 / 世界无自主生活（回滚级） | 闲笔数 / 剧情无关闲笔 / 配角自主议题字数 / 废选项次数 |
| D-1 | 闲笔密度 | 闲笔段 < 5 处或全部被剧情回收 |
| D-2 | 配角自主议题 | 全章无 ≥ 80 字的"配角与主角无关议题"段 |
| D-3 | 废选项戏剧化 | 选择 / 系统 / 抽奖 ≥ 3 次触发且全选最优 |
| E | 情感标签化（含独段 + 粗体） | 单人物单段 ≥ 3 个并列情绪形容词；或章内出现"情绪词 + 句号 + 独段"；或情绪词 + 粗体 |
| E+1 | 反应套餐化 | 反派被压制段内出现 ≥ 3 项标准套餐词且无 signature 反应 |
| E+2 | signature_reactions 明牌化 | 同一 signature 反应在单章内被明文指认 + 解读 ≥ 2 次 |
| E-扩展3 | 标志动作符号化过度 | 同一 tick（如“啧”）单章过度重复，章首章尾机械复用 |
| F | 修为清单化 | "XX 境 / XX 期 / 大成"独段或连缀并列出现 |
| G | 设定说明书化 | 连续 2 行以上 "XX——YY。" 式破折号对应 |
| G+1 | 定义体（9 种模板） | `不是 X，是 Y` 等 9 种模板命中 |
| G+2 | 三项并列打包讲解 | 同体系/典籍/地图 ≥ 3 项在同章被连续讲述 |
| G-细 | 角色 PPT 直讲设定 | 设定首现即在同一段携带 ≥ 2 项结构性信息 |
| G-补充 | 系统提示模板腔 | `【X：Y——Z】` 同构提示模板重复命中 |
| G-补充2 | 技术白皮书化 | 术语密度过高 / 技术说明段过长 / 机制闭环讲满 |
| G-补充3 | 系统面板模板化 | A/B/C/D 选项树与【系统块】过密，像 UI 文档 |
| H | 最优解战斗 | 战斗全程主角无失误、无情绪、无意外 |
| H+ | 算法式思维链 | 主角 ≥ 300 字思考段能压成"观察 → 判断 → 调整 → 成功"四步且无噪声 |
| I | 对话功能过载 | 一段独白式台词 ≥ 2 个专有名词设定 |
| J | 套路密度过高 | 一章可独立打标签的节点 ≥ 4 |
| K | 段长分布畸形 | > 80 字长段数 / 单句成段占比 |
| L | 作者指纹缺位 | 无任何可复述的"作者小怪癖" |
| M | 爽点链条过完整 | 章末 5 条爽点验证全 PASS 且无延迟/不给/代价 任何打断点 |
| N | 质量曲线过稳定 | 全章段落具象度分布在同一狭窄区间，找不到"明显差的一句"和"明显亮的一句" |
| N-细 | 粗体主题句点题 | 章内粗体用于情绪 / 感悟 / 主题句；或全章粗体数 |
| O | 角色灵魂缺位（**+ O-在场**） | 关键角色首次登场章无灵魂渗透；任一有名出场 ≥ 2 次角色无灵魂渗透；动物 100% 服务主角；反派仅"想赢 / 恨"；配角可互换；**出现上一章/下一章/读者/作者/弹幕等元叙事词** |
| **P** | 剧情算法化 / 想象力贫血（回滚级） | 无怪异预算 / 无延迟兑付 / 真实接续落在常见前 3 / 主角 10 秒可预测 |
| P-1 | 怪异预算 | 全章无任何剧情无法吸收的细节 |
| P-3 | 延迟兑付 | 全章所有伏笔当章兑付 |
| P-4 | 反套路检查 | 无 5-清单预声明 或 真实接续 ≤ 3 名 |
| P-补充 | 巧合闭环过快 | 连续偶然触发节点过高、被叙事强行导向 |
| P-补充2 | 文化 shorthand 贴脸对抗 + 收束节拍 | 无「共有符号×对抗动作」并置；无抬高预期后的拒展示/留白收束 |
| P-补充3 | 模板剧情链条过密 | “测灵失败→压迫→离宗→神秘老人/道具→金手指显影”连链过密 |
| P-补充4 | 跨题材缝合过载 | 职场/系统/修真/悬疑等多轨道同章强曝光堆叠 |
| P-补充5 | 伏笔装载过密 | 短篇幅内高权重线索过多，呈“埋点清单感” |
| **Q** | 转场机械 / 黏滞转场（回滚级） | 禁用转场词命中 / 瞬移切换 / 无桥类型声明 / 摩擦点缺位 |
| **R** | 说明书式排除枚举 + 教程体微动作链（回滚级） | `exclusion_enum_hits` / `tutorial_microstep_chain_max` / `catalog_afterthought_pairs` |
| R-1 | 生活流双否定目录 | 「不是…不是…是」≥ 2 次，或 1 次且同段叠 G+1 |
| R-2 | 教程体微动作链 | 无对白无心理窗内纯微步 ≥ 5 |
| R-3 | 验收式对句 | 「又/再」动作块后接 ≥2 个 ≤8 字纯状态短句且无心理插入 |
| R-补充 | 关键区对照句 | 章首/章尾/高潮区出现“不是X，是Y”解释句 |
| **K-补充** | 场景块空行分段 | 显著时空跳变该空行未空行；`k_scene_block_violations` |

### 阈值

| # | PASS | WARN | FAIL | 回滚级 FAIL |
|---|---|---|---|---|
| A | 每 3–5 段有节奏抖动；**章首有刺点**；**curiosity_gap ≥ max(2, W//1200)**；**flat_atmosphere_streak_max ≤ 5** | 偶发抖动；章首弱但后半有缝隙 | 每段都承担明确功能；**章首无刺点或缝隙不足** | **opening_hook_spike == false 或 flat ≥ 6 或 curiosity 低于阈值**（回 `webnovel-plot-design`） |
| A（首章特判） | `series_opening_strike_count ≥ 2` 且 `opening_question_debt_present = true` | strike=1 但有追问债 | strike=1 且无追问债 | **strike=0 或 无追问债**（回 `webnovel-plot-design` 重写首章开头） |
| B | 同句式 ≤ 2 次 | 3 次 | ≥ 4 次 | — |
| B+ | top-1 主语段占比 ≤ 40%，段长标准差 ≥ 8 | 40–50% / 标准差 5–8 | > 50% / 标准差 < 5 | — |
| B-补充 | `lexeme_cluster_repeat_hits` ≤ 3 且 `abstract_aura_token_density_per_1k` ≤ 10 | 重复=4 或 密度 10–12 | 重复=5–6 或 密度 12–18 | **重复 ≥ 7 或 密度 > 18**（回 `webnovel-plot-design`） |
| B-补充2 | `near_duplicate_paragraph_pairs` = 0 且 `max_paragraph_similarity` < 0.88 且 `duplicate_dialogue_openers` = 0 | similarity 0.88–0.92 | pairs = 1 或 duplicate_openers = 1 | **pairs ≥ 2 或 similarity ≥ 0.92**（回 `webnovel-plot-design`） |
| B-补充3 | `simile_density_per_1k` ≤ 10 且 `simile_cluster_max` ≤ 3 且 `simile_pattern_repeat_hits` ≤ 2 | 密度 10–14 | 密度 >14 或 cluster =4 或 repeat=3 | **密度 >18 且 cluster ≥5**（回 `webnovel-plot-design`） |
| B-补充4 | `hyper_precision_detail_hits` ≤ 1 且 `noninstrumental_numeric_density_per_1k` ≤ 6 | 精确数字偶发 | 高精度命中 =2 或密度 6–10 | **高精度命中 ≥3 或密度 >10**（回 `webnovel-plot-design`） |
| C | 最长连续单句段 ≤ 2 且单句段占比 ≤ 0.3 | 3 段 或 占比 0.3–0.4 | ≥ 4 段 或 占比 0.4–0.5 | **≥ 6 段 或 丛数 ≥ 4 或 占比 > 0.5**（回 `webnovel-plot-design` 重写段落结构） |
| D | 闲笔 ≥ 5 处 + ≥ 2 处剧情无关 + ≥ 1 位配角自主议题 ≥ 80 字 | 闲笔 3–4 处 或 配角议题勉强（< 80 字） | 闲笔 = 2 或 全配角围绕主角 | **闲笔 < 3 / 章 或 全配角围绕主角 或 含选择机制但全选最优 ≥ 3 次**（回 `webnovel-plot-design`） |
| D-1 | 闲笔 ≥ 5 且剧情无关 ≥ 2 | 闲笔 3–4 | 闲笔 = 2 | 闲笔 < 3（回 `webnovel-plot-design`） |
| D-2 | ≥ 1 位配角有 ≥ 80 字独立议题 | 有但 < 80 字 | 全配角围绕主角，但非零 | 全章 100% 配角台词围绕主角（回 `webnovel-plot-design`） |
| D-3 | 选择机制 3 次内 ≥ 1 次废选项 | 2 次最优 / 1 次"差异不明" | 3 次全最优 | 5 次以上全最优（回 `webnovel-plot-design`） |
| E | 情绪 ≤ 1 形容词 + 动作 | 2 形容词，或 1 次情绪词独段 | ≥ 3 形容词，或 ≥ 2 次情绪词独段 | 情绪词独段 + 粗体 ≥ 1 次 |
| E+1 | 反派反应至少 2 条 signature | 1 条 signature | 全是标准套餐 | — |
| E+2 | signature 明牌 ≤ 1 | 首次出现即附带解读 | 明牌指认 ≥ 2 次 | — |
| E-扩展3 | `signature_tick_overuse_hits` = 0 且 `chapter_edge_tick_reuse` 不连续复用 | 章首章尾同 tick 但近3章未重复 | 同 tick 单章 ≥ 3 次 | 连续 3 章章首章尾同 tick（回 `webnovel-plot-design`） |
| F | 修为嵌入场景 + 代价 | 嵌入但无代价 | 独段 / 清单 | — |
| G | 设定碎散 | 出现一次 "XX——YY" | 出现 ≥ 2 次 | — |
| G+1 | ≤ 1 | 2 处 | 3–4 处 | ≥ 5 处（整章退回 plot-design 重写） |
| G+2 | 同章同体系讲解 ≤ 1 项 | 2 项 | ≥ 3 项 | — |
| G-细 | 设定首现只带 ≤ 1 项结构信息 | 带 2 项 | 带 ≥ 3 项 或 同次发言 ≥ 2 个设定专名 | — |
| G-补充 | `system_prompt_template_hits` ≤ 2 | = 3 | = 4 | **≥ 5**（回 `webnovel-plot-design`） |
| G-补充2 | `tech_jargon_density_per_1k` ≤ 8 且 `tech_exposition_block_over_120` ≤ 1 且 `tech_mechanism_closure_hits` ≤ 1 | 术语 8–10 | 术语 10–12 或 技术长段 = 2 或 闭环 = 2 | **术语 > 12 或 技术长段 ≥ 3**（回 `webnovel-plot-design`） |
| G-补充3 | `system_option_matrix_hits` ≤ 1 且 `bracket_system_block_count` ≤ 4 | 矩阵=1 且系统块 5–6 | 矩阵=2 或系统块 ≥7 | **矩阵≥3 且角色无误读**（回 `webnovel-plot-design`） |
| H | 有干扰变量 + 战场外感官 | 只有一项 | 零干扰 | — |
| H+ | 思考段有 ≥ 1 条非理性噪声 | 有但都服务于正解 | 无任何噪声 | — |
| I | 每段对话有口吻差异 | 勉强 | 可互换 | — |
| J | 节点 ≤ 2 | 3 | ≥ 4 | — |
| K | 长段（> 80 字） ≥ 3（含 ≥ 1 段 > 120），单句段 ≤ 30% | 长段 = 2 或 单句段 30–40% | 长段 ≤ 1 或 单句段 40–55% | 全章 0 长段 或 单句段 > 55%（回 `webnovel-plot-design` 增加长段） |
| L | 指纹 ≥ 2 条可识别 | 1 条 | 0 条 | — |
| M | 爽点链条有 ≥ 1 个打断点 | 打断点存在但只用"日后再说"伪兑现 | 完整链条无任何延迟/不给/代价 | — |
| N | 质量曲线有波动 | 有亮句无粗糙句，或反之 | 同时缺失亮句和粗糙句 | — |
| N-细 | 粗体数 ≤ 1 且仅用于物理文本 | 粗体 = 2 | 粗体 ≥ 3 | 粗体用于情绪 / 主题 / 感悟 ≥ 1 次 |
| N-补充 | `golden_closing_line_hits` ≤ 1 且 `maxim_style_summary_hits` ≤ 1 | 章尾有 1 句收束金句 | maxim = 2 | maxim ≥ 3（回 `webnovel-plot-design`） |
| O | 每个关键 / 出场 ≥ 2 次有名角色各有 ≥ 1 处灵魂渗透；动物独立反应 ≥ 50%；反派有第三维度；**meta_language_hits = 0** | 主角灵魂渗透齐但配角 / 反派 / 动物缺 1 人 | 多数角色只剩功能；反派仅"想赢 / 恨"；动物纯工具化 | 关键角色（主角 / POV / 女男主 / 核心反派）首次登场章无灵魂渗透（退回 story-blueprint 补 soul_fields）；**meta_language ≥ 1（O-在场）**（回 `webnovel-plot-design` 全文检索） |
| **P** | 怪异预算 ≥ 1 + 延迟兑付 ≥ 1 + 5-清单已落盘 + 真实接续在清单外 | 5-清单落盘但真实接续 = 第 4–5 名 / 延迟兑付 = 0 | 真实接续命中第 2–3 名 / 怪异预算 = 0（但章中仍有小新意） | **真实接续 = 第 1 名 或 5-清单未落盘 或 怪异预算连续 2 章 = 0**（怪异预算 = 0 退 `webnovel-story-blueprint` 补世界观；其余退 `webnovel-plot-design`） |
| P-1 | ≥ 1 处 5 章内不会被剧情吸收的细节 | 有 1 处但 3 章内已兑 | 无怪异预算但有新鲜意象 | 连续 2 章无怪异预算 |
| P-3 | ≥ 1 处 5 章内不兑现的伏笔 | 全部伏笔 5–10 章兑现 | 全部伏笔 3 章内兑现 | 所有伏笔当章兑付 |
| P-4 | 5-清单已落盘且真实接续 ≤ 3 名 | 真实接续 = 第 4–5 名 | 真实接续 = 第 2–3 名 | 真实接续 = 第 1 名 或 清单未落盘 |
| P-补充 | `coincidence_chain_hits` ≤ 3 且 `forced_detour_hits` = 0 | coincidence = 4 | coincidence = 5 或 detour = 1 | **coincidence ≥ 6 或 detour ≥ 2**（回 `webnovel-plot-design`） |
| P-补充2 | `cultural_shorthand_clash_hits` ≥ 1 且 `withhold_beat_present` = true | cultural = 1 但符号未贴动作（主观） | `withhold_beat_present` = false | **`cultural_shorthand_clash_hits` = 0**（回 `webnovel-plot-design` 补贴脸对抗） |
| P-补充3 | `trope_chain_hits` < 4 且 `predictability_score` != high | hits = 3 | hits = 4 | **max_run ≥3 且怪异预算=0**（回 `webnovel-plot-design`） |
| P-补充4 | `multi_genre_graft_count` ≤ 2 且 `graft_overload_hits` = 0 | 轨道=2 但解释偏满 | 轨道=3 | **首章轨道≥3 或 overload≥1**（回 `webnovel-plot-design`） |
| P-补充5 | `foreshadow_pack_density_per_1k` ≤ 3 且 `high_priority_foreshadow_count` ≤ 2 | 密度 3–5 | 密度 >5 或高优先=3 | **高优先≥4**（回 `webnovel-plot-design`） |
| **Q** | 每次切换有桥类型声明 + 锚点；禁用词 = 0；瞬移 = 0；摩擦点 ≥ 1 | 禁用词 = 1 且在对话 / 心理中 / 摩擦点勉强 | 禁用词 2–3 / 瞬移 = 1（轻度） / 桥声明缺失 | **禁用词 ≥ 2 / 瞬移 ≥ 1 / 全章无桥声明**（回 `webnovel-plot-design` 重写转场） |
| **R** | 三子维度均 PASS 档 | 任一 WARN 累计 2+ | 任一 FAIL | **R-1 ≥2 或 (=1 且 G+1 同段) / R-2 ≥5 / R-3 ≥1**（回 `webnovel-plot-design`） |
| R-补充 | `contrastive_negation_hits` ≤ 1 且 `keyzone_contrastive_negation_hits` = 0 | 全章 1 次但非关键区 | 全章 ≥2 次 | **关键区命中 ≥1（首章按回滚级）** |
| **K-补充** | `k_scene_block_violations` ≤ 2 | 3–4 | — | **≥ 5**（回 `webnovel-plot-design`） |

## 诊断管线

```
STEP 1  解析 text：首字 / 主角首次动作字位 / 专有名词表 / 爽点段位置 /
        结尾 100 字 / 段长分布 / 功能标签序列 /
        主语分布 / 段长标准差 / 思考段非理性噪声计数 /
        反派反应关键词表 / 爽点链条打断点 / 段落具象度评分 /
        **有名角色出场计数表 / 每个角色的灵魂渗透次数与涉及字段 /
        动物出现段落中独立反应占比 / 反派第三维度命中次数 / 路人台词可互换度 /
        闲笔段数与剧情无关闲笔数（反 D-1）/ 配角自主议题最长片段（反 D-2）/
        选择 / 系统 / 抽奖机制触发次数与废选项次数（反 D-3）/
        怪异预算命中数 / 延迟兑付伏笔清单 / 本章 5-清单接续预声明 vs 真实接续排名（反 P-1/P-3/P-4）/
        场景切换次数与桥类型分布 Q-1..Q-5 / 禁用转场词命中清单 / 瞬移切换次数（反 Q）/
        排除式枚举命中 R-1 / 教程体微步链峰值 R-2 / 验收式对句 R-3 / 场景块空行违规 K-补充 /
        **元叙事词命中 O-在场 / 章首刺点 opening_hook_spike / curiosity_gap_markers / flat_atmosphere_streak_max（A-补充） /
        首章抓手数 series_opening_strike_count / 首章追问债 opening_question_debt_present（A-补充首章特判） /
        lexeme_cluster_repeat_hits + abstract_aura_token_density_per_1k（B-补充） /
        near_duplicate_paragraph_pairs + max_paragraph_similarity + duplicate_dialogue_openers（B-补充2） /
        simile_density_per_1k + simile_cluster_max + simile_pattern_repeat_hits（B-补充3） /
        hyper_precision_detail_hits + noninstrumental_numeric_density_per_1k（B-补充4） /
        golden_closing_line_hits + maxim_style_summary_hits（N-补充） /
        system_prompt_template_hits（G-补充） / coincidence_chain_hits + forced_detour_hits（P-补充） /
        tech_jargon_density_per_1k + tech_exposition_block_over_120 + tech_mechanism_closure_hits（G-补充2） /
        system_option_matrix_hits + bracket_system_block_count（G-补充3） /
        cultural_shorthand_clash_hits + withhold_beat_present（P-补充2） /
        trope_chain_hits + trope_chain_max_run + predictability_score（P-补充3） /
        multi_genre_graft_count + graft_overload_hits（P-补充4） /
        foreshadow_pack_density_per_1k + high_priority_foreshadow_count（P-补充5） /
        contrastive_negation_hits + keyzone_contrastive_negation_hits（R-补充） /
        signature_tick_overuse_hits + chapter_edge_tick_reuse（E-扩展3）**
STEP 2  Part A 10 项逐条判定
STEP 3  Part B 18 主条款 + 7 子条款（25 项）逐条判定（引用 anti-ai-tells.md）
STEP 4  每个 FAIL 给"最小改法"（1–2 句话）+ 原文摘录；回滚级 FAIL 必须标出退回哪个 workflow
STEP 5  综合判定 + 优先级排序
STEP 6  输出"AI 味判定"：
        - 任一"回滚级 FAIL" → 极高 AI 味（必须整章退回指定 workflow 重做）
        - Part B FAIL ≥ 4 或 {B-补充, **B-补充2**, **B-补充3**, **B-补充4**, D, M, N, N-细, **N-补充**, O, G+1, E 粗体, **E-扩展3**, P, Q, R, **R-补充**, K-补充, G-补充, G-补充2, **G-补充3**, P-补充, **P-补充2**, **P-补充3**, **P-补充4**, **P-补充5**} 任一 FAIL → 极高 AI 味
        - **O-在场**（meta_language ≥ 1）或 **A-补充**（opening_hook false / curiosity 不足 / flat ≥ 6）任一命中回滚阈值 → 极高 AI 味（视同 O / A 回滚级）
        - FAIL = 2–3 → 中度
        - FAIL = 1 且不含上述高危条款 → 偏低
        - FAIL = 0 且 WARN ≤ 3 → 低
```

## 输出 schema

```markdown
# 《[书名 / 片段名]》诊断卡

## 元数据
- 文本单元：chapter | excerpt | ...
- 字数：约 N
- 段落数：N
- 首次主角动作字位：第 X 字
- AI 味综合判定：极高 / 中度 / 低

## Part A · 结构 10 项

| # | 项目 | 结果 | 关键证据 | 最小改法 |
|---|---|---|---|---|
| 1 | 开头堆设定 | PASS/WARN/FAIL | 前 1000 字术语：<…> | |
| 2 | 开头不见主角 | | 首动作在第 X 字 | |
| 3 | 主角被动瞎逛 | | 目标句："…" 或 无 | |
| 4 | 为了爽而爽 | | 爽点前铺垫段摘录 | |
| 5 | 文笔喧宾夺主 | | 描写段占比 X% | |
| 6 | 大纲缺位 | | 对应主线层：L? | |
| 7 | 同类爽点堆叠 | | 最近 3 次爽点类型 | |
| 8 | 悬空梗 | | 梗名 + 余波段引用 | |
| 9 | 无钩子结尾 | | 结尾 100 字摘录 | |
| 10 | 空话模板 | | 命中词 | |

## Part B · 反 AI 味 18 主 + 7 子条款（25 项）

| # | 项目 | 结果 | 原文摘录（证据） | 最小改法 |
|---|---|---|---|---|
| A | 节拍器式推进 | | | |
| B | 句式复用 | | | |
| B+ | 主语单调 / 句长熵过低 | | top-1 主语 "X" 占 N%；段长标准差 N | |
| B-补充 | 词簇复读 | | 复读词簇与命中次数；抽象词密度/千字 | |
| B-补充2 | 近重复段落 | | `near_duplicate_paragraph_pairs`；`max_paragraph_similarity`；`duplicate_dialogue_openers` | |
| B-补充3 | 比喻密度同构 | | `simile_density_per_1k`；`simile_cluster_max`；`simile_pattern_repeat_hits` | |
| C | 单句段瀑布流（2026-04 收紧） | | 最长连续单句段 = N；丛数 = N；单句段占比 = P | |
| D | 信息密度过干净 / 世界无自主生活 | | 闲笔 N 处（无关 M 处）；配角自主议题字数 K；选择机制 T 次 / 最优 U 次 | |
| D-1 | 闲笔密度 | | | |
| D-2 | 配角自主议题 | | 具体配角 + 议题摘录 | |
| D-3 | 废选项戏剧化 | | 选择机制触发 / 选择结果 | |
| E | 情感标签化（独段 + 粗体） | | 情绪词独段 ×N；情绪词粗体 ×N | |
| E+1 | 反应套餐化 | | 标准套餐词命中："…" ×N | |
| E+2 | signature 明牌化 | | 明牌指认次数 N；首次出现附带解读：是 / 否 | |
| E-扩展3 | 标志动作符号化过度 | | `signature_tick_overuse_hits`；`chapter_edge_tick_reuse` | |
| F | 修为清单化 | | | |
| G | 设定说明书化 | | | |
| G+1 | 定义体（9 模板） | | 命中模板清单及 N | |
| G+2 | 三项并列打包讲解 | | 同章同体系讲解项数：N | |
| G-细 | 角色 PPT 直讲设定 | | 首现携带结构性信息项数：N；同次发言设定专名数：N | |
| H | 最优解战斗 | | | |
| H+ | 算法式思维链 | | 思考段长度 N 字，非理性噪声 = 0 | |
| I | 对话功能过载 | | | |
| J | 套路密度过高 | | | |
| K | 段长分布畸形 | | 长段（>80 字）数 N（含 >120 字 M 段）；单句段占比 P% | |
| L | 作者指纹缺位 | | | |
| M | 爽点链条过完整 | | 爽点步数 N，打断点数 = 0 | |
| N | 质量曲线过稳定 | | 段落具象度区间 [X, Y]，跨度 Z | |
| N-细 | 粗体主题句点题 | | 全章粗体数 = N；其中情绪 / 主题用 = M | |
| O | 角色灵魂缺位 | | 有名角色灵魂渗透统计：主角 N 次 / 反派 N 次 / 配角 N 次 / 动物 N 次（独占比 P%） / 路人可互换度；关键角色首登章灵魂渗透：是 / 否 | |
| P | 剧情算法化 / 想象力贫血 | | 怪异预算 N；延迟兑付 N；5-清单是否落盘：是/否；真实接续排名：第 K 名 | |
| P-1 | 怪异预算 | | 具体细节摘录 + 是否 5 章内回收 | |
| P-3 | 延迟兑付 | | 伏笔清单 + 预计兑付章 | |
| P-4 | 反套路检查 | | 5-清单内容 + 真实接续 | |
| P-补充2 | 文化 shorthand + 收束 | | `cultural_shorthand_clash_hits`；`withhold_beat_present` | |
| P-补充3 | 模板剧情链条 | | `trope_chain_hits`；`trope_chain_max_run`；`predictability_score` | |
| Q | 转场机械 / 黏滞转场 | | 切换次数 N；桥类型分布 Q-1/Q-2/Q-3/Q-4/Q-5 = …；禁用词命中 N；瞬移切换 N；摩擦点 N | |

## 综合判定
- Part A FAIL / WARN 计数：
- Part B FAIL / WARN 计数：
- 量化证据（必须列数值）：
  - `lexeme_cluster_repeat_hits` / `abstract_aura_token_density_per_1k`：
  - `near_duplicate_paragraph_pairs` / `max_paragraph_similarity` / `duplicate_dialogue_openers`：
  - `simile_density_per_1k` / `simile_cluster_max` / `simile_pattern_repeat_hits`：
  - `system_prompt_template_hits`：
  - `coincidence_chain_hits` / `forced_detour_hits`：
  - `trope_chain_hits` / `trope_chain_max_run` / `predictability_score`：
  - `signature_tick_overuse_hits` / `chapter_edge_tick_reuse`：
  - `cultural_shorthand_clash_hits` / `withhold_beat_present`：
  - `tech_jargon_density_per_1k` / `tech_exposition_block_over_120` / `tech_mechanism_closure_hits`：
  - `meta_language_hits` / `opening_hook_spike` / `curiosity_gap_markers`：
  - `series_opening_strike_count` / `opening_question_debt_present`（chapter 1）：
- **回滚级 FAIL 清单（命中必须整章重做）**：
  - O（关键角色首登章无灵魂渗透）→ 回 `webnovel-story-blueprint` 补 soul_fields → 再回 `webnovel-plot-design`
  - G+1（定义体 ≥ 5 处）→ 回 `webnovel-plot-design` 重写
  - C（最长连续单句段 ≥ 6 或 丛数 ≥ 4 或 单句段占比 > 0.5）→ 回 `webnovel-plot-design` 重写段长结构
  - D（闲笔 < 3 / 章 或 全配角围绕主角 或 选择机制全最优）→ 回 `webnovel-plot-design`
  - E（情绪词独段 + 粗体）→ 回 `webnovel-plot-design` 去标签化
  - N-细（粗体用于情绪 / 主题）→ 回 `webnovel-plot-design` 删粗体
  - K（全章 0 长段 或 单句段 > 55%）→ 回 `webnovel-plot-design` 增加长段
  - P（怪异预算连续 2 章 = 0 或 真实接续 = 常见第 1 名 或 5-清单未落盘）→ 怪异预算回 `webnovel-story-blueprint`，其他回 `webnovel-plot-design`
  - Q（禁用转场词 ≥ 2 或 瞬移切换 ≥ 1 或 全章无桥声明）→ 回 `webnovel-plot-design` 重写转场
  - **P-补充2**（`cultural_shorthand_clash_hits == 0`）→ 回 `webnovel-plot-design` 补「共有符号 × 对抗动作」并置
  - **B-补充2**（近重复段 `pairs >= 2` 或 `similarity >= 0.92`）→ 回 `webnovel-plot-design` 先去重
  - **P-补充3**（模板链 `max_run >= 3` 且怪异预算=0）→ 回 `webnovel-plot-design` 重排节拍
- 最优先修复（按影响力排序）：
- 建议交接 skill：
  - 修结构（#A1–A4, #A6–A9, Part B 的 A **+ A-补充** /H/J/M/D-2/D-3/P-3/P-4/Q/**R/K-补充** / **O-在场 元叙事**）→ `webnovel-plot-design`
  - 修文笔/情感/设定表达（#A5, #A10, Part B 的 B/B+/C/D-1/E/E+1/E+2/F/G/G+1/G+2/G-细/H+/I/K/K-补充/N/N-细）→ `webnovel-excitement-and-craft`
  - 缺作者指纹（L）、反派 signature 反应（E+1）、**角色灵魂字段（O）**、怪异预算缺位（P-1）→ 先回 `webnovel-story-blueprint` 补指纹 / 人物卡 / soul_fields / 动物独立反应坐标轴 / 反派第三维度 / 世界观怪异预算池

## 结构指纹（供用户存档）
- 首动作字位：
- 第一个爽点字位：
- 本章主要矛盾：
- 本章小高潮字位：
- 本章结尾钩子（一句话）：
- 段长分布（短 / 中 / 长 占比）：
- 主语 top-3 段落占比：
- 非理性噪声事件数：
- 爽点链条打断类型：delay / denied / cost / —
- 段落具象度方差：
- 功能标签序列（按段落）：
```

## 使用约束

- 对 FAIL 项必须给原文摘录 + 可执行最小改法，不允许只说"这里不好"。
- 若 Part B 出现 ≥ 4 条 FAIL，或 **D/M/N/P/Q/R/K-补充** 任一回滚级 FAIL，或 **O-在场 / A-补充** 命中回滚阈值，诊断结论必须明确写"极高 AI 味，另一台 LLM 能抓出"。
- 诊断结论若为"极高 AI 味"时，必须使用拒交付模板：`本稿触发回滚级硬门，拒绝以正文交付；仅返回重写方向与最小改法。`
- 不做作者心态类评价。

## 底本

- `../references/foxsan-webnovel-manual.md` §6（十大误区的文本可验证子集）
- `../references/anti-ai-tells.md`（Part B 全部条款）
- `webnovel-memory` · `references/directory-schema.md`（长篇跨章一致性体检时取数来源）
