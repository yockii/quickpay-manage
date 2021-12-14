<template>
  <q-page class="q-pa-md q-gutter-md">
    <q-breadcrumbs>
      <q-breadcrumbs-el icon="home" />
      <q-breadcrumbs-el
        :label="$t('navigation.merchant') + ': ' + merchantName"
        icon="streetview"
      />
      <q-breadcrumbs-el :label="$t('navigation.merchantChannel')" icon="view_stream" />
    </q-breadcrumbs>
    <!-- 筛选条件 -->
    <div class="items-start q-gutter-md row">
      <q-btn class="self-end" color="primary" icon="add" @click="openAddDialog">
        <q-tooltip>{{ $t("add") }}</q-tooltip>
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

            <q-btn flat color="negative" round icon="delete_forever">
              <q-tooltip>{{ $t("delete") }}</q-tooltip>
              <q-popup-proxy>
                <q-card class="q-pa-sm">
                  <q-card-section>
                    {{ $t("deleteConfirm") }}
                  </q-card-section>
                  <q-card-actions>
                    <q-btn size="sm" flat :label="$t('cancel')" v-close-popup />
                    <q-btn
                      size="sm"
                      color="negative"
                      :label="$t('confirm')"
                      @click="remove(props.row.id)"
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

  <q-dialog v-model="dialogAdd">
    <q-card style="width: 300px" class="q-px-sm q-pb-md">
      <q-card-section>
        <div class="text-h6">{{ $t("add") }}</div>
      </q-card-section>
      <q-card-section>
        <q-select
          :label="$t('merchantChannel.channel')"
          v-model="instance.channelId"
          :options="channels"
          option-value="id"
          :option-label="(item) => (item === null ? '' : item.name + ' - ' + item.code)"
          emit-value
          map-options
          @update:model-value="updateSubChannels"
        />
        <q-select
          :label="$t('merchantChannel.subChannel')"
          v-model="instance.subChannelId"
          :options="subChannels"
          option-value="id"
          :option-label="(item) => (item === null ? '' : item.subName)"
          emit-value
          map-options
        />
        <q-input
          v-model.number="instance.maxAmount"
          :label="$t('merchantChannel.maxAmount')"
        />
        <q-input
          v-model.number="instance.minAmount"
          :label="$t('merchantChannel.minAmount')"
        />
        <q-input
          v-model.number="instance.feeRate"
          :label="$t('merchantChannel.feeRate')"
        />
        <q-input
          v-model.number="instance.feeFixed"
          :label="$t('merchantChannel.feeFixed')"
        />
        <q-input
          v-model.number="instance.fixedAmount"
          :label="$t('merchantChannel.fixedAmount')"
        />
        <q-input
          v-model.number="instance.dailyLimit"
          :label="$t('merchantChannel.dailyLimit')"
        />
        <q-input
          v-model.number="instance.dailyAmount"
          :label="$t('merchantChannel.dailyAmount')"
        />
        <q-input v-model="instance.remark" :label="$t('merchantChannel.remark')" />
        <q-select
          :label="$t('channel.state')"
          v-model="instance.state"
          :options="stateOptions"
          emit-value
          map-options
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat :label="$t('cancel')" v-close-popup />
        <q-btn :label="$t('confirm')" @click="add" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="dialogInfo">
    <q-card style="width: 600px; max-width: 80vw" class="q-px-sm q-pb-md">
      <q-card-section>
        <div class="text-h6">{{ $t("detail") }}</div>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col-12">
            <q-select
              readonly
              :label="$t('merchantChannel.channel')"
              v-model="instance.channelId"
              :options="channels"
              option-value="id"
              :option-label="
                (item) => (item === null ? '' : item.name + ' - ' + item.code)
              "
              emit-value
              map-options
            />
          </div>
          <div class="col-6">
            <q-field :label="$t('merchantChannel.maxAmount')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.maxAmount }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-6">
            <q-field :label="$t('merchantChannel.minAmount')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.minAmount }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-6">
            <q-field :label="$t('merchantChannel.feeRate')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.feeRate || 0 }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-6">
            <q-field :label="$t('merchantChannel.feeFixed')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.feeFixed || 0 }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-6">
            <q-field :label="$t('merchantChannel.fixedAmount')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.fixedAmount || 0 }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-6">
            <q-field :label="$t('merchantChannel.dailyLimit')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.dailyLimit }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-6">
            <q-field :label="$t('merchantChannel.dailyAmount')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.dailyAmount }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-6">
            <q-select
              readonly
              :label="$t('merchantChannel.state')"
              v-model="instance.state"
              :options="stateOptions"
              emit-value
              map-options
            />
          </div>
          <div class="col-6">
            <q-field :label="$t('merchantChannel.balance')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.balance || 0.0 }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-6">
            <q-field :label="$t('merchantChannel.frozen')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.frozen || 0.0 }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-6">
            <q-field :label="$t('merchantChannel.totalIncome')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.totalIncome || 0.0 }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-6">
            <q-field :label="$t('merchantChannel.totalMerchantIncome')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.totalMerchantIncome || 0.0 }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-6">
            <q-field :label="$t('merchantChannel.totalPayout')" stack-label>
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

  <q-dialog v-model="dialogUpdate">
    <q-card style="width: 600px; max-width: 80vw" class="q-px-sm q-pb-md">
      <q-card-section>
        <div class="text-h6">{{ $t("update") }}</div>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col-12">
            <q-select
              :label="$t('merchantChannel.channel')"
              v-model="instance.channelId"
              :options="channels"
              option-value="id"
              :option-label="
                (item) => (item === null ? '' : item.name + ' - ' + item.code)
              "
              emit-value
              map-options
            />
          </div>
          <div class="col-6">
            <q-input
              v-model.number="instance.maxAmount"
              :label="$t('merchantChannel.maxAmount')"
            />
          </div>
          <div class="col-6">
            <q-input
              v-model.number="instance.minAmount"
              :label="$t('merchantChannel.minAmount')"
            />
          </div>
          <div class="col-6">
            <q-input
              v-model.number="instance.feeRate"
              :label="$t('merchantChannel.feeRate')"
            />
          </div>
          <div class="col-6">
            <q-input
              v-model.number="instance.feeFixed"
              :label="$t('merchantChannel.feeFixed')"
            />
          </div>
          <div class="col-6">
            <q-input
              v-model.number="instance.fixedAmount"
              :label="$t('merchantChannel.fixedAmount')"
            />
          </div>
          <div class="col-6">
            <q-input
              v-model.number="instance.dailyLimit"
              :label="$t('merchantChannel.dailyLimit')"
            />
          </div>
          <div class="col-6">
            <q-input
              v-model.number="instance.dailyAmount"
              :label="$t('merchantChannel.dailyAmount')"
            />
          </div>
          <div class="col-6">
            <q-select
              :label="$t('channel.state')"
              v-model="instance.state"
              :options="stateOptions"
              emit-value
              map-options
            />
          </div>
          <div class="col-12">
            <q-input v-model="instance.remark" :label="$t('merchantChannel.remark')" />
          </div>
        </div>
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
import { channel } from "../api/channel";
import { subChannel } from "../api/subChannel";
import { merchantChannel } from "../api/merchantChannel";
import { useI18n } from "vue-i18n";
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";
export default defineComponent({
  name: "PageMerchantChannel",
  setup() {
    const { t: $t } = useI18n();
    const $q = useQuasar();
    const $route = useRoute();

    const merchantName = $route.query.merchantName;
    const merchantId = $route.query.merchantId;

    const columns = [
      {
        name: "channelId",
        label: $t("merchantChannel.channel"),
        align: "center",
        field: (row) => row.channelId,
        format: (val) => {
          for (let c of channels.value) {
            if (c.id === val) {
              return c.name;
            }
          }
          return val;
        },
      },
      {
        name: "subChannelName",
        label: $t("merchantChannel.subChannel"),
        align: "center",
        field: (row) => row.subChannelName,
        format: (val) => `${val}`,
      },
      {
        name: "balance",
        label: $t("merchantChannel.balance"),
        align: "center",
        field: (row) => row.balance,
        format: (val) => `${val}`,
      },
      {
        name: "frozen",
        label: $t("merchantChannel.frozen"),
        align: "center",
        field: (row) => row.frozen,
        format: (val) => `${val}`,
      },
      {
        name: "totalIncome",
        label: $t("merchantChannel.totalIncome"),
        align: "center",
        field: (row) => row.totalIncome,
        format: (val) => `${val}`,
      },
      {
        name: "totalMerchantIncome",
        label: $t("merchantChannel.totalMerchantIncome"),
        align: "center",
        field: (row) => row.totalMerchantIncome,
        format: (val) => `${val}`,
      },
      {
        name: "totalPayout",
        label: $t("merchantChannel.totalPayout"),
        align: "center",
        field: (row) => row.totalPayout,
        format: (val) => `${val}`,
      },
      {
        name: "state",
        label: $t("merchantChannel.state"),
        align: "center",
        field: (row) => row.state,
        format: (val) => (val == 1 ? $t("available") : $t("unavailable")),
      },
    ];

    const instance = ref({
      id: "",
      merchantId: merchantId,
      channelId: "",
      subChannelId: "",
      maxAmount: -1,
      minAmount: -1,
      feeRate: 0,
      feeFixed: 0,
      fixedAmount: 0,
      dailyLimit: -1,
      dailyAmount: -1,
      remark: "",
      state: 1,
      balance: 0,
      frozen: 0,
      totalIncome: 0,
      totalMerchantIncome: 0,
      totalPayout: 0,
    });
    const rows = ref([]);
    const loading = ref(false);
    const pagination = ref({
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0,
      merchantId,
    });
    async function getData(props) {
      loading.value = true;
      const { page, rowsPerPage } = props.pagination;
      const offset = (page - 1) * rowsPerPage;
      try {
        const resp = await merchantChannel.paginate({
          offset,
          limit: rowsPerPage,
        });
        if (resp.code === 0) {
          rows.value = resp.data.items || [];
          rows.value.forEach((row) => {
            row.maxAmount = row.maxAmount == -1 ? -1 : row.maxAmount / 100;
            row.minAmount = row.minAmount == -1 ? -1 : row.minAmount / 100;
            row.dailyLimit = row.dailyLimit == -1 ? -1 : row.dailyLimit / 100;
            row.dailyAmount = row.dailyAmount == -1 ? -1 : row.dailyAmount / 100;
            row.fixedAmount = row.fixedAmount == -1 ? -1 : row.fixedAmount / 100;
            row.balance = row.balance ? row.balance / 100 : 0;
            row.frozen = row.frozen ? row.frozen / 100 : 0;
            row.totalIncome = row.totalIncome ? row.totalIncome / 100 : 0;
            row.totalMerchantIncome = row.totalMerchantIncome
              ? row.totalMerchantIncome / 100
              : 0;
            row.totalPayout = row.totalPayout ? row.totalPayout / 100 : 0;
          });
          pagination.value.page = page;
          pagination.value.rowsPerPage = rowsPerPage;
          pagination.value.rowsNumber = resp.data.total;
        }
      } finally {
        loading.value = false;
      }
    }

    function resetInstance() {
      instance.value.id = "";
      instance.value.merchantId = merchantId;
      instance.value.channelId = "";
      instance.value.subChannelId = "";
      instance.value.maxAmount = -1;
      instance.value.minAmount = -1;
      instance.value.feeRate = 0;
      instance.value.feeFixed = 0;
      instance.value.fixedAmount = 0;
      instance.value.dailyLimit = -1;
      instance.value.dailyAmount = -1;
      instance.value.remark = "";
      instance.value.state = 1;
      instance.value.balance = 0;
      instance.value.frozen = 0;
      instance.value.totalIncome = 0;
      instance.value.totalMerchantIncome = 0;
      instance.value.totalPayout = 0;
    }

    function dealNumber(obj) {
      if (obj.fixedAmount < 0) {
        obj.fixedAmount = -1;
      } else {
        obj.fixedAmount = parseInt(obj.fixedAmount * 100);
      }
      if (obj.maxAmount < 0) {
        obj.maxAmount = -1;
      } else {
        obj.maxAmount = parseInt(obj.maxAmount * 100);
      }
      if (obj.minAmount < 0) {
        obj.minAmount = -1;
      } else {
        obj.minAmount = parseInt(obj.minAmount * 100);
      }
      if (obj.dailyLimit < 0) {
        obj.dailyLimit = -1;
      } else {
        obj.dailyLimit = parseInt(obj.dailyLimit * 100);
      }
      if (obj.dailyAmount < 0) {
        obj.dailyAmount = -1;
      } else {
        obj.dailyAmount = parseInt(obj.dailyAmount * 100);
      }
    }

    const dialogAdd = ref(false);
    function openAddDialog() {
      resetInstance();
      dialogAdd.value = true;
    }
    async function add() {
      try {
        const obj = {};
        Object.assign(obj, instance.value);
        dealNumber(obj);

        const resp = await merchantChannel.add(obj);
        if (resp.code === 0) {
          $q.dialog({ message: $t("success") });
          dialogAdd.value = false;
          getData({ pagination: pagination.value });
        } else if (resp.code === -10005) {
          $.dialog({ message: $t("duplicate") });
        }
      } finally {
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
        const obj = {};
        Object.assign(obj, instance.value);
        dealNumber(obj);

        obj.balance = 0;
        obj.frozen = 0;
        obj.totalIncome = 0;
        obj.totalMerchantIncome = 0;
        obj.totalPayout = 0;
        const resp = await merchantChannel.update(obj);
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

    async function remove(id) {
      if (id) {
        try {
          const resp = await merchantChannel.delete(id);
          if (resp.code === 0) {
            $q.dialog({ message: $t("success") });
            getData({ pagination: pagination.value });
          } else {
            $q.dialog({ message: $t("failed") });
          }
        } finally {
        }
      }
    }

    const stateOptions = ref([
      { label: $t("available"), value: 1 },
      { label: $t("unavailable"), value: -1 },
    ]);

    const channels = ref([]);
    const subChannels = ref([]);
    async function updateSubChannels() {
      let channelId = instance.value.channelId;
      try {
        const resp = await subChannel.paginate({
          offset: -1,
          limit: -1,
          channelId: channelId,
        });
        if (resp.code === 0) {
          subChannels.value = resp.data.items || [];
        }
      } finally {
      }
    }

    onMounted(() => {
      getData({ pagination: pagination.value });
      channel.paginate({ offset: -1, limit: -1 }).then((resp) => {
        if (resp.code === 0) {
          channels.value = resp.data.items || [];
        }
      });
    });
    return {
      merchantName,
      instance,
      columns,
      rows,
      loading,
      pagination,
      getData,
      dialogAdd,
      openAddDialog,
      add,
      dialogInfo,
      openInfoDialog,
      dialogUpdate,
      openUpdateDialog,
      update,
      remove,
      stateOptions,
      channels,
      updateSubChannels,
      subChannels,
    };
  },
});
</script>

<style></style>
