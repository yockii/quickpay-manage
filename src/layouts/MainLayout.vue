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

    <q-drawer :width="225" v-model="leftDrawerOpen" show-if-above bordered>
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

    const allLinksList = [
      {
        title: $t("navigation.merchant"),
        caption: $t("navigation.merchantCaption"),
        icon: "shopping_basket",
        to: "/merchant",
      },
      {
        title: $t("navigation.channel"),
        caption: $t("navigation.channelCaption"),
        icon: "streetview",
        to: "/channel",
      },
      {
        title: $t("navigation.order"),
        caption: $t("navigation.orderCaption"),
        icon: "reorder",
        to: "/order",
      },
      {
        title: $t("navigation.payoutOrder"),
        caption: $t("navigation.payoutOrderCaption"),
        icon: "reorder",
        to: "/payoutOrder",
      },
      {
        title: $t("navigation.user"),
        caption: $t("navigation.userCaption"),
        icon: "person",
        to: "/user",
      },
      {
        title: $t("navigation.authorize"),
        caption: $t("navigation.authorizeCaption"),
        icon: "verified_user",
        to: "/role",
      },
      {
        title: $t("navigation.settings"),
        caption: $t("navigation.settingsCaption"),
        icon: "settings",
        to: "/settings",
      },
    ];

    let linksList = [];
    if ($store.state.user.isSuper) {
      linksList = allLinksList;
    } else {
      //TODO 权限
      linksList = allLinksList;
    }

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
