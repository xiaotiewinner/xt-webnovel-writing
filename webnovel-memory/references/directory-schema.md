# 小说项目目录结构 · Schema

所有项目型写作都必须落在一个 **project_root** 下，并遵循下列固定目录。新建项目时 `webnovel-memory` 会一次性建好全部空壳。

```
<project_root>/
├── book.yaml                  书籍元数据（由 story-blueprint 产出后固化）
├── fingerprint.md             作者指纹（风格锁定文件，正文生成必读）
├── bible/                     世界观圣经（静态设定）
│   ├── world.md               空间 / 时间 / 气候 / 文化背景
│   ├── power-system.md        力量体系 / 等级 / 升阶规则
│   ├── factions.md            势力 / 宗门 / 组织
│   └── glossary.md            专有名词表（写作时强制查重）
├── characters/                人物卡（一人一文件）
│   ├── _index.md              人物索引（名 → 文件 + 最近出场章）
│   └── <name>.md              单人卡：身份/能力/关系/最近状态/出场章号列表
├── arcs/                      剧情弧（按主线 L 层 + 分段）
│   ├── _index.md              arc 索引
│   └── arc-<NN>-<slug>.md     每 arc：矛盾 / 八步 / 起止章号 / 结果
├── chapters/                  正文章节
│   └── ch<NNNN>_<短标题>.md  单章终稿：仅一级标题 + 小说正文，无 frontmatter（SFNC 见 write-protocol · STEP 0）
├── state/                     动态状态（最频繁更新）
│   ├── chapter_meta/         每章元数据 `ch<NNNN>.yaml`（arc / pov / hooks / stats 等，与 `chapters/` 正文分离）
│   ├── timeline.md            时间线：章号 → 绝对时间 + 事件
│   ├── relationships.md       关系表：(角色A, 角色B) → 关系等级 + 最近事件章
│   ├── foreshadow.md          伏笔表：埋点章 / 内容 / 预期兑现章 / 状态
│   ├── power-level.md         主角（及主要角色）修为进度
│   ├── used-excitement.md     已用爽点日志（章号 + 类型 + 对手）
│   ├── used-patterns.md       最近 10 章高频句式 / 动词 / 描写套路 / 反 AI 味全量监控面板
│   ├── open-threads.md        未收束的矛盾/支线/疑团清单
│   └── anti-trope-log.md      反 P · 每章 5-清单 + 真实接续排名 + 怪异预算 + 延迟兑付
├── index/                     可检索索引（每 10 章全量重建）
│   └── volume_<VOLUME_NO>_index.md   卷目录/章节摘要/进度与导航（SFNC）
└── .webnovel-memory/          内部元数据（不直接给 agent 用）
    ├── version.json           schema 版本
    └── last-write.json        最近一次 PERSIST 写入记录（须含本论改动的 `chapters/chNNNN_*.md` 与对应该章的 `state/chapter_meta/chNNNN.yaml` 等路径，供回滚）
```

## 字段模板

### `book.yaml`

```yaml
title: 《书名》
project_root: <本次会话锁定的 project_root 路径>   # 由 memory INIT 一次性写入，禁止后续改动
type: 玄幻 | 仙侠 | 都市 | ...
subgenre: <子类型>
target_length: short | medium | long   # long = > 100 万字
estimated_chapter_length: 3000 | 4000 | 6000   # 单章字数基线
l1_conflict: <主线 L1 矛盾句>
main_axis:                              # L1–L5 主线矛盾链
  - level: L1
    text: ...
  - level: L2
    text: ...
protagonist: <主角一句话身份>
protagonist_flaw: <核心缺点>
first_excitement: <书名对应的第一个爽点>
author_fingerprint_ref: ./fingerprint.md
created_at: YYYY-MM-DD
```

### `fingerprint.md`

```markdown
# 《书名》· 作者指纹

- 偏好动词：挑 / 扯 / 丢 / 晾
- 偏好物象：烟 / 旧书 / 某一类光
- 主角口头禅：开口前先 "嗯" 一声
- 断句偏好：短逗号串 + 短问句结尾
- 叙事人称：第三人称限知（只进主角视角）
- 章末钩子偏好：一个动作 + 一句半截话
- 禁用词：淡淡地说 / 缓缓地 / 踏上征程 / 命运的齿轮 / ...
```

### `characters/<name>.md`

```markdown
---
name: 叶无尘
role: 主角 | 长期配角 | 反派 | 路人 | 灵兽
species: 人 | 灵兽 | 灵物
first_chapter: 1
last_chapter: 87
status: 活跃 | 退场 | 死亡 | 冷藏
---

## 身份
- 一句话：
- 前史：

## 能力与修为
- 当前修为：金丹中期（更新于 第 87 章）
- 历史修为轨迹：
  - 第 1 章：凡人
  - 第 10 章：炼气
  - 第 45 章：筑基
  - 第 78 章：金丹初期
  - 第 87 章：金丹中期
- 法宝/功法：无生剑（第 87 章获得）

## 核心缺点
- <缺点 1>（持续生效，在哪些章体现）

## 灵魂字段（soul_fields，反 AI 味 O 条款）

> 这些字段描述"与主线无关的内部状态"。不是为了兑现，而是为了"被偶然看见"。禁止与本章剧情功能重合。
>
> **填写门槛（按角色类型）：**
> - **关键角色**（主角 / POV / 女男主 / 核心反派 / 固定配角 top 5）：**≥ 2 条**，首次登场章**必须**落一次灵魂渗透（回滚级硬门）
> - **重要有名角色**（总出场 ≥ 2 次的有名角色）：**≥ 1 条**，首次登场章必须落一次渗透
> - **次要有名角色**（仅出场 1 次但非纯路人）：**≥ 1 条**（可后置填写）+ 该章至少 1 处不可互换特征
> - **纯路人 NPC**：soul_fields 可省略，但台词 / 动作不得与其它路人互换

- **core_wound（核心创伤 / 遗憾 / 执念）**：一条影响日常行动但**不直接与主角相关**的旧伤、遗憾、未竟之事
  - 示例："十七岁那年师妹替自己挡了一剑，他至今没对任何人提起她的名字"
- **private_desire（私人欲望）**：一条对剧情推进**无用**的私愿
  - 示例："想在有生之年再去一次北境看那片雪"
- **contradictory_belief（不合身份的私下信念）**：与其阵营 / 职位 / 立场**不一致**的私下态度
  - 示例："正道执法堂长老，私下认同魔修那句'人心本就有黑处'"
- **unreasonable_preference（非理性偏好 / 怪癖）**：无需解释的非理性偏好
  - 示例："听到钟声会走神" / "左手不用来拿剑" / "吃面不吃葱"

### 动物 / 灵兽 / 灵物专用（species != 人 时必填 ≥ 1 条）
- **non_instinct_preference**：非本能偏好 · "只听竹笛声才会停下"
- **async_emotion**：与主角不同步的情绪 · "主角开心时它焦躁，主角紧张时它漠然"
- **private_routine**：私人行动线 · "每日卯时去某块石头上蹲一会儿，与剧情无关"
- 禁止：全章所有出现都只是"预警 / 救主 / 回应指令"（= 会动的工具）

### 反派专用（role = 反派 时必填 ≥ 1 条"第三维度"）
- 必须有一条**与主角无关、与权力无关**的私人维度
  - 示例："每月初一会独自去一座无名坟前坐半个时辰" / "极度怕疼，任何伤都会影响当日判断"

## 标志反应（signature_reactions，反 AI 套餐化必填 ≥ 2 条）
- 独特动作：用指关节敲剑柄、紧张时往左侧退半步、疲惫时眨眼慢一拍
- 独特语言：爱用反问代替回答、说话常断半句不说完、喜欢引一句半吊子古诗
- 独特生理：吞口水时喉结响一声、深呼吸前先闭眼一瞬、发狠时左眼角跳
- "不合时宜"的小反应库（首次遭遇决定性打击时挑 1 条）：
  - 想起一件毫不相关的小事
  - 突然笑了一下
  - 做一个无关的小动作（扯袖口、摸耳后、转了一下戒指）

## 关系
- 柳长风：宿敌，第 87 章撕破脸
- ...

## 出场章号
[1, 2, 3, 5, 8, 12, 20, 45, 78, 87]

## 标志反应明牌化计数（signature_明牌次数，反 E+2 联动）

> 记录 signature_reactions 在该章被"明文指认 + 解读"的次数（如"他看到她左耳垂上的红。她说谎时左耳垂会红"）。

| 章 | 明牌指认次数 | 是否达标 |
|---|---|---|
| 87 | 1 | ✓ |

- 阈值：单章 ≤ 1 次
- 下一章起禁止再对该 signature 明牌指认，只允许描述现象

## 灵魂渗透记录（soul_bleed_log，反 O 联动）

> 每次该角色出场，记录其 soul_fields 是否在当章"非功能性地渗出"至少一次。用于跨章监控。
>
> **"非功能性"判定**：把该渗透句删除后，本章剧情推进不受影响才算数。

| 章 | 出场段数 | 渗透次数 | 渗透的灵魂字段 | 删除验证 | 是否达标 |
|---|---|---|---|---|---|
| 87 | 4 | 1 | core_wound（揉右手腕，旧伤） | 删后不影响剧情 ✓ | ✓ |

- 阈值：
  - 关键角色 **首次登场章必须 ≥ 1 次**（回滚级硬门，命中失败时回退 story-blueprint / plot-design）
  - 关键角色 / 出场 ≥ 2 次角色：每次出场至少 1 次渗透
  - 连续 2 次出场 0 渗透 → 下一章强制安排

## 最近状态（每次章节更新时同步）
- 情绪：
- 位置：
- 下一步目标：
```

### `chapters/ch<NNNN>_<短标题>.md`（仅标题 + 正文）

```markdown
# 一剑破阵

<小说正文，无 YAML / 无 HTML 注释 / 无代码块 / 无除本 H1 外的 Markdown 结构>
```

### `state/chapter_meta/ch<NNNN>.yaml`（原章节 frontmatter 全量落此文件）

```yaml
chapter: 87
title: 一剑破阵
arc: arc-03-夺剑
word_count: 6032
pov: 叶无尘
locations: [天剑宗演武场, 天剑宗后殿, 天剑峰]
characters: [叶无尘, 柳长风]
excitement_types: [REV, ID, PWR]   # 反击 / 身份 / 武力
plot_nodes: [破阵, 夺宝, 升级]      # 不允许 ≥ 3
hooks_planted: [foreshadow-12, foreshadow-13]
hooks_resolved: [foreshadow-05]
created_at: 2026-04-20
# … 与 write-protocol 输入的 chapter_meta 同构，含 stats 等
```

### `state/foreshadow.md`

```markdown
| ID | 埋点章 | 伏笔内容 | 预期兑现章 | 当前状态 |
|---|---|---|---|---|
| F-001 | 3 | 祖父留下的玉佩中有秘密 | 预估 50 附近 | live |
| F-002 | 5 | 柳长风对天剑诀的执念 | 已在 87 兑现 | used |
| F-003 | 12 | 无生剑血祭终章 | — | live |

## 规则
- 每埋 1 个新伏笔 → 新增一行 `live`
- 兑现 → 状态改 `used`，填兑现章
- 距埋点超过 100 章仍 live → 状态改 `expired` 并列入 `open-threads.md` 或主动放弃
```

### `state/used-excitement.md`

```markdown
| 章 | 爽点类型 | 对手 / 场景 | interruption | 备注 |
|---|---|---|---|---|
| 1 | INFO | 家族族老 | delay | 信息给了但关键一句没说 |
| 2 | PWR | 同辈练气 | cost | 赢了但被目击 |
| 87 | REV+ID+PWR | 柳长风 | cost | 三连——但主角剑骨内伤 |

## 规则（与 anti-ai-tells §A / §M 联动）
- 最近 3 章同类 ≥ 2 次 → 下一章该类禁用
- 连续 5 章都有爽点 → 下一章必须安排"无爽点铺垫章"
- **每条记录必须填 `interruption`**（`delay` / `denied` / `cost` 三选一，反 M）
- `interruption` 为空 → 判定为 AI 爽点链条过完整，写入时回退
- 连续 3 章 `interruption` 同一种类 → 下一章必须换另外两种之一
```

### `state/used-patterns.md`

```markdown
# 最近 10 章 · 高频模式监控（反 B-扩展 / B / N 联动）

## 句式
- "XX 看着 YY"：最近 10 章出现 37 次 ← 过量
- "XX 没有回答"：最近 10 章出现 11 次
- "声音平静"：最近 10 章出现 9 次

## 动词
- 笑：已达阈值（已和 "扯嘴角"、"哼一声" 做差异化）

## 主语分布（反 B-扩展）
| 章 | top-1 主语 | 占比 | top-2 | 占比 | 省略主语段占比 |
|---|---|---|---|---|---|
| 85 | 叶无尘 | 38% | 他 | 22% | 12% |
| 86 | 他 | 46% | 叶无尘 | 18% | 9%  ← 超阈值 |
| 87 | 叶无尘 | 35% | 他 | 19% | 15% |

- 阈值：单章 top-1 主语段占比 ≤ 40%
- 连续 2 章超阈值 → 下一章禁用"他"开头段超过 30%

## 段长熵（反 B-扩展 / K）
| 章 | 段数 | 段长均值 | 段长标准差 | > 100 字段数 |
|---|---|---|---|---|
| 85 | 92 | 24 字 | 18 | 2 |
| 86 | 88 | 22 字 | 6  ← 过低 | 0 |
| 87 | 95 | 28 字 | 14 | 3 |

- 阈值：段长标准差 ≥ 8 字；每章 > 100 字的长段 ≥ 2
- 连续 2 章不达标 → 下一章强制补 3 段描写 / 心理 / 环境长段

## 非理性噪声（反 H-扩展）
| 章 | 主角 ≥ 300 字思考段数 | 其中含非理性噪声段数 |
|---|---|---|
| 85 | 2 | 2 |
| 86 | 3 | 1 ← 不足 |
| 87 | 2 | 2 |

- 阈值：思考段必须 100% 含至少 1 条非理性噪声
- 不达标 → 下一章强制补误判 / 走神 / 情绪干扰 / 杂念事件

## 质量曲线方差（反 N）
| 章 | 段落具象度均值 | 段落具象度方差 | 亮句数 | 粗糙句数 |
|---|---|---|---|---|
| 85 | 7.1 | 1.2 | 3 | 2 |
| 86 | 7.0 | 0.3  ← 过低 | 0 | 0 |
| 87 | 6.9 | 1.5 | 2 | 1 |

- 阈值：段落具象度方差 ≥ 0.8，每章至少 1 亮 1 粗糙
- 不达标 → 下一章成稿后强制挑 1 段亮化 + 1 段回退粗化

## 反派反应套餐监控（反 E-扩展）
| 章 | 反派名 | 标准套餐命中（脸色/冷汗/胸口/沉默/"不可能"） | signature 反应命中 |
|---|---|---|---|
| 87 | 柳长风 | 4 ← 超阈值 | 0 ← 未引用 |

- 阈值：标准套餐命中 ≤ 2，signature 反应命中 ≥ 2
- 不达标 → 下一章反派场景强制替换 2 项为 `characters/<反派>.md` 的 signature_reactions

## 灵魂渗透监控（反 O）
| 章 | 有名出场角色数 | 其中 ≥ 1 次灵魂渗透的角色数 | 纯功能性角色名单 |
|---|---|---|---|
| 85 | 5 | 4 | [王管事] |
| 86 | 4 | 2 | [柳长风, 无愁] ← 超阈值 |
| 87 | 6 | 6 | — |

- 阈值：当章所有有名出场角色必须 100% 有灵魂渗透
- 连续 2 章"纯功能性角色"非空 → 下一章强制给这些角色安排灵魂渗透段（≤ 50 字即可，只做存在确认）
- 动物 / 灵兽子监控：若该章动物出现且全部服务于主角意图 → 下一章必须补 1 处独立反应

## 动物 / 灵兽独立反应监控（反 O · species != 人）
| 章 | 动物 / 灵兽名 | 出现次数 | 独立反应次数 | 是否达标 |
|---|---|---|---|---|
| 87 | 小焰 | 3 | 1（主角紧张时它盯着一只飞虫） | ✓ |
| 87 | 青鸢 | 2 | 0（全部服务于指令） | ✗ |

- 阈值：每次出现 ≥ 50% 段落需带独立反应
- 不达标 → 下一章强制安排与主角指令无关的独立行动

## 「不是…是…」对照句监控（反 R-补充）

| 章 | `contrastive_negation_hits` | `keyzone_contrastive_negation_hits` | 是否达标 |
|---|---|---|---|
| 88 | 0 | 0 | ✓ |
| 89 | 1 | 0 或 1 | ✗ **回滚级** |

- **硬门**：两字段须**全章恒为 0**；**任一 ≥ 1** → **回滚级 FAIL**，本章不得落盘（须退回 `webnovel-plot-design` 全文清零后再检）。与 `anti-ai-tells.md` · **R-补充 / G-扩展 1** 同禁，不得以「只出现一次」「在对话里」放行。

## 定义体命中监控（反 G+1）

**说明**：下列「9 模板」统计用于 **G+1 中不含「不是…是…」骨架的余下定义体**（如破折号定义「X，意味着——Y」等仍可能单独命中）。凡正文出现「不是…，是… / 不是…、是… / 不是…，也不是…，是…」等 **R-补充** 指纹，**一律先按 R-补充 表判拒收**，**不得**用本表「≤2 次 PASS」间接放行。

| 章 | 9 模板总命中数（不含 R-补充 已单列之「不是…是…」） | 命中模板清单（示例） | 是否达标 |
|---|---|---|---|
| 85 | 1 | X 意味着 Y ×1 | ✓ |
| 86 | 3 | X 意味着 Y ×2；体感残缺式首现 ×1 | ✗ WARN |
| 87 | 0 | — | ✓ |

- 阈值：本表单章 ≤ 2 次（PASS/WARN）；3–4 次 FAIL；≥ 5 次**回滚级 FAIL**（整章退回 plot-design 重写）
- 连续 2 章 WARN → 下一章禁用本表所列**定义体排比腔**（仍须同时满足 **R-补充 两字段为 0**）
- 任一章回滚级 FAIL → 本章不得落盘

## 粗体使用监控（反 N-细 / E）
| 章 | 全章粗体总数 | 情绪 / 主题用 | 物理文本用 | 是否达标 |
|---|---|---|---|---|
| 87 | 1 | 0 | 1（招牌文字） | ✓ |

- 阈值：粗体总数 ≤ 1；情绪 / 主题 / 感悟 / 内心独白 / 点题句 = 0
- 情绪 / 主题用 ≥ 1 → **回滚级 FAIL**（回退 plot-design）
- 粗体 ≥ 3 → FAIL

## 情绪词独段监控（反 E）
| 章 | 情绪词独段次数 | 情绪词 + 粗体次数 | 是否达标 |
|---|---|---|---|
| 87 | 0 | 0 | ✓ |

- 阈值：独段 ≤ 1 次（PASS/WARN）；≥ 2 次 FAIL
- 情绪词 + 粗体 ≥ 1 次 → **回滚级 FAIL**

## 单句成段瀑布流监控（反 C · 2026-04 收紧）
| 章 | 最长连续单句段 | ≥ 3 段丛数 | 单句段占比 | 是否达标 |
|---|---|---|---|---|
| 87 | 2 | 0 | 0.28 | ✓ |

- 阈值：最长连续 ≤ 2 PASS；= 3 WARN；≥ 4 FAIL；≥ 6 或 丛数 ≥ 4 **回滚级 FAIL**
- 单句段占比 ≤ 0.3 PASS；0.3–0.4 WARN；0.4–0.5 FAIL；> 0.5 **回滚级 FAIL**

## 长段分布监控（反 K）
| 章 | > 80 字段数 | > 120 字段数 | 单句成段占比 | 是否达标 |
|---|---|---|---|---|
| 87 | 4 | 1 | 28% | ✓ |

- 阈值：长段（> 80 字）≥ 3 段，其中 ≥ 1 段 > 120 字；单句成段占比 ≤ 30%
- 全章 0 长段 → **回滚级 FAIL**

## 世界自主生活监控（反 D · 回滚级）
| 章 | 闲笔数 | 剧情无关闲笔 | 配角自主议题 | 选择机制触发 | 废选项次数 | 是否达标 |
|---|---|---|---|---|---|---|
| 87 | 7 | 3 | 1（王小二聊家事 120 字） | 2 | 1 | ✓ |

- 阈值：闲笔 ≥ 5（< 3 回滚级）；剧情无关闲笔 ≥ 2；配角自主议题 ≥ 1（= 0 回滚级）；含选择机制时 3 次触发内 ≥ 1 次废选项

## 想象力监控（反 P · 回滚级）
| 章 | 怪异预算 | 延迟兑付 | 5-清单已落盘 | 真实接续排名 | 是否达标 |
|---|---|---|---|---|---|
| 87 | 1（柯基涂鸦） | 2 | ✓ | 清单外 | ✓ |

- 阈值：怪异预算 ≥ 1（= 0 回滚级，退 story-blueprint）；延迟兑付 ≥ 1；5-清单必须落盘；真实接续 ≤ 3 回滚级

## 转场监控（反 Q · 回滚级）
| 章 | 切换次数 | 桥类型分布 | 桥声明 | 禁用词命中 | 瞬移切换 | 是否达标 |
|---|---|---|---|---|---|---|
| 87 | 3 | Q-1×1, Q-2×1, Q-4×1 | ✓ | 0 | 0 | ✓ |

- 阈值：禁用词 = 0（≥ 2 回滚级）；瞬移切换 = 0（≥ 1 回滚级）；桥声明必须完整；单一桥类型 ≥ 3 次 → 下一章禁用该类型

## 说明书句法监控（反 R · 回滚级）
| 章 | exclusion_enum_hits | tutorial_microstep_chain_max | catalog_afterthought_pairs | 是否达标 |
|---|---|---|---|---|
| 87 | 0 | 3 | 0 | ✓ |

- 阈值：`exclusion_enum_hits` = 0（≥ 2 回滚；= 1 且同章 `definition_style_hits ≥ 1` 回滚）；`tutorial_microstep_chain_max` ≤ 4（≥ 5 回滚）；`catalog_afterthought_pairs` = 0（≥ 1 回滚）

## 场景块分段监控（反 K-补充 · 与 Q 联动）
| 章 | k_scene_block_violations | 是否达标 |
|---|---|---|
| 87 | 1 | ✓ |

- 阈值：显著时空跳变（≥30 分钟或换建筑级）未用 Markdown 空行分段计 1 次违规；**≥ 5 次 / 章 → 回滚级 FAIL**

## 元叙事与章首抓眼监控（反 O-在场 / A-补充 · 回滚级）
| 章 | meta_language_hits | opening_hook_spike | curiosity_gap_markers | flat_atmosphere_streak_max | 是否达标 |
|---|---|---|---|---|---|
| 87 | 0 | ✓ | 5 | 3 | ✓ |

- 阈值：`meta_language_hits` = 0（≥ 1 回滚）；`opening_hook_spike` = true（false 回滚）；`curiosity_gap_markers` ≥ max(2, chapter_word_count // 1200)（不足回滚）；`flat_atmosphere_streak_max` ≤ 5（≥ 6 回滚）；`system_prompt_template_hits` ≤ 2（≥ 5 回滚）；`coincidence_chain_hits` ≤ 3（≥ 6 回滚）；`forced_detour_hits` ≤ 1（≥ 2 回滚）；`tech_jargon_density_per_1k` ≤ 8（> 12 回滚）；`tech_exposition_block_over_120` ≤ 1（≥ 3 回滚）；`tech_mechanism_closure_hits` ≤ 1（≥ 2 FAIL）；`lexeme_cluster_repeat_hits` ≤ 3（≥ 7 回滚）；`abstract_aura_token_density_per_1k` ≤ 10（> 18 回滚）；**`cultural_shorthand_clash_hits` ≥ 1**（= 0 回滚，反 P-补充2）；**`withhold_beat_present` = true**（false 为 FAIL 须补收束）

## 对话次文本监控（反 I-补充）
| 章 | dialogue_subtext_misalignment_hits | fully_matched_qa_chain_max | 是否达标 |
|---|---|---|---|
| 87 | 2 | 2 | ✓ |

- 阈值：高张力场景 `dialogue_subtext_misalignment_hits` ≥ 1；`fully_matched_qa_chain_max` ≤ 3（> 3 FAIL）

## 怪异预算题材种子监控（反 P-1 题材化）
| 章 | weirdness_seed_type | 是否重复 | 是否达标 |
|---|---|---|---|
| 87 | xuanhuan_rule_glitch | 否 | ✓ |

- 阈值：每章必须记录 `weirdness_seed_type`；连续 3 章同一类型 → 下一章强制换种子类型

## 章际对比矩阵（节奏变向硬门）
| 章 | relation_tension | mc_info_delta | chapter_mood | ending_hook_type |
|---|---|---|---|---|
| 85 | low | gain | 舒展 | info_hook |
| 86 | mid | flat | 悬置 | action_hook |
| 87 | mid | gain | 压抑 | emotion_hook |

- 阈值：任一维度连续 3 章同值 → 第 4 章该维度必须变向，否则 PERSIST FAIL

## 设定首现过载监控（反 G-细）
| 章 | 设定首次出现专名 | 同次携带结构信息项数 | 同次发言设定专名数 | 是否达标 |
|---|---|---|---|---|
| 87 | 无生剑 | 1（仅"剑名"） | 1 | ✓ |

- 阈值：首现只带 ≤ 1 项结构性信息；同次发言设定专名 ≤ 1
- ≥ 3 项结构信息 或 ≥ 2 个专名 → FAIL
- 强制首现模式：体感 / 转述 / 残缺（three modes，参考 foreshadow.md 的 `first_reveal_mode`）

## 规则汇总
- 任一句式 10 章内 ≥ 10 次 → 下一章禁用
- 任一指标连续 2 章超阈值 → 下一章强制修正
- 灵魂渗透监控任一行"纯功能性角色名单"非空 → 本章不得落盘，回退补写
- **任一"回滚级 FAIL" → 本章强制回退到对应 workflow 重做，不得落盘**
```

### `state/anti-trope-log.md`（反 P · 每章一条）

```markdown
# 反套路日志（反 P · 想象力贫血）

每章写作**之前**必须落盘本章的"最常见接续 5-清单"；写完后回填真实接续与排名，以及本章的怪异预算 / 延迟兑付。

## 第 87 章 · 一剑破阵
- 时间：YYYY-MM-DD HH:MM
- 场景 / 冲突上下文：叶无尘破阵成功，刚拿到无生剑中卷
- **最常见接续 5-清单（禁用前 3）**：
  1. 柳长风爆怒、喷血、立誓报复（禁用）
  2. 天剑宗弟子震惊下跪 / 恭维主角（禁用）
  3. 主角立刻翻开中卷、当场领悟新招（禁用）
  4. 柳长风沉默不语，后续章再动手
  5. 中卷被一位不相关路人顺走，引出支线
- **真实写的接续**：柳长风把剑扔进祖坛水井，转身走了
- **接续排名**：清单外（✓ PASS）
- **怪异预算**（剧情无法回收 ≥ 1 处）：
  - 演武场角落被画歪的柯基头像（无剧情功能）
- **延迟兑付**（≥ 5 章内不回收 ≥ 1 处）：
  - 叶无尘手腕内侧旧疤（预计 30+ 章后回收）
  - 天剑宗祖坛水井深处的光（预计终章附近回收）
- **反套路检查**：PASS / FAIL（接续 ≤ 3 即 FAIL，回滚级）
```

- 规则：
  - 写章前**必须**先落盘 1–3 项（5-清单 + 场景上下文），然后才能动笔
  - 写章后回填 4–6 项
  - 接续排名 ≤ 3 → 回滚级 FAIL（`webnovel-plot-design` 重做 P-4 预声明）
  - 怪异预算 = 0 → 回滚级 FAIL（回 `webnovel-story-blueprint` 补世界观）
  - 延迟兑付 = 0 → 普通 FAIL（回 plot-design）

## 设计原则

1. **只用 Markdown + YAML**。没有数据库，不依赖任何服务。
2. **按需加载**。常驻区 ≤ 3000 字：`book.yaml` + `fingerprint.md` + 当前 arc 文件 + 最近 3 章 `chapter-log` 条目 + `live` 伏笔 + 活跃人物（近 10 章出现过的）名字列表 **+ 本章预计出场 ≥ 2 次角色的 soul_fields 段 + 本章首次登场的关键角色 soul_fields 段（必载）** + `used-patterns.md` 最近 3 章的监控摘要（主语分布 / 段长熵 / 非理性噪声计数 / 质量方差 / 反派套餐命中 / 灵魂渗透缺位名单 / 动物独立反应缺位名单 / **definition_style_hits / bold_theme_hits / emotion_token_solo_paragraphs / emotion_token_bold / single_sentence_run_max / single_sentence_para_ratio / long_paras_over_80 / long_paras_over_120 / signature_明牌超限名单 / setting_reveal_overload_hits / transition_types 分布 / filler_density / side_char_autonomous_agenda 名单 / waste_option_ratio / exclusion_enum_hits / tutorial_microstep_chain_max / catalog_afterthought_pairs / k_scene_block_violations / meta_language_hits / opening_hook_spike / curiosity_gap_markers / flat_atmosphere_streak_max / system_prompt_template_hits / coincidence_chain_hits / forced_detour_hits / lexeme_cluster_repeat_hits / abstract_aura_token_density_per_1k / **cultural_shorthand_clash_hits / withhold_beat_present / dialogue_subtext_misalignment_hits / fully_matched_qa_chain_max / weirdness_seed_type / chapter_pacing_matrix / romance_arc_step / friendship_arc_step / romance_step_delta_from_prev / friendship_step_delta_from_prev / relationship_progression_beats / relationship_jump_without_cause_hits / relationship_jump_with_cause_hits / post_jump_emotional_turbulence_hits / combat_target_ratio / combat_presence_hits / protagonist_distinctive_traits_count / protagonist_initiative_conflict_hits / protagonist_impulse_or_humor_hits / protagonist_template_similarity_hits / contrastive_negation_hits / keyzone_contrastive_negation_hits**）+ `anti-trope-log.md` 最近 3 章的"真实接续"列表（避免下章复用）。
3. **索引可重建**。`index/volume_<VOLUME_NO>_index.md` 可自 `state/chapter_meta/ch*.yaml` 与既有 `chapters/ch*_*.md` 章号对照明细全量重建——坏掉丢弃重跑即可（**不得**从章节 `.md` 内解析 YAML，正文无元数据）。
4. **写多读少**。每次生成新章写入 ≥ 6 个文件（章节正文、对应 `state/chapter_meta/ch<NNNN>.yaml`、timeline、foreshadow、used-excitement、used-patterns、相关人物卡、arc 文件等）。
5. **监控驱动**。`used-patterns.md` 的每一列都是反 AI 味的硬阈值，下一章 prompt 必须读取并将超阈值项作为"本章禁用 / 强制补"输入。
