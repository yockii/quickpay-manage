<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          {{ $t("siteTitle") }}
        </q-toolbar-title>

        <div>{{ username }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> {{ $t("navigationCaption") }} </q-item-label>

        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from "components/EssentialLink.vue";

import { defineComponent, ref, computed } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const $store = useStore();
    const { t: $t } = useI18n();

    const linksList = [
      {
        title: $t("navigation.merchant"),
        caption: $t("navigation.merchantCaption"),
        icon: "school",
        link: "https://quasar.dev",
      },
      {
        title: "渠道管理",
        caption: "支付渠道",
        icon: "code",
        link: "https://github.com/quasarframework",
      },
      {
        title: "订单管理",
        caption: "chat.quasar.dev",
        icon: "chat",
        link: "https://chat.quasar.dev",
      },
      {
        title: "用户管理",
        caption: "forum.quasar.dev",
        icon: "record_voice_over",
        link: "https://forum.quasar.dev",
      },
      {
        title: "权限管理",
        caption: "@quasarframework",
        icon: "rss_feed",
        link: "https://twitter.quasar.dev",
      },
    ];

    const leftDrawerOpen = ref(false);
    const username = computed(() => {
      return $store.state.user.user.username;
    });
    return {
      username,
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
