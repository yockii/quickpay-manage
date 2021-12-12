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
      <q-input
        class="col-6"
        v-model="instance.companyName"
        :label="$t('paygContact.companyName')"
      />
      <q-input
        class="col-6"
        v-model="instance.firstName"
        :label="$t('paygContact.firstName')"
      />
      <q-input
        class="col-6"
        v-model="instance.lastName"
        :label="$t('paygContact.lastName')"
      />
      <q-input
        class="col-6"
        v-model="instance.address"
        :label="$t('paygContact.address')"
      />
      <q-input class="col-6" v-model="instance.city" :label="$t('paygContact.city')" />
      <q-input class="col-6" v-model="instance.state" :label="$t('paygContact.state')" />
      <q-input
        class="col-6"
        v-model="instance.zipCode"
        :label="$t('paygContact.zipCode')"
      />
      <q-input
        class="col-6"
        v-model="instance.country"
        :label="$t('paygContact.country')"
      />
      <q-input
        class="col-6"
        v-model="instance.mobileNo"
        :label="$t('paygContact.mobileNo')"
      />
      <q-input class="col-6" v-model="instance.email" :label="$t('paygContact.email')" />
      <q-select
        readonly
        class="col-6"
        :label="$t('paygContact.status')"
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
import { paygContact } from "../api/paygContact";
import { channel } from "../api/channel";
import { subChannel } from "../api/subChannel";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
export default defineComponent({
  name: "PagePaygContact",
  setup() {
    const { t: $t } = useI18n();
    const $q = useQuasar();
    const $router = useRouter();

    const subChannels = ref([]);
    const instance = ref({
      id: "",
      channelId: "",
      subChannelId: "",
      companyName: "",
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      mobileNo: "",
      email: "",
      status: 0,
    });

    async function getData() {
      const resp = await paygContact.get({ subChannelId: instance.value.subChannelId });
      if (resp.code === 0 && resp.data) {
        instance.value = resp.data;
      } else {
        instanct.id = "";
        instanct.channelId = "";
        instanct.subChannelId = "";
        instanct.companyName = "";
        instanct.firstName = "";
        instanct.lastName = "";
        instanct.address = "";
        instanct.city = "";
        instanct.state = "";
        instanct.zipCode = "";
        instanct.country = "";
        instanct.mobileNo = "";
        instanct.email = "";
        instanct.status = 0;
      }
    }

    const stateOptions = ref([
      { label: $t("paygContact.stateCreated"), value: 1 },
      { label: $t("paygContact.stateFailed"), value: -1 },
    ]);

    async function save() {
      if (instance.value.id && instance.value.id != "") {
        // update
      } else {
        const resp = await paygContact.add(instance.value);
        if (resp.code === 0) {
          $q.dialog({ message: $t("success") });
        }
      }
    }

    onMounted(async () => {
      let resp = await channel.paginate({ offset: -1, limit: -1, code: "payg" });
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
      $q.dialog({ message: "No Payg Channel" }).onOk(() => {
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
