import { useEffect, useState } from "react";
import { BiuStatusView, CopyButton, useBiuContext, useBiuI18n, useBiuLayoutControl } from "@biugle/biu-runtime";
import { BiuTooltip, biuMessage, fireDrawer, fireModal, fireRender } from "@biugle/biu-ui";
import "./FoundationShowcase.css";

const showcaseMenuKey = "system-config/system-basic/PageA";

export default function FoundationShowcase() {
  const { $t } = useBiuI18n();
  const context = useBiuContext();
  const { layoutOverrides, setLayoutOverrides, resetLayoutOverrides } = useBiuLayoutControl();
  const [eventLog, setEventLog] = useState<string[]>([]);
  const [result, setResult] = useState("等待操作");

  useEffect(() => {
    return context.events.subscribe("showcase:ping", (event) => {
      setEventLog((current) =>
        [`${event.source || "unknown"}: ${JSON.stringify(event.payload)}`, ...current].slice(0, 5),
      );
    });
  }, [context.events]);

  const openModal = () => {
    fireModal({
      title: "基座 Modal",
      children: <p>Modal 由 fire(modal) 挂载到当前文档 body，支持遮罩、Esc 和点击空白关闭。</p>,
    });
  };

  const openDrawer = () => {
    fireDrawer({
      title: "基座 Drawer",
      placement: "right",
      children: <p>Drawer 是统一的基础容器，业务表单和接口请求由项目自行实现。</p>,
    });
  };

  const openBodyNode = () => {
    fireRender((close) => (
      <aside className="biu-showcase-body-node">
        <strong>fireRender 自定义内容</strong>
        <p>这是普通 React 内容，不依赖 Portal 布局。</p>
        <button type="button" onClick={close}>
          关闭
        </button>
      </aside>
    ));
  };

  const publishEvent = () => {
    context.events.publish("showcase:ping", { at: new Date().toISOString() }, context.appId);
    setResult("事件已发布，当前页面订阅器会收到消息");
  };

  const navigateByKey = () => {
    const success = context.navigateByKey(showcaseMenuKey);
    setResult(success ? `已按完整 key 导航：${showcaseMenuKey}` : "导航失败，请检查菜单权限");
  };

  const navigateByPath = () => {
    const success = context.navigate("/Dashboard");
    setResult(success ? "已按路由路径导航到 Dashboard" : "路由不存在");
  };

  const showStatus = (status: 403 | 404 | 500) => {
    fireModal({
      title: `状态页 ${status}`,
      children: <BiuStatusView status={status} details="这是 Demo 触发的状态兜底页面" locale={context.locale} />,
    });
  };

  return (
    <main className="biu-showcase-page">
      <header className="biu-showcase-header">
        <div>
          <p className="biu-showcase-eyebrow">BIU FOUNDATION PLAYGROUND</p>
          <h1>基座能力验收</h1>
          <p>集中验证组件、路由、事件、布局控制和当前运行上下文。</p>
        </div>
        <div className="biu-showcase-context">
          <strong>{context.appId}</strong>
          <span>{context.currentPath || "/"}</span>
        </div>
      </header>

      <section className="biu-showcase-grid">
        <article className="biu-showcase-card">
          <h2>Message / 弹层</h2>
          <p>验证统一消息和 body 挂载能力。</p>
          <div className="biu-showcase-actions">
            <button type="button" onClick={() => biuMessage.success("Success message")}>
              Success
            </button>
            <button type="button" onClick={() => biuMessage.info("Info message")}>
              Info
            </button>
            <button type="button" onClick={() => biuMessage.warning("Warning message")}>
              Warning
            </button>
            <button type="button" onClick={() => biuMessage.error("Error message")}>
              Error
            </button>
            <button type="button" onClick={openModal}>
              Modal
            </button>
            <button type="button" onClick={openDrawer}>
              Drawer
            </button>
            <button type="button" onClick={openBodyNode}>
              fireRender
            </button>
          </div>
        </article>

        <article className="biu-showcase-card">
          <h2>Tooltip / Copy</h2>
          <p>Tooltip 仅对真实溢出文本展示，复制组件使用统一反馈。</p>
          <BiuTooltip content="这是一段完整的超长 Tooltip 内容，用于验证自动避障和溢出判断。">
            <span className="biu-showcase-overflow">这是一段会溢出的长文本，用于验证 Tooltip</span>
          </BiuTooltip>
          <div className="biu-showcase-actions">
            <CopyButton value={`route=${context.currentPath || "/"}\napp=${context.appId}`} locale={context.locale} />
            <button type="button" onClick={() => showStatus(403)}>
              403
            </button>
            <button type="button" onClick={() => showStatus(404)}>
              404
            </button>
            <button type="button" onClick={() => showStatus(500)}>
              500
            </button>
          </div>
        </article>

        <article className="biu-showcase-card">
          <h2>事件总线</h2>
          <p>验证当前门户内发布、订阅和来源信息。</p>
          <button type="button" onClick={publishEvent}>
            发布 showcase:ping
          </button>
          <p className="biu-showcase-result">{result}</p>
          <ul className="biu-showcase-event-list">
            {eventLog.length ? (
              eventLog.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)
            ) : (
              <li>暂无事件</li>
            )}
          </ul>
        </article>

        <article className="biu-showcase-card">
          <h2>路由 / 菜单 Key</h2>
          <p>页面身份使用完整菜单链路，避免同名末级菜单冲突。</p>
          <code>{showcaseMenuKey}</code>
          <code>{context.resolveMenuPath("PageA", showcaseMenuKey) || "未解析"}</code>
          <div className="biu-showcase-actions">
            <button type="button" onClick={navigateByKey}>
              navigateByKey
            </button>
            <button type="button" onClick={navigateByPath}>
              navigate(path)
            </button>
          </div>
        </article>

        <article className="biu-showcase-card">
          <h2>布局控制 / Context</h2>
          <p>这些覆盖只作用于当前页面，离开页面后自动恢复。</p>
          <div className="biu-showcase-context-list">
            <span>locale: {context.locale || "zh-CN"}</span>
            <span>theme: {context.theme || "light"}</span>
            <span>timezone: {context.timezone || "Asia/Shanghai"}</span>
            <span>direction: {context.direction || "ltr"}</span>
            <span>auth: {context.auth?.authenticated ? "authenticated" : "guest"}</span>
          </div>
          <div className="biu-showcase-actions">
            <button
              type="button"
              onClick={() => setLayoutOverrides({ hideSidebar: true, hideTabs: true, hideBreadcrumb: true })}
            >
              隐藏基座区域
            </button>
            <button type="button" onClick={resetLayoutOverrides}>
              恢复布局
            </button>
            <button type="button" onClick={() => context.reloadMenus()}>
              重新读取菜单
            </button>
            <button type="button" onClick={() => context.reloadLocale()}>
              重新读取语言
            </button>
          </div>
          <small>当前覆盖：{Object.keys(layoutOverrides).join(", ") || "无"}</small>
        </article>

        <article className="biu-showcase-card">
          <h2>当前能力状态</h2>
          <p>用于快速确认门户 A 的配置是否已传入 Runtime。</p>
          <dl className="biu-showcase-context-list">
            <div>
              <dt>portal</dt>
              <dd>{context.portalCode || "-"}</dd>
            </div>
            <div>
              <dt>code</dt>
              <dd>{context.currentCode || "-"}</dd>
            </div>
            <div>
              <dt>environment</dt>
              <dd>{context.environment || "local"}</dd>
            </div>
            <div>
              <dt>permission</dt>
              <dd>{context.permissionCodes ? `${context.permissionCodes.size} codes` : "not configured"}</dd>
            </div>
          </dl>
          <p className="biu-showcase-hint">{$t("切换语言、主题、时区和方向后，可回到这里确认上下文同步。")}</p>
        </article>
      </section>
    </main>
  );
}
