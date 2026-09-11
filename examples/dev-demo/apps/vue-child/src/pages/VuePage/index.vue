<script setup lang="ts">
import { computed, ref } from "vue";
import "./styles.css";

interface PageContext {
  portalCode?: string;
  environment?: string;
  locale?: string;
  timezone?: string;
  theme?: string;
  direction?: string;
  code?: string;
  auth?: { authenticated: boolean; user?: { name?: string } };
}

const props = defineProps<{ context?: PageContext }>();
const count = ref(0);
const hostName = computed(() => props.context?.portalCode || "独立运行");
</script>

<template>
  <section class="vue-demo-page">
    <p class="vue-demo-eyebrow">Vue 3 Adapter</p>
    <h1>Vue 3 独立子应用</h1>
    <p>页面由 Vue 3 编写，通过 Biu Adapter 接入基座。</p>
    <dl class="vue-demo-context">
      <div>
        <dt>当前门户</dt>
        <dd>{{ hostName }}</dd>
      </div>
      <div>
        <dt>运行环境</dt>
        <dd>{{ props.context?.environment || "local" }}</dd>
      </div>
      <div>
        <dt>当前语言</dt>
        <dd>{{ props.context?.locale || "zh-CN" }}</dd>
      </div>
      <div>
        <dt>时区</dt>
        <dd>{{ props.context?.timezone || "Asia/Shanghai" }}</dd>
      </div>
      <div>
        <dt>主题</dt>
        <dd>{{ props.context?.theme || "light" }}</dd>
      </div>
      <div>
        <dt>布局方向</dt>
        <dd>{{ props.context?.direction || "ltr" }}</dd>
      </div>
      <div>
        <dt>页面 Code</dt>
        <dd>{{ props.context?.code || "VuePage" }}</dd>
      </div>
      <div>
        <dt>登录状态</dt>
        <dd>
          {{ props.context?.auth?.authenticated ? `SSO · ${props.context?.auth?.user?.name || "已登录"}` : "未登录" }}
        </dd>
      </div>
    </dl>
    <button type="button" @click="count += 1">Vue 计数：{{ count }}</button>
  </section>
</template>
