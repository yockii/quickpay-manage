<template>
  <q-page class="q-pa-md q-gutter-md">
    <q-breadcrumbs>
      <q-breadcrumbs-el icon="home" />
      <q-breadcrumbs-el :label="$t('navigation.settings')" icon="settings" />
      <q-breadcrumbs-el label="Payg Contact Setting" />
    </q-breadcrumbs>
    <div class="row">
      <q-select
        class="col-6"
        :label="$t('subChannel.subName')"
        option-value="id"
        v-model="instance.subChannelId"
        :options="subChannels"
        :option-label="(item) => (item === null ? '' : item.subName)"
        emit-value
        map-options
        @update:model-value="getData"
      />
      <q-input class="col-6" v-model="instance.name" :label="$t('odinmo.name')" />
      <q-input
        class="col-6"
        v-model="instance.senderMobileNumber"
        :label="$t('odinmo.senderMobileNumber')"
      />
      <q-input class="col-6" v-model="instance.city" :label="$t('odinmo.city')" />
      <q-input class="col-6" v-model="instance.state" :label="$t('odinmo.state')" />
      <q-input class="col-6" v-model="instance.address" :label="$t('odinmo.address')" />
      <q-input class="col-6" v-model="instance.pinCode" :label="$t('odinmo.pinCode')" />
      <q-select
        readonly
        class="col-6"
        :label="$t('odinmo.status')"
        v-model="instance.status"
        :options="stateOptions"
        emit-value
        map-options
      />
    </div>
    <q-btn
      v-if="instance.id == ''"
      color="primary"
      :label="$t('confirm')"
      @click="save"
    />
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { odinmoSender } from "../api/odinmoSender";
import { channel } from "../api/channel";
import { subChannel } from "../api/subChannel";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
export default defineComponent({
  name: "PageOdinmoSender",
  setup() {
    const { t: $t } = useI18n();
    const $q = useQuasar();
    const $router = useRouter();

    const subChannels = ref([]);
    const instance = ref({
      id: "",
      channelId: "",
      subChannelId: "",
      name: "",
      senderMobileNumber: "",
      city: "",
      state: "",
      pinCode: "",
      address: "",
      status: 0,
    });

    async function getData() {
      const resp = await odinmoSender.get({ subChannelId: instance.value.subChannelId });
      if (resp.code === 0 && resp.data) {
        instance.value = resp.data;
      } else {
        instance.value.id = "";
        instance.value.name = "";
        instance.value.senderMobileNumber = "";
        instance.value.city = "";
        instance.value.state = "";
        instance.value.pinCode = "";
        instance.value.address = "";
        instance.value.status = 0;
      }
    }

    const stateOptions = ref([
      { label: $t("odinmoSender.status1"), value: 1 },
      { label: $t("odinmoSender.status0"), value: 0 },
    ]);

    async function save() {
      if (instance.value.id && instance.value.id != "") {
        // update
      } else {
        const resp = await odinmoSender.add(instance.value);
        if (resp.code === 0) {
          $q.dialog({ message: $t("success") });
        }
      }
    }

    onMounted(async () => {
      let resp = await channel.paginate({ offset: -1, limit: -1, code: "odinmo" });
      if (resp.code === 0) {
        if (resp.data.items && resp.data.items.length > 0) {
          const c = resp.data.items[0];
          instance.value.channelId = c.id;
          let response = await subChannel.paginate({
            offset: -1,
            limit: -1,
            channelId: c.id,
          });
          if (response.code === 0) {
            subChannels.value = response.data.items || [];
            return;
          }
        }
      }
      $q.dialog({ message: "No Odinmo Channel", persistent: true }).onOk(() => {
        $router.push("/settings");
      });
    });
    return {
      subChannels,
      instance,
      getData,
      stateOptions,
      save,
    };
  },
});
</script>

<style></style>
