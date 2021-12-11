<template>
  <q-page class="q-pa-md q-gutter-md">
    <q-breadcrumbs>
      <q-breadcrumbs-el icon="home" />
      <q-breadcrumbs-el :label="$t('navigation.order')" icon="reorder" />
    </q-breadcrumbs>
    <!-- 筛选条件 -->
    <div class="items-start q-gutter-md row">
      <q-input v-model="condition.id" :label="$t('order.id')" />
      <q-input v-model="condition.tradeId" :label="$t('order.tradeId')" />
      <q-input v-model="condition.channelCode" :label="$t('order.channelCode')" />
      <!-- <q-space /> -->
      <q-btn class="self-end" icon="search" @click="getData({ pagination })">
        <q-tooltip>{{ $t("search") }}</q-tooltip>
      </q-btn>
    </div>
    <!-- 表格 -->
    <q-table
      :rows="rows"
      :columns="columns"
      row-key="id"
      v-model:pagination="pagination"
      :loading="loading"
      @request="getData"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">{{
            col.label
          }}</q-th>
          <q-th>{{ $t("operation") }}</q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">{{
            col.value
          }}</q-td>
          <q-td class="text-right">
            <q-btn
              flat
              color="primary"
              round
              icon="o_info"
              @click="openInfoDialog(props.row)"
            >
              <q-tooltip>{{ $t("showDetail") }}</q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>

  <q-dialog v-model="dialogInfo">
    <q-card style="width: 600px; max-width: 80vw" class="q-px-sm q-pb-md">
      <q-card-section>
        <div class="text-h6">{{ $t("detail") }}</div>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col-6">
            <q-field :label="$t('channel.name')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.name }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-6">
            <q-field :label="$t('channel.code')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.code }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-6">
            <q-select
              readonly
              :label="$t('channel.type')"
              v-model="instance.type"
              :options="typeOptions"
              emit-value
              map-options
            />
          </div>
          <div class="col-6">
            <q-select
              readonly
              :label="$t('channel.state')"
              v-model="instance.state"
              :options="stateOptions"
              emit-value
              map-options
            />
          </div>
          <div class="col-6">
            <q-field :label="$t('channel.balance')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.balance || 0.0 }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-6">
            <q-field :label="$t('channel.frozen')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.frozen || 0.0 }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-6">
            <q-field :label="$t('channel.totalIncome')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.totalIncome || 0.0 }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-6">
            <q-field :label="$t('channel.totalRealIncome')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.totalRealIncome || 0.0 }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-6">
            <q-field :label="$t('channel.totalPayout')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.totalPayout || 0.0 }}
                </div>
              </template>
            </q-field>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn :label="$t('confirm')" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { payOrder } from "../api/payOrder";
import { useI18n } from "vue-i18n";
import { useQuasar } from "quasar";
export default defineComponent({
  name: "PageOrder",
  setup() {
    const { t: $t } = useI18n();
    const $q = useQuasar();

    const columns = [
      {
        name: "id",
        label: $t("order.id"),
        align: "center",
        field: (row) => row.id,
        format: (val) => `${val}`,
      },
      {
        name: "merchantId",
        label: $t("order.merchantId"),
        align: "center",
        field: (row) => row.merchantId,
        format: (val) => `${val}`,
      },
      {
        name: "channelCode",
        label: $t("order.channelCode"),
        align: "center",
        field: (row) => row.channelCode,
        format: (val) => `${val}`,
      },
      {
        name: "tradeId",
        label: $t("order.tradeId"),
        align: "center",
        field: (row) => row.tradeId,
        format: (val) => `${val}`,
      },
      {
        name: "amount",
        label: $t("order.amount"),
        align: "center",
        field: (row) => row.amount,
        format: (val) => (val ? `${val / 100}` : "0.00"),
      },
      {
        name: "fee",
        label: $t("order.fee"),
        align: "center",
        field: (row) => row.fee,
        format: (val) => (val ? `${val / 100}` : "0.00"),
      },
      {
        name: "channelFee",
        label: $t("order.channelFee"),
        align: "center",
        field: (row) => row.channelFee,
        format: (val) => (val ? `${val / 100}` : "0.00"),
      },
      {
        name: "payUser",
        label: $t("order.payUser"),
        align: "center",
        field: (row) => row.payUser,
        format: (val) => `${val}`,
      },
      {
        name: "state",
        label: $t("order.state"),
        align: "center",
        field: (row) => row.state,
        format: (val) => {
          switch (val) {
            case 1:
              return $t("order.state1");
            case 2:
              return $t("order.state2");
            case 3:
              return $t("order.state3");
            case 4:
              return $t("order.state4");
            case 9:
              return $t("order.state9");
          }
          return "";
        },
      },
      {
        name: "notifyState",
        label: $t("order.notifyState"),
        align: "center",
        field: (row) => row.notifyState,
        format: (val) =>
          val == 1
            ? $t("order.notifyState1")
            : val == 2
            ? $t("order.notifyState2")
            : $t("order.notifyState3"),
      },
    ];
    const condition = ref({
      id: "",
      channelCode: "",
      tradeId: "",
    });
    const instance = ref({
      id: "",
      merchantId: "",
      channelId: "",
      channelCode: "",
      subChannelId: "",
      merchantChannelId: "",
      tradeId: "",
      amount: 0,
      fee: 0,
      channelFee: 0,
      payUser: "",
      remark: "",
      payerName: "",
      payerMobile: "",
      payerVirtualAddress: "",
      state: 0,
      notifyState: 0,
      repairFlag: 0,
      successTime: "",
      createTime: "",
    });
    const rows = ref([]);
    const loading = ref(false);
    const pagination = ref({
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0,
    });
    async function getData(props) {
      loading.value = true;
      const { page, rowsPerPage } = props.pagination;
      const offset = (page - 1) * rowsPerPage;
      try {
        const resp = await payOrder.paginate({
          offset,
          limit: rowsPerPage,
          id: condition.value.id,
          name: condition.value.name,
        });
        if (resp.code === 0) {
          rows.value = resp.data.items || [];
          pagination.value.page = page;
          pagination.value.rowsPerPage = rowsPerPage;
          pagination.value.rowsNumber = resp.data.total;
        }
      } finally {
        loading.value = false;
      }
    }

    function setInstance(row) {
      instance.value = row;
    }
    const dialogInfo = ref(false);
    function openInfoDialog(row) {
      setInstance(row);
      dialogInfo.value = true;
    }

    onMounted(() => {
      getData({ pagination: pagination.value });
    });
    return {
      condition,
      instance,
      columns,
      rows,
      loading,
      pagination,
      getData,
      dialogInfo,
      openInfoDialog,
    };
  },
});
</script>

<style></style>
