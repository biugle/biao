# Security Policy

## 报告安全问题

请不要在公开 Issue 中发布可利用的漏洞、Token、Cookie、密码或真实用户数据。优先通过仓库维护者约定的私密渠道报告，并提供：

- 受影响的版本或 commit；
- 可复现步骤和最小示例；
- 影响范围和建议修复方向。

仓库没有内置生产密钥、登录服务或 Token 传输能力。Demo 中的账号只用于本地演示，生产项目必须接入自己的 SSO、网关或认证服务。

## 安全边界

- iframe Bridge 只传递脱敏身份、偏好和结构化事件。
- Token、Cookie、密码和 session id 不进入 Runtime Store 或 postMessage。
- 远程 APP 必须配置 ALLOWED_ORIGINS。
- 错误详情会做敏感字段脱敏，但生产仍应接入自己的监控和日志脱敏策略。
