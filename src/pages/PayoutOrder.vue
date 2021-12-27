<template>
  <q-page class="q-pa-md q-gutter-md">
    <q-breadcrumbs>
      <q-breadcrumbs-el icon="home" />
      <q-breadcrumbs-el :label="$t('navigation.payoutOrder')" icon="reorder" />
    </q-breadcrumbs>
    <!-- 筛选条件 -->
    <div class="items-start q-gutter-md row">
      <q-input v-model="condition.id" :label="$t('payoutOrder.id')" />
      <q-input v-model="condition.tradeId" :label="$t('payoutOrder.tradeId')" />
      <q-input v-model="condition.channelCode" :label="$t('payoutOrder.channelCode')" />
      <q-input v-model="condition.merchantName" :label="$t('payoutOrder.merchantName')" />
      <q-select
        v-model="condition.status"
        :label="$t('payoutOrder.status')"
        :options="[
          { label: 'All Status', value: 0 },
          { label: $t('payoutOrder.status1'), value: 1 },
          { label: $t('payoutOrder.status2'), value: 2 },
          { label: $t('payoutOrder.status3'), value: 3 },
          { label: $t('payoutOrder.status4'), value: 4 },
          { label: $t('payoutOrder.status5'), value: 5 },
          { label: $t('payoutOrder.status6'), value: 6 },
          { label: $t('payoutOrder.status01'), value: -1 },
          { label: $t('payoutOrder.status02'), value: -2 },
          { label: $t('payoutOrder.status03'), value: -3 },
        ]"
        emit-value
        map-options
      />
      <q-input
        v-model="condition.createTimeRange.start"
        :label="$t('startTime')"
        readonly
      >
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date
                v-model="condition.createTimeRange.start"
                mask="YYYY-MM-DD HH:mm:ss"
              >
                <div class="row items-center justify-end">
                  <q-btn v-close-popup :label="$t('close')" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-time
                v-model="condition.createTimeRange.start"
                mask="YYYY-MM-DD HH:mm:ss"
                format24h
              >
                <div class="row items-center justify-end">
                  <q-btn v-close-popup :label="$t('close')" color="primary" flat />
                </div>
              </q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <q-input v-model="condition.createTimeRange.end" :label="$t('endTime')">
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="condition.createTimeRange.end" mask="YYYY-MM-DD HH:mm:ss">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup :label="$t('close')" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-time
                v-model="condition.createTimeRange.end"
                mask="YYYY-MM-DD HH:mm:ss"
                format24h
              >
                <div class="row items-center justify-end">
                  <q-btn v-close-popup :label="$t('close')" color="primary" flat />
                </div>
              </q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
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
            <q-btn icon="auto_fix_high" color="primary" flat round>
              <q-tooltip>{{ $t("fixOrder") }}</q-tooltip>
              <q-popup-proxy>
                <q-btn-group>
                  <q-btn icon="add_to_drive" @click="fixOrder(props.row, -3)"
                    ><q-tooltip>{{ $t("payoutOrder.status03") }}</q-tooltip></q-btn
                  >
                  <q-btn icon="money_off" @click="fixOrder(props.row, -2)"
                    ><q-tooltip>{{ $t("payoutOrder.status02") }}</q-tooltip></q-btn
                  >
                  <q-btn icon="person_off" @click="fixOrder(props.row, -1)"
                    ><q-tooltip>{{ $t("payoutOrder.status01") }}</q-tooltip></q-btn
                  >
                  <q-btn icon="check_circle" @click="fixOrder(props.row, 6)"
                    ><q-tooltip>{{ $t("payoutOrder.status6") }}</q-tooltip></q-btn
                  >
                </q-btn-group>
              </q-popup-proxy>
            </q-btn>
            <q-btn icon="add_alert" color="primary" flat round>
              <q-tooltip>{{ $t("reNotify") }}</q-tooltip>
              <q-popup-proxy>
                <q-card class="q-pa-sm">
                  <q-card-section>
                    {{ $t("reNotifyConfirm") }}
                  </q-card-section>
                  <q-card-actions>
                    <q-btn size="sm" flat :label="$t('cancel')" v-close-popup />
                    <q-btn
                      size="sm"
                      color="negative"
                      :label="$t('confirm')"
                      @click="reNotify(props.row.id)"
                    />
                  </q-card-actions>
                </q-card>
              </q-popup-proxy>
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
            <q-field :label="$t('payoutOrder.channelCode')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.channelCode }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-6">
            <q-field :label="$t('payoutOrder.merchantName')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.merchantName }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-6">
            <q-field :label="$t('payoutOrder.id')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.id }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-6">
            <q-field :label="$t('payoutOrder.tradeId')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.tradeId }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-6">
            <q-field :label="$t('payoutOrder.status')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{
                    instance.status > 0
                      ? $t(`payoutOrder.status${instance.status}`)
                      : $t(`payoutOrder.status0${-instance.status}`)
                  }}
                </div>
              </template>
            </q-field>
          </div>

          <div class="col-6">
            <q-field :label="$t('payoutOrder.amount')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.amount || 0.0 }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-6">
            <q-field :label="$t('payoutOrder.accountNumber')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.accountNumber }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-6">
            <q-field :label="$t('payoutOrder.firstName')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.firstName }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-6">
            <q-field :label="$t('payoutOrder.lastName')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.lastName }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-6">
            <q-field :label="$t('payoutOrder.bankName')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.bankName }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-6">
            <q-field :label="$t('payoutOrder.bankCode')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.bankCode }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-12">
            <q-field :label="$t('payoutOrder.remark')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.remark }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-12">
            <q-field :label="$t('payoutOrder.failureReason')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.failureReason }}
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
import { payoutOrder } from "../api/payoutOrder";
import { useI18n } from "vue-i18n";
import { useQuasar } from "quasar";
export default defineComponent({
  name: "PagePayoutOrder",
  setup() {
    const { t: $t } = useI18n();
    const $q = useQuasar();

    const columns = [
      {
        name: "id",
        label: $t("payoutOrder.id"),
        align: "center",
        field: (row) => row.id,
        format: (val) => `${val}`,
      },
      {
        name: "merchantName",
        label: $t("payoutOrder.merchantName"),
        align: "center",
        field: (row) => row.merchantName,
        format: (val) => `${val}`,
      },
      {
        name: "channelCode",
        label: $t("payoutOrder.channelCode"),
        align: "center",
        field: (row) => row.channelCode,
        format: (val) => `${val}`,
      },
      {
        name: "tradeId",
        label: $t("payoutOrder.tradeId"),
        align: "center",
        field: (row) => row.tradeId,
        format: (val) => `${val}`,
      },
      {
        name: "urt",
        label: "UTR",
        align: "center",
        field: (row) => row.urt || "",
        format: (val) => `${val}`,
      },
      {
        name: "amount",
        label: $t("payoutOrder.amount"),
        align: "center",
        field: (row) => row.amount,
        format: (val) => (val ? `${val / 100}` : "0.00"),
      },
      {
        name: "fee",
        label: $t("payoutOrder.fee"),
        align: "center",
        field: (row) => row.fee,
        format: (val) => (val ? `${val / 100}` : "0.00"),
      },
      // {
      //   name: "firstName",
      //   label: $t("payoutOrder.firstName"),
      //   align: "center",
      //   field: (row) => row.firstName,
      //   format: (val) => `${val}`,
      // },
      // {
      //   name: "lastName",
      //   label: $t("payoutOrder.lastName"),
      //   align: "center",
      //   field: (row) => row.lastName,
      //   format: (val) => `${val}`,
      // },
      {
        name: "createTime",
        label: $t("payoutOrder.createTime"),
        align: "center",
        field: (row) => row.createTime,
      },
      {
        name: "remark",
        label: $t("payoutOrder.remark"),
        align: "left",
        field: (row) => row.remark,
        format: (val) =>
          val ? (val.length > 36 ? val.substring(0, 34) + "..." : val) : "",
      },
      {
        name: "status",
        label: $t("payoutOrder.status"),
        align: "center",
        field: (row) => row.status,
        format: (val) =>
          val > 0 ? $t(`payoutOrder.status${val}`) : $t(`payoutOrder.status0${-val}`),
      },
    ];
    const condition = ref({
      id: "",
      channelCode: "",
      tradeId: "",
      merchantName: "",
      status: 0,
      createTimeRange: {
        start: "",
        end: "",
      },
    });
    const instance = ref({
      id: "",
      merchantId: "",
      merchantName: "",
      channelId: "",
      channelCode: "",
      subChannelId: "",
      merchantChannelId: "",
      tradeId: "",
      amount: 0,
      fee: 0,
      remark: "",
      accountNumber: "",
      firstName: "",
      lastName: "",
      bankName: "",
      branchName: "",
      state: "",
      bankCode: "",
      bankCountry: "",
      failureReason: "",
      status: 0,
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
        const resp = await payoutOrder.paginate({
          offset,
          limit: rowsPerPage,
          id: condition.value.id,
          channelCode: condition.value.channelCode,
          tradeId: condition.value.tradeId,
          merchantName: condition.value.merchantName,
          status: condition.value.status,
          "createTimeRange.start": condition.value.createTimeRange.start,
          "createTimeRange.end": condition.value.createTimeRange.end,
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

    function fixOrder(row, status) {
      $q.dialog({
        title: "Fix Order",
        message: "Reason",
        prompt: {
          model: "",
          type: "text",
        },
        cancel: true,
      }).onOk((reason) => {
        payoutOrder
          .fix({
            id: row.id,
            status: status,
            failureReason: reason,
          })
          .then((response) => {
            if (response.code === 0) {
              $q.dialog({ message: $t("success") });
              getData({ pagination: pagination.value });
            } else {
              $q.dialog({ message: $t("failed") });
            }
          });
      });
    }

    async function reNotify(id) {
      const resp = await payoutOrder.renotify(id);
      if (resp.code === 0) {
        $q.dialog({ message: $t("success") });
      } else {
        $q.dialog({ message: $t("failed") });
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
      fixOrder,
      reNotify,
    };
  },
});
</script>

<style></style>
