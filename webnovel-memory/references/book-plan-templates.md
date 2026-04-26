# 全书企划模板（可直接复制）

> 用途：给 `全书企划/blocks-index.md` 与 `全书企划/blocks/block-<NNN>-ch<start>-ch<end>.md` 提供统一模板，避免每次手写结构跑偏。

## 1) `全书企划/blocks-index.md` 模板

```markdown
# 全书 Block 索引

## 使用说明
- 每 10 章为 1 个 Block，`block_id` 采用三位零填充（`001`、`002`...）。
- `status` 取值：`planned` / `in_progress` / `done` / `rework`.
- `completion_gate` 必须是“可验证”的完成条件，不写抽象话术。
- 每写完一章都更新 `written_chapters` 与 `next_chapter`.

| block_id | chapter_range | phase | status | completion_gate | written_chapters | next_chapter | detailed_outline_ready | updated_at |
|---|---|---|---|---|---|---|---|---|
| 001 | ch0001-ch0010 | Phase 1 | in_progress | 张永年内鬼线由“怀疑”进入“可验证证据” | ch0001-ch0007 | ch0008 | yes | 2026-04-26 |
| 002 | ch0011-ch0020 | Phase 1 | planned | 主角取得账房实际调度权，不再是名义账房 | - | ch0011 | no | 2026-04-26 |
```

---

## 2) `全书企划/blocks/block-<NNN>-ch<start>-ch<end>.md` 模板

```markdown
# Block <NNN>（ch<start>-ch<end>）· <Block标题>

## 本块定位
- 所属阶段：
- 主线层级（L1-L5）：
- 本块一句话目标：
- 本块结束状态（必须可验证）：

## 完成判据（Completion Gates）
- [ ] Gate-1：
- [ ] Gate-2：
- [ ] Gate-3：

## 禁止复用清单（Anti-Repeat）
- 禁复用桥段（最近 3 块已用）：
  - 
- 禁复用收束方式（最近 3 章已高频）：
  - 
- 禁复用爽点链路（最近 10 章已过载）：
  - 

## 未解线回收窗口（Foreshadow Windows）
| hook_id | 线索名 | 当前状态 | 建议回收窗口 | 最晚回收章 | 备注 |
|---|---|---|---|---|---|
| F-xxx |  | live | ch<start+2>-ch<end+3> | ch<end+10> |  |

## 10章标题梗概（粗纲）
1. ch<start>：
2. ch<start+1>：
3. ch<start+2>：
4. ch<start+3>：
5. ch<start+4>：
6. ch<start+5>：
7. ch<start+6>：
8. ch<start+7>：
9. ch<start+8>：
10. ch<end>：

## 详细10章纲要（Block首章前必须完整）
- ch<start>：
  - 章目标：
  - 关键冲突：
  - 本章钩子：
- ch<start+1>：
  - 章目标：
  - 关键冲突：
  - 本章钩子：
- ch<start+2>：
  - 章目标：
  - 关键冲突：
  - 本章钩子：
- ch<start+3>：
  - 章目标：
  - 关键冲突：
  - 本章钩子：
- ch<start+4>：
  - 章目标：
  - 关键冲突：
  - 本章钩子：
- ch<start+5>：
  - 章目标：
  - 关键冲突：
  - 本章钩子：
- ch<start+6>：
  - 章目标：
  - 关键冲突：
  - 本章钩子：
- ch<start+7>：
  - 章目标：
  - 关键冲突：
  - 本章钩子：
- ch<start+8>：
  - 章目标：
  - 关键冲突：
  - 本章钩子：
- ch<end>：
  - 章目标：
  - 关键冲突：
  - 本章钩子：

## 进度追踪（每章写后更新）
- 已写章节：
- 下一章：
- 与原计划偏差：
- 下章纠偏动作：
- updated_at：
```

---

## 3) 最小执行规则（落盘时机）

- Block 首章开写前：必须存在该 Block 文件，且“详细10章纲要”非空。
- 每章写完后：必须更新
  - `全书企划/blocks-index.md` 对应行
  - 当前 Block 文件的“进度追踪”
- 若本章导致本块目标变化：同步更新“完成判据”和“未解线回收窗口”。
