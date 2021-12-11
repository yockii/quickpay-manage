<template>
  <div
    class="full-width window-height row wrap justify-center items-center content-center"
  >
    <div class="col-md-3 col-sm-6 col-xs-8">
      <q-card>
        <q-card-section class="bg-blue text-white">
          <div class="text-h6 text-center">{{ $t("login") }}</div>
        </q-card-section>
        <q-card-section class="bg-blue-6 text-white">
          <q-input dark v-model="username" :label="$t('username')" />
          <q-input dark type="password" v-model="password" :label="$t('password')" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            @click="login"
            :loading="submitting"
            color="primary"
            class="full-width"
            >{{ $t("login") }}</q-btn
          >
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { user } from "../api/user";
import { useI18n } from "vue-i18n";
import { useQuasar } from "quasar";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
export default defineComponent({
  name: "PageLogin",
  setup() {
    const { t: $t } = useI18n();
    const $q = useQuasar();
    const $store = useStore();
    const $router = useRouter();

    const username = ref("");
    const password = ref("");
    const submitting = ref(false);
    async function login(props, ctx) {
      if (username.value === "" || password.value === "") {
        $q.dialog({
          title: $t("tips"),
          message: $t("usernameAndPasswordMustProvided"),
          ok: { label: $t("confirm") },
        });
        return;
      }
      submitting.value = true;
      try {
        const resp = await user.login({
          username: username.value,
          password: password.value,
        });
        if (resp.code === -10003) {
          // 登录失败
          $q.dialog({
            message: $t("loginFailed"),
            ok: { label: $t("confirm") },
          });
          return;
        }
        if (resp.code === 0) {
          const token = resp.data.token;
          const u = resp.data.user;
          await $store.dispatch("user/setToken", token);
          await $store.dispatch("user/setUser", u);
          await $store.dispatch("user/setResources", {
            isSuper: resp.data.isSuper,
            resources: resp.data.resources,
          });
          $router.replace("/main");
        } else {
          $q.dialog({
            message: $t("loginFailed"),
            ok: { label: $t("confirm") },
          });
          return;
        }
      } finally {
        submitting.value = false;
      }
    }
    return {
      username,
      password,
      submitting,
      login,
    };
  },
});
</script>

<style></style>
