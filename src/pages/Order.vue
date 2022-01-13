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
      <q-input v-model="condition.merchantName" :label="$t('order.merchantName')" />
      <q-input v-model="condition.remark" :label="$t('order.remark')" />
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

            <q-btn
              flat
              color="primary"
              round
              icon="update"
              @click="openUpdateDialog(props.row)"
            >
              <q-tooltip>{{ $t("update") }}</q-tooltip>
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
            <q-field :label="$t('order.id')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.id }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-6">
            <q-field :label="$t('order.channelCode')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.channelCode }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-6">
            <q-field :label="$t('order.tradeId')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.tradeId }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-6">
            <q-field :label="$t('order.amount')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.amount / 100 || 0.0 }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-6">
            <q-field :label="$t('order.fee')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.fee / 100 || 0.0 }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-6">
            <q-field :label="$t('order.channelFee')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.channelFee / 100 || 0.0 }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-6">
            <q-field :label="$t('order.payerName')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.payerName }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-6">
            <q-field :label="$t('order.payerMobile')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.payerMobile }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-6">
            <q-field :label="$t('order.payerVirtualAddress')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.payerVirtualAddress }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-6">
            <q-field :label="$t('order.state')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ $t(`order.state${instance.state}`) }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-12">
            <q-field :label="$t('order.remark')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.remark }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-6">
            <q-field :label="$t('order.successTime')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.successTime }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-6">
            <q-field :label="$t('order.createTime')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.createTime }}
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

  <q-dialog v-model="dialogUpdate">
    <q-card style="width: 600px; max-width: 80vw" class="q-px-sm q-pb-md">
      <q-card-section>
        <div class="text-h6">{{ $t("update") }}</div>
      </q-card-section>
      <q-card-section>
        <q-input :label="$t('order.remark')" v-model="instance.remark" />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat :label="$t('cancel')" v-close-popup />
        <q-btn :label="$t('confirm')" @click="update" />
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
        name: "merchantName",
        label: $t("order.merchantName"),
        align: "center",
        field: (row) => row.merchantName,
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
        name: "remark",
        label: $t("order.remark"),
        align: "left",
        field: (row) => row.remark,
        format: (val) =>
          val ? (val.length > 36 ? val.substring(0, 34) + "..." : val) : "",
      },
      {
        name: "createTime",
        label: $t("order.createTime"),
        align: "center",
        field: (row) => row.createTime,
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
      merchantName: "",
      remark: "",
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
          channelCode: condition.value.channelCode,
          tradeId: condition.value.tradeId,
          merchantName: condition.value.merchantName,
          remark: condition.value.remark,
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

    const dialogUpdate = ref(false);
    function openUpdateDialog(row) {
      setInstance(row);
      dialogUpdate.value = true;
    }
    async function update() {
      try {
        const resp = await payOrder.update({
          id: instance.value.id,
          remark: instance.value.remark,
        });
        if (resp.code === 0) {
          $q.dialog({ message: $t("success") });
          dialogUpdate.value = false;
          getData({ pagination: pagination.value });
        } else if (resp.code === -10005) {
          $.dialog({ message: $t("duplicate") });
        }
      } finally {
      }
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
      dialogUpdate,
      openUpdateDialog,
      update,
    };
  },
});
</script>

<style></style>
