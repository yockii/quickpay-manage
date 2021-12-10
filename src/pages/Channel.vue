<template>
  <q-page class="q-pa-md q-gutter-md">
    <q-breadcrumbs>
      <q-breadcrumbs-el icon="home" />
      <q-breadcrumbs-el :label="$t('navigation.channel')" icon="streetview" />
    </q-breadcrumbs>
    <!-- 筛选条件 -->
    <div class="items-start q-gutter-md row">
      <q-input v-model="condition.code" :label="$t('channel.code')" />
      <q-input v-model="condition.name" :label="$t('channel.name')" />
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
              icon="redo"
              :to="`/subChannel?channelId=${props.row.id}&channelCode=${props.row.code}`"
            >
              <q-tooltip>{{ $t("showSubChannel") }}</q-tooltip>
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
        <q-input v-model="instance.name" :label="$t('channel.name')" />
        <q-input v-model="instance.code" :label="$t('channel.code')" />
        <q-select
          :label="$t('channel.type')"
          v-model="instance.type"
          :options="typeOptions"
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

  <q-dialog v-model="dialogUpdate">
    <q-card style="width: 600px; max-width: 80vw" class="q-px-sm q-pb-md">
      <q-card-section>
        <div class="text-h6">{{ $t("update") }}</div>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col-6">
            <q-input :label="$t('channel.name')" v-model="instance.name" />
          </div>
          <div class="col-6">
            <q-input :label="$t('channel.code')" v-model="instance.code" />
          </div>
          <div class="col-6">
            <q-select
              :label="$t('channel.type')"
              v-model="instance.type"
              :options="typeOptions"
              emit-value
              map-options
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
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { channel } from "../api/channel";
import { useI18n } from "vue-i18n";
import { useQuasar } from "quasar";
export default defineComponent({
  name: "PageChannel",
  setup() {
    const { t: $t } = useI18n();
    const $q = useQuasar();

    const columns = [
      {
        name: "name",
        label: $t("channel.name"),
        align: "center",
        field: (row) => row.name,
        format: (val) => `${val}`,
      },
      {
        name: "name",
        label: $t("channel.code"),
        align: "center",
        field: (row) => row.code,
        format: (val) => `${val}`,
      },
      {
        name: "type",
        label: $t("channel.type"),
        align: "center",
        field: (row) => row.type,
        format: (val) => (val == 1 ? $t("channel.type1") : $t("channel.type2")),
      },
      {
        name: "balance",
        label: $t("channel.balance"),
        align: "center",
        field: (row) => row.balance,
        format: (val) => (val ? `${val / 100}` : "0.00"),
      },
      {
        name: "frozen",
        label: $t("channel.frozen"),
        align: "center",
        field: (row) => row.frozen,
        format: (val) => (val ? `${val / 100}` : "0.00"),
      },
      {
        name: "totalIncome",
        label: $t("channel.totalIncome"),
        align: "center",
        field: (row) => row.totalIncome,
        format: (val) => (val ? `${val / 100}` : "0.00"),
      },
      {
        name: "totalRealIncome",
        label: $t("channel.totalRealIncome"),
        align: "center",
        field: (row) => row.totalRealIncome,
        format: (val) => (val ? `${val / 100}` : "0.00"),
      },
      {
        name: "totalPayout",
        label: $t("channel.totalPayout"),
        align: "center",
        field: (row) => row.totalPayout,
        format: (val) => (val ? `${val / 100}` : "0.00"),
      },
      {
        name: "state",
        label: $t("channel.state"),
        align: "center",
        field: (row) => row.state,
        format: (val) => (val == 1 ? $t("available") : $t("unavailable")),
      },
    ];
    const condition = ref({
      code: "",
      name: "",
      type: 0,
    });
    const instance = ref({
      id: "",
      name: "",
      code: "",
      type: 1,
      state: 1,
      balance: 0,
      frozen: 0,
      totalIncome: 0,
      totalRealIncome: 0,
      totalPayout: 0,
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
        const resp = await channel.paginate({
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

    function resetInstance() {
      instance.value.id = "";
      instance.value.name = "";
      instance.value.code = "";
      instance.value.type = 1;
      instance.value.state = 0;
      instance.value.balance = 0;
      instance.value.frozen = 0;
      instance.value.totalIncome = 0;
      instance.value.totalRealIncome = 0;
      instance.value.totalPayout = 0;
    }

    const dialogAdd = ref(false);
    function openAddDialog() {
      resetInstance();
      dialogAdd.value = true;
    }
    async function add() {
      if (instance.value.name === "" || instance.value.code === "") {
        return;
      }
      try {
        const resp = await channel.add(instance.value);
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
        instance.value.balance = 0;
        instance.value.frozen = 0;
        instance.value.totalIncome = 0;
        instance.value.totalRealIncome = 0;
        instance.value.totalPayout = 0;
        const resp = await channel.update(instance.value);
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
          const resp = await channel.delete(id);
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
      { label: $t("channel.type1"), value: 1 },
      { label: $t("channel.type2"), value: 2 },
    ]);
    const stateOptions = ref([
      { label: $t("available"), value: 1 },
      { label: $t("unavailable"), value: -1 },
    ]);

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
      dialogAdd,
      openAddDialog,
      add,
      dialogInfo,
      openInfoDialog,
      dialogUpdate,
      openUpdateDialog,
      update,
      remove,
      typeOptions,
      stateOptions,
    };
  },
});
</script>

<style></style>
