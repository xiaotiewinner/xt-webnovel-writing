---
name: xt-webnovel-writing
description: 中文网络小说写作 agent 的总入口。处理网文构思、写开头、设计主线、起书名、写大纲、写简介、设计剧情、加爽点、改文笔、拆解参考文本、自检错误、续写长篇等任何中文网文生成类任务。内部路由到 6 个模块：text-analysis / story-blueprint / plot-design / excitement-and-craft / pitfalls / memory。内置反 AI 味硬约束（17 主条款 + 7 子条款 · 共 24 项：节拍器 / 句式复用 / 主语熵 / **单句段连续 ≤ 2 且占比 ≤ 0.3** / 信息密度与世界自主生活（含闲笔密度 / 配角自主议题 / 废选项戏剧化 · 回滚级）/ 情感标签含独段与粗体 / 反应套餐 / signature 明牌化 / 设定说明书 / 9 种定义体模板 / 角色 PPT 直讲 / 算法思维链 / 爽点链条过完整 / 质量曲线过稳定含粗体主题句点题 / 角色灵魂缺位含首登即生效 / **剧情算法化/想象力贫血（含怪异预算/废选项/延迟兑付/反套路检查 · 回滚级）** / **转场机械/黏滞转场（含 5 类桥/禁用转场词/摩擦点必填 · 回滚级）**），其中 D / M / N / N-细 / O / P / Q / G+1 / E（独段+粗体）/ K（0 长段）/ C（≥ 6 连续单句段或占比 > 0.5）为**回滚级硬门**，任一命中强制整章退回指定 workflow 重写；每个有名出场 ≥ 2 次角色（含动物 / 灵兽 / 反派）和本章首登的关键角色都必须带独立内部状态并在当章非功能性地"被偶然看见"（deletion_verified）；长篇项目（≥ 100 万字）强制走 memory 持久化流程，所有文件严格落在 **project_root** 下的固定子目录（chapters / characters / state / arcs / bible / index / references），禁止散落。触发词：写网文、写网络小说、构思小说、写玄幻、写仙侠、起书名、大纲、人设、爽点、开头、签到流、系统流、重生、打脸、装逼、改文笔、AI 味、续写、接着写、第 X 章、长篇、500 万字、webnovel、web novel。
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
5. **反 AI 味**：所有生成文本必须通过 `{baseDir}/references/anti-ai-tells.md` 的 **17 主条款 + 7 子条款（共 24 项）** 检测。任一 FAIL → 内部重写；任一"回滚级 FAIL" → 整章退回指定 workflow 重写，不允许局部修补。
   - **元层级回滚级硬门**：**D（信息密度过干净 / 世界无自主生活，含 D-1 闲笔密度 < 3 / D-2 配角议题全围绕主角 / D-3 选择机制 ≥ 3 次全最优）**、M（爽点链条过完整）、N（质量曲线过稳定）、**N-细（粗体主题句点题）**、**O（角色灵魂缺位 · 尤其是关键角色首次登场章）**、**P（剧情算法化 / 想象力贫血 · 无怪异预算 / P-4 反套路检查落在前三常见中）**、**Q（转场机械 / 黏滞转场 · 禁用转场词 ≥ 2 次或瞬移切换）**、**G+1（9 种定义体模板 ≥ 5 次）**、**E（情绪词独段 + 粗体）**、**K（全章 0 长段）**、**C（最长连续单句段 ≥ 6 或占比 > 0.5）**。命中直接判"极高 AI 味"。
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
10. **项目目录契约（必守）**：长篇项目所有产物**只能**落在 `project_root` 下的固定子目录（见 §11）。子 workflow **禁止**自行选择"顺手的目录"。每次落盘前必须校验路径以 `<project_root>/` 开头。违反 → memory PERSIST 拒收。
11. **长篇必走 memory**：目标字数 ≥ 100 万字或章数 ≥ 200 时，所有正文生成前必须调用 `webnovel-memory/workflow.md` · LOAD 拉上下文，生成后必须调用 PERSIST 落盘；绕过视为违规。
12. **短句 + 画面感 + 共鸣** 是文笔基线；辞藻华丽不是目标。

## 3. 内部模块清单

Agent 按用户意图按需读取对应 `workflow.md`。`{baseDir}` 指本 skill 根目录。

| 模块 | 职责 | 加载路径 |
|---|---|---|
| text-analysis | 拆解 / 分析 / 模仿参考文本；产出风格指纹 | `{baseDir}/webnovel-text-analysis/workflow.md` |
| story-blueprint | 主线 / 人设 / 书名 / 大纲 / 简介 / 作者指纹 | `{baseDir}/webnovel-story-blueprint/workflow.md` |
| plot-design | 开头骨架 / 八步事件法 / 章节正文草案 | `{baseDir}/webnovel-plot-design/workflow.md` |
| excitement-and-craft | 爽点增强 / 文笔四层改写 | `{baseDir}/webnovel-excitement-and-craft/workflow.md` |
| pitfalls | 结构 + 反 AI 味双路体检 | `{baseDir}/webnovel-pitfalls/workflow.md` |
| memory | 长篇持久化记忆系统（READ / WRITE / INIT / AUDIT） | `{baseDir}/webnovel-memory/workflow.md` |

## 4. 公共 References（强制全局可用）

| 文件 | 用途 |
|---|---|
| `{baseDir}/references/anti-ai-tells.md` | 反 AI 味 17 主条款 + 7 子条款 · 共 24 项（生成 / 诊断类模块强制加载） |
| `{baseDir}/references/foxsan-webnovel-manual.md` | 方法论底本（狐三玄《网文写作新手入门手册》） |

各 `workflow.md` 引用这两份文件时，从自己所在目录向上一级：`../references/anti-ai-tells.md`、`../references/foxsan-webnovel-manual.md`。

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
- **（长篇必填）** project_root 路径

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
[3] plot-design                  正文模式：逐章生成
    ├─ LOAD  ← memory
    ├─ ANTI-TROPE 预声明：5-清单 + 怪异预算 + 延迟兑付 + 转场桥类型 → 写入 <project_root>/state/anti-trope-log.md
    ├─ DRAFT（反 AI 味 17 主 + 7 子 · 24 项嵌入 prompt；含出场 ≥ 2 次有名角色 + 本章首登关键角色的 soul_fields 必现清单 + 9 种定义体禁用模板 + 粗体禁令 + 禁用转场词清单 + 配角自主议题槽）
    ├─ SELF-CHECK（反 AI 味 24 项自检 + 转场桥声明校验 + 10 项统计 + 结构自检；任一回滚级 FAIL 立即回退指定 workflow）
    └─ PERSIST → memory 8 步落盘（STEP 0 路径契约校验；路径必须以 <project_root>/ 开头）
[4] excitement-and-craft         有需要时对已生成章节做爽点 / 文笔强化
[5] pitfalls                     每 10 章跑一次 AUDIT；整体质量体检
[6] memory · AUDIT               每 10 章做一致性审计，发现坑提前告警
```

任何一步出现用户修订要求时，只改当前步，不回退。

## 8. 生成期硬约束

进入任何正文生成任务前，先加载：

- `{baseDir}/references/anti-ai-tells.md`（反 AI 味 17 主条款 + 7 子条款 · 共 24 项）
- `memory` · LOAD 产出的记忆快照（长篇必须，含：
  - 本章出场 ≥ 2 次的有名角色 soul_fields 必现清单
  - 本章首次登场的关键角色 soul_fields（≥ 2 条，回滚级硬门准备）
  - 动物 / 灵兽独立反应坐标轴
  - 上一章"纯功能性角色名单"
  - 近 3 章 `definition_style_hits` / `bold_theme_hits` / `emotion_token_solo_paragraphs` / `single_sentence_run_max` / `long_paras_over_80` / `signature_明牌超限名单` / `setting_reveal_overload_hits` / `transition_types` 分布 / `anti_trope_recent_choices`）
  - 本章配角自主议题候选（D-2）
- 相关模块的输出 schema

**生成期硬约束明文（必须嵌入内部 prompt）：**

| 条款 | 硬约束 | 命中后处理 |
|---|---|---|
| C | 最长连续单句段 ≤ 2；占比 ≤ 0.3；≥ 6 连续或 > 0.5 占比 → 回滚 | 回 plot-design 重写段长结构 |
| **D-1** | 闲笔 ≥ 5 处 / 章；其中 ≥ 2 处与剧情完全无关（未来 5 章不回收） | < 3 处或全部被回收 → 回 plot-design |
| **D-2** | ≥ 1 位配角有 ≥ 80 字"与主角无关的自主议题" | 全配角围绕主角 → 回 plot-design |
| **D-3** | 选择 / 系统 / 抽奖类机制每 3 次触发 ≥ 1 次选"反直觉 / 废选项" | ≥ 3 次全最优 → 回 plot-design |
| E | 情绪词不得独段 + 不得粗体 | 独段+粗体 ≥ 1 即回滚 |
| E+2 | signature 明牌指认单章 ≤ 1 次 | 超限即禁用下章再指认 |
| G+1 | 9 种定义体模板单章 ≤ 2 次；≥ 5 次回滚 | 整章回 plot-design 重写 |
| G-细 | 设定首现只带 ≤ 1 项结构信息；同次发言设定专名 ≤ 1 | FAIL 即拆段重写 |
| K | 长段（> 80 字）≥ 3，其中 ≥ 1 段 > 120；单句段占比 ≤ 30% | 全章 0 长段即回滚 |
| M | 每条爽点必带 delay / denied / cost 打断 | 缺失即 memory PERSIST 拒收 |
| N | 段落具象度方差 ≥ 0.8；至少 1 亮句 + 1 粗糙句 | 成稿后挑 1 亮化 + 1 粗化 |
| N-细 | 全章粗体 ≤ 1 且仅限物理文本 | 情绪 / 主题用 ≥ 1 即回滚 |
| O | 关键角色首登章 ≥ 1 处灵魂渗透；出场 ≥ 2 次角色每次 ≥ 1 处；渗透必须非功能性（deletion_verified） | 关键角色首登违反 → 回 story-blueprint 补 soul_fields → 回 plot-design 重写 |
| **P-1** | 本章 ≥ 1 处"怪异预算"（剧情无法吸收的设定 / 场景 / 细节） | 缺失 → 回 story-blueprint 补世界观 |
| **P-3** | 本章 ≥ 1 处"延迟兑付"伏笔（≥ 5 章内不回收；章末不得提示这是伏笔） | 缺失 → 回 plot-design |
| **P-4** | 动笔前必须落盘 5-清单到 `<project_root>/state/anti-trope-log.md`；真实写的接续 ≠ 前 3 名 | 违反 → 回 plot-design 重做 anti-trope 预声明 |
| **Q** | 每次场景切换必须声明使用 5 类桥（感官 / 物件 / 对话打断 / 摩擦点 / 情绪错位）之一 + 锚点；禁用转场词清单零容忍 | ≥ 2 次禁用词 / 任一"瞬移切换" → 回 plot-design 重写转场 |

**段落默认构成铁律（反 C 强化）**：
- 默认一段 = 2–5 句；单句成段必须有显式理由（情绪顶点 / 打断 / 转场锚点 / 对话重击）。
- 连续 3 次想按 Enter 换行都是短句时，**第 3 次必须并段**。
- 不得出现"一动一行 / 一问一行"的连写形式。

**禁用转场词（反 Q 零容忍明文）**：
> 就在这时 / 与此同时 / 然而就在 / 就在他以为 / 三天后 / 第二天 / 一个星期后 / 半个月过去 / 时间一晃 / 转眼间

（出现在正文正常叙事中即 FAIL；嵌在对话 / 心理独白中且同场景内被反讽或二次否定的例外。）

生成后必须跑 plot-design 的正文输出前自检（24 条全检 + 转场桥声明 + 10 项统计 PASS），通过后交给 `memory` · PERSIST 落盘。

## 9. 交付前自检

- [ ] 违反 §2 公理？
- [ ] 矛盾先于剧情？主角主动？第一个爽点可指？
- [ ] 反 AI 味 **17 主条款 + 7 子条款（24 项）** 全部 PASS？
- [ ] 无任何"回滚级 FAIL"？（D-1 / D-2 / D-3 / M / N / N-细 / O / P-1 / P-3 / P-4 / Q 禁用词 / Q 瞬移切换 / G+1 ≥ 5 / E 独段+粗体 / K 全 0 长段 / C ≥ 6 连续或占比 > 0.5）
- [ ] 关键角色首登章 ≥ 1 处灵魂渗透？出场 ≥ 2 次有名角色每次 ≥ 1 处？反派有第三维度？动物独立反应占比 ≥ 50%？渗透句通过"删除验证"？
- [ ] 9 种定义体模板命中 ≤ 2？全章粗体 ≤ 1 且仅用于物理文本？
- [ ] 长段（> 80 字）≥ 3 段（含 ≥ 1 段 > 120 字）？单句段占比 ≤ 30%？连续单句段 ≤ 2？
- [ ] 闲笔 ≥ 5 处？其中 ≥ 2 处剧情无关？≥ 1 位配角有 ≥ 80 字自主议题？（含系统 / 选择机制时）本章 ≥ 1 次"废选项"？
- [ ] 本章含 ≥ 1 处"怪异预算"（剧情无法回收）+ ≥ 1 处"延迟兑付"（≥ 5 章不兑付）？
- [ ] `<project_root>/state/anti-trope-log.md` 是否已落盘本章 5-清单？真实接续 ≠ 前 3 名？
- [ ] 每次场景切换是否声明了桥类型（Q-1~Q-5）与锚点？禁用转场词出现 ≤ 0 次？
- [ ] 长篇场景已走 memory LOAD/PERSIST？所有落盘路径都以 `<project_root>/` 开头？
- [ ] 改写类任务给足原文→改写→理由？

未通过内部重写；重写 2 轮仍不通过 → 交付时连问题一起明示。

## 10. skill 目录结构（本仓库自身，不是用户项目）

```
xt-webnovel-writing/                    ← skill 根（= baseDir）
├── SKILL.md                            ← 本文件：OpenClaw 唯一入口
├── README.md
├── references/
│   ├── anti-ai-tells.md                ← 反 AI 味 17 主 + 7 子条款（24 项，含 D / O / P / Q 回滚级）
│   └── foxsan-webnovel-manual.md       ← 方法论底本
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

## 11. 项目目录契约（用户的长篇项目，必守）

### 11.1 project_root 决策规则

1. **优先级**：用户显式指定 > `book.yaml` 已有字段 > 当前工作目录下同名文件夹 > 新建。
2. `project_root` 必须是一个**绝对路径或相对当前工作目录的相对路径**的目录。一旦确定，本次会话**永久锁定**，写入 `<project_root>/book.yaml` 的 `project_root` 字段。
3. 目录名由用户或 agent 决定，但**子目录结构固定**，不可改名、不可省略、不可新增。

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
├── chapters/                            ← 正文章节（NNNN.md）
│   └── 0001.md, 0002.md, …
├── state/                               ← 动态状态（每章更新）
│   ├── timeline.md
│   ├── relationships.md
│   ├── foreshadow.md
│   ├── power-level.md
│   ├── used-excitement.md
│   ├── used-patterns.md
│   ├── open-threads.md
│   └── anti-trope-log.md                ← 新增：每章 P-4 的 5-清单 + 怪异预算 + 延迟兑付清单
├── index/                               ← 倒排索引（每 10 章重建）
│   ├── chapter-log.md
│   ├── by-character.md
│   ├── by-location.md
│   └── by-item.md
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
| 章节正文 | `<project_root>/chapters/<NNNN>.md`（4 位数字零填充） |
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
