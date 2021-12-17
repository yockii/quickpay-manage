<template>
  <q-page class="q-pa-md q-gutter-md">
    <q-breadcrumbs>
      <q-breadcrumbs-el icon="home" />
      <q-breadcrumbs-el
        :label="$t('navigation.channel') + ': ' + channelCode"
        icon="streetview"
        to="/channel"
      />
      <q-breadcrumbs-el :label="$t('navigation.subChannel')" icon="account_tree" />
    </q-breadcrumbs>
    <!-- 筛选条件 -->
    <div class="items-start q-gutter-md row">
      <q-input v-model="condition.subName" :label="$t('subChannel.subName')" />
      <!-- <q-space /> -->
      <q-btn class="self-end" icon="search" @click="getData({ pagination })">
        <q-tooltip>{{ $t("search") }}</q-tooltip>
      </q-btn>
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

            <q-btn
              flat
              color="primary"
              round
              icon="calculate"
              @click="openDialogCalcFee(props.row)"
            >
              <q-tooltip>{{ $t("testFee") }}</q-tooltip>
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
    <q-card style="width: 600px; max-width: 80vw" class="q-px-sm q-pb-md">
      <q-card-section>
        <div class="text-h6">{{ $t("add") }}</div>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <q-input
            class="col-6"
            v-model="instance.subName"
            :label="$t('subChannel.subName')"
          />
          <q-select
            :label="$t('subChannel.type')"
            v-model="instance.type"
            :options="typeOptions"
            emit-value
            map-options
          />
          <q-input
            class="col-6"
            v-model.number="instance.maxAmount"
            :label="$t('subChannel.maxAmount')"
          />
          <q-input
            class="col-6"
            v-model.number="instance.minAmount"
            :label="$t('subChannel.minAmount')"
          />
          <q-input
            type="textarea"
            class="col-12"
            v-model.number="instance.feeExpr"
            :label="$t('subChannel.feeExpr')"
          />
          <q-input
            class="col-6"
            v-model.number="instance.feeRate"
            :label="$t('subChannel.feeRate')"
          />
          <q-input
            class="col-6"
            v-model.number="instance.feeFixed"
            :label="$t('subChannel.feeFixed')"
          />
          <q-input
            class="col-6"
            v-model.number="instance.fixedAmount"
            :label="$t('subChannel.fixedAmount')"
          />
          <q-input
            class="col-6"
            v-model.number="instance.dailyLimit"
            :label="$t('subChannel.dailyLimit')"
          />
          <q-input
            class="col-6"
            v-model.number="instance.dailyAmount"
            :label="$t('subChannel.dailyAmount')"
          />
          <q-input
            class="col-6"
            v-model="instance.merchantNo"
            :label="$t('subChannel.merchantNo')"
          />
          <q-input
            class="col-6"
            v-model="instance.secretKey"
            :label="$t('subChannel.secretKey')"
          />
          <q-input
            class="col-6"
            v-model="instance.secretToken"
            :label="$t('subChannel.secretToken')"
          />
          <q-input
            class="col-6"
            v-model="instance.secretExt1"
            :label="$t('subChannel.secretExt1')"
          />
          <q-input
            class="col-6"
            v-model="instance.secretExt2"
            :label="$t('subChannel.secretExt2')"
          />
          <q-input
            class="col-6"
            v-model="instance.virtualAccountId"
            :label="$t('subChannel.virtualAccountId')"
          />
          <q-input
            class="col-6"
            v-model="instance.remark"
            :label="$t('subChannel.remark')"
          />
          <q-select
            class="col-6"
            :label="$t('subChannel.state')"
            v-model="instance.state"
            :options="stateOptions"
            emit-value
            map-options
          />
        </div>
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
          <div class="col-6">
            <q-field :label="$t('subChannel.subName')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.subName }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-6">
            <q-select
              readonly
              :label="$t('subChannel.type')"
              v-model="instance.type"
              :options="typeOptions"
              emit-value
              map-options
            />
          </div>
          <div class="col-6">
            <q-field :label="$t('subChannel.merchantNo')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.merchantNo }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-6">
            <q-select
              readonly
              :label="$t('subChannel.state')"
              v-model="instance.state"
              :options="stateOptions"
              emit-value
              map-options
            />
          </div>
          <div class="col-6">
            <q-field :label="$t('subChannel.maxAmount')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.maxAmount || 0.0 }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-6">
            <q-field :label="$t('subChannel.minAmount')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.minAmount || 0.0 }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-12">
            <q-input
              type="textarea"
              readonly
              :label="$t('subChannel.feeExpr')"
              v-model="instance.feeExpr"
            />
          </div>
          <div class="col-6">
            <q-field :label="$t('subChannel.feeRate')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.feeRate || 0.0 }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-6">
            <q-field :label="$t('subChannel.feeFixed')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.feeFixed || 0.0 }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-6">
            <q-field :label="$t('subChannel.fixedAmount')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.fixedAmount || 0.0 }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-6">
            <q-field :label="$t('subChannel.dailyLimit')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.dailyLimit || 0.0 }}
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-6">
            <q-field :label="$t('subChannel.dailyAmount')" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ instance.dailyAmount || 0.0 }}
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
          <div class="col-6">
            <q-input :label="$t('subChannel.subName')" v-model="instance.subName" />
          </div>
          <div class="col-6">
            <q-select
              :label="$t('subChannel.type')"
              v-model="instance.type"
              :options="typeOptions"
              emit-value
              map-options
            />
          </div>
          <div class="col-6">
            <q-input :label="$t('subChannel.merchantNo')" v-model="instance.merchantNo" />
          </div>
          <div class="col-6">
            <q-input :label="$t('subChannel.secretKey')" v-model="instance.secretKey" />
          </div>
          <div class="col-6">
            <q-input
              :label="$t('subChannel.secretToken')"
              v-model="instance.secretToken"
            />
          </div>
          <div class="col-6">
            <q-input :label="$t('subChannel.secretExt1')" v-model="instance.secretExt1" />
          </div>
          <div class="col-6">
            <q-input :label="$t('subChannel.secretExt2')" v-model="instance.secretExt2" />
          </div>
          <div class="col-6">
            <q-input
              :label="$t('subChannel.virtualAccountId')"
              v-model="instance.virtualAccountId"
            />
          </div>
          <div class="col-6">
            <q-input :label="$t('subChannel.remark')" v-model="instance.remark" />
          </div>
          <div class="col-6">
            <q-input
              :label="$t('subChannel.maxAmount')"
              v-model.number="instance.maxAmount"
            />
          </div>
          <div class="col-6">
            <q-input
              :label="$t('subChannel.minAmount')"
              v-model.number="instance.minAmount"
            />
          </div>
          <div class="col-12">
            <q-input
              :label="$t('subChannel.feeExpr')"
              v-model.number="instance.feeExpr"
            />
          </div>
          <div class="col-6">
            <q-input
              :label="$t('subChannel.feeRate')"
              v-model.number="instance.feeRate"
            />
          </div>
          <div class="col-6">
            <q-input
              :label="$t('subChannel.feeFixed')"
              v-model.number="instance.feeFixed"
            />
          </div>
          <div class="col-6">
            <q-input
              :label="$t('subChannel.fixedAmount')"
              v-model.number="instance.fixedAmount"
            />
          </div>
          <div class="col-6">
            <q-input
              :label="$t('subChannel.dailyLimit')"
              v-model.number="instance.dailyLimit"
            />
          </div>
          <div class="col-6">
            <q-input
              :label="$t('subChannel.dailyAmount')"
              v-model.number="instance.dailyAmount"
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
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat :label="$t('cancel')" v-close-popup />
        <q-btn :label="$t('confirm')" @click="update" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="dialogTestFee">
    <q-card class="q-px-sm q-pb-md">
      <q-card-section>
        <div class="text-h6">
          {{ $t("testFee") }}
        </div>
      </q-card-section>
      <q-card-actions>
        <q-input v-model.number="testAmount" label="Amount" />
      </q-card-actions>
      <q-card-actions align="right">
        <q-btn flat :label="$t('cancel')" v-close-popup />
        <q-btn :label="$t('confirm')" @click="calcFee" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { subChannel } from "../api/subChannel";
import { useI18n } from "vue-i18n";
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";
export default defineComponent({
  name: "PageSubChannel",
  setup() {
    const { t: $t } = useI18n();
    const $q = useQuasar();
    const $route = useRoute();

    const columns = [
      {
        name: "subName",
        label: $t("subChannel.subName"),
        align: "center",
        field: (row) => row.subName,
        format: (val) => `${val}`,
      },
      {
        name: "type",
        label: $t("subChannel.type"),
        align: "center",
        field: (row) => row.type,
        format: (val) => (val == 1 ? $t("subChannel.type1") : $t("subChannel.type2")),
      },
      {
        name: "merchantNo",
        label: $t("subChannel.merchantNo"),
        align: "center",
        field: (row) => row.merchantNo,
        format: (val) => `${val}`,
      },
      {
        name: "maxAmount",
        label: $t("subChannel.maxAmount"),
        align: "center",
        field: (row) => row.maxAmount,
        format: (val) => `${val}`,
      },
      {
        name: "minAmount",
        label: $t("subChannel.minAmount"),
        align: "center",
        field: (row) => row.minAmount,
        format: (val) => `${val}`,
      },
      {
        name: "feeRate",
        label: $t("subChannel.feeRate"),
        align: "center",
        field: (row) => row.feeRate,
        format: (val) => `${val}%`,
      },
      {
        name: "feeFixed",
        label: $t("subChannel.feeFixed"),
        align: "center",
        field: (row) => row.feeFixed,
        format: (val) => `${val}`,
      },
      {
        name: "dailyLimit",
        label: $t("subChannel.dailyLimit"),
        align: "center",
        field: (row) => row.dailyLimit,
        format: (val) => `${val}`,
      },
      {
        name: "dailyAmount",
        label: $t("subChannel.dailyAmount"),
        align: "center",
        field: (row) => row.dailyAmount,
        format: (val) => `${val}`,
      },
      {
        name: "state",
        label: $t("subChannel.state"),
        align: "center",
        field: (row) => row.state,
        format: (val) => (val == 1 ? $t("available") : $t("unavailable")),
      },
    ];
    const condition = ref({
      channelId: "",
      subName: "",
      state: 0,
      type: 0,
    });
    const instance = ref({
      id: "",
      channelId: "",
      subName: "",
      type: 1,
      merchantNo: "",
      secretKey: "",
      secretToken: "",
      secretExt1: "",
      secretExt2: "",
      virtualAccountId: "",
      remark: "",
      state: 1,
      maxAmount: 1,
      minAmount: 0,
      feeExpr: "",
      feeRate: 0.0,
      feeFixed: 0,
      fixedAmount: 0,
      dailyLimit: 0,
      dailyAmount: 0,
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
        const resp = await subChannel.paginate({
          offset,
          limit: rowsPerPage,
          channelId: condition.value.channelId,
          subName: condition.value.subName,
        });
        if (resp.code === 0) {
          rows.value = resp.data.items || [];
          rows.value.forEach((o) => {
            o.fixedAmount = o.fixedAmount ? o.fixedAmount / 100 : 0;
            o.maxAmount = o.maxAmount ? o.maxAmount / 100 : 0;
            o.minAmount = o.minAmount ? o.minAmount / 100 : 0;
            o.feeFixed = o.feeFixed ? o.feeFixed / 100 : 0;
            o.dailyLimit = o.dailyLimit ? o.dailyLimit / 100 : 0;
            o.dailyAmount = o.dailyAmount ? o.dailyAmount / 100 : 0;
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
      instance.value.subName = "";
      instance.value.type = 1;
      instance.value.merchantNo = "";
      instance.value.secretKey = "";
      instance.value.secretToken = "";
      instance.value.secretExt1 = "";
      instance.value.secretExt2 = "";
      instance.value.virtualAccountId = "";
      instance.value.remark = "";
      instance.value.state = 1;
      instance.value.maxAmount = 0;
      instance.value.minAmount = 0;
      instance.value.feeExpr = "";
      instance.value.feeRate = 0.0;
      instance.value.feeFixed = 0;
      instance.value.fixedAmount = 0;
      instance.value.dailyLimit = 0;
      instance.value.dailyAmount = 0;
    }

    function dealAmount(o) {
      o.fixedAmount = parseInt(o.fixedAmount * 100);
      o.maxAmount = parseInt(o.maxAmount * 100);
      o.minAmount = parseInt(o.minAmount * 100);
      o.feeFixed = parseInt(o.feeFixed * 100);
      o.dailyLimit = parseInt(o.dailyLimit * 100);
      o.dailyAmount = parseInt(o.dailyAmount * 100);
    }

    const dialogAdd = ref(false);
    function openAddDialog() {
      resetInstance();
      dialogAdd.value = true;
    }
    async function add() {
      if (
        instance.value.subName === "" ||
        instance.value.merchantNo === "" ||
        instance.value.secretKey === ""
      ) {
        return;
      }
      try {
        const obj = {};
        Object.assign(obj, instance.value);
        dealAmount(obj);
        const resp = await subChannel.add(obj);
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
        dealAmount(obj);
        const resp = await subChannel.update(obj);
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
          const resp = await subChannel.delete(id);
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

    const typeOptions = ref([
      { label: $t("subChannel.type1"), value: 1 },
      { label: $t("subChannel.type2"), value: 2 },
    ]);
    const stateOptions = ref([
      { label: $t("available"), value: 1 },
      { label: $t("unavailable"), value: -1 },
    ]);

    const channelCode = ref("");

    // test fee
    const dialogTestFee = ref(false);
    const testAmount = ref(0);
    function openDialogCalcFee(row) {
      instance.value = row;
      dialogTestFee.value = true;
    }
    async function calcFee() {
      let amount = parseInt(testAmount.value * 100);
      let resp = await subChannel.testFee({
        id: instance.value.id,
        amount,
      });
      if (resp.code === 0) {
        let msg = resp.msg || "";
        msg += ", result: " + (resp.data || 0) / 100;
        $q.dialog({ message: msg });
      }
    }
    onMounted(() => {
      condition.value.channelId = $route.query.channelId;
      instance.value.channelId = $route.query.channelId;
      channelCode.value = $route.query.channelCode;
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
      channelCode,
      typeOptions,
      openDialogCalcFee,
      dialogTestFee,
      testAmount,
      calcFee,
    };
  },
});
</script>

<style></style>
