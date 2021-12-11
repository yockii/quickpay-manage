<template>
  <q-page class="q-pa-md q-gutter-md">
    <q-breadcrumbs>
      <q-breadcrumbs-el icon="home" />
      <q-breadcrumbs-el :label="$t('navigation.authorize')" icon="verified_user" />
    </q-breadcrumbs>
    <!-- 筛选条件 -->
    <div class="items-start q-gutter-md row">
      <q-input v-model="condition.roleName" :label="$t('role.roleName')" />
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
          <q-td class="text-center">
            <q-btn
              flat
              color="primary"
              round
              icon="checklist"
              @click="openResourceDialog(props.row)"
            >
              <q-tooltip>{{ $t("dispatch") }}</q-tooltip>
            </q-btn>
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
    <q-card style="width: 600px; max-width: 80vw" class="q-px-sm q-pb-md">
      <q-card-section>
        <div class="text-h6">{{ $t("add") }}</div>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <q-input
            class="col-6"
            v-model="instance.roleName"
            :label="$t('role.roleName')"
          />
          <q-input
            class="col-6"
            v-model="instance.roleDesc"
            :label="$t('role.roleDesc')"
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
        <q-field :label="$t('role.roleName')" stack-label>
          <template v-slot:control>
            <div class="self-center full-width no-outline" tabindex="0">
              {{ instance.roleName }}
            </div>
          </template>
        </q-field>
        <q-field :label="$t('role.roleDesc')" stack-label>
          <template v-slot:control>
            <div class="self-center full-width no-outline" tabindex="0">
              {{ instance.roleDesc }}
            </div>
          </template>
        </q-field>
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
            <q-input :label="$t('role.roleName')" v-model="instance.roleName" />
          </div>
          <div class="col-6">
            <q-input :label="$t('role.roleDesc')" v-model="instance.roleDesc" />
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat :label="$t('cancel')" v-close-popup />
        <q-btn :label="$t('confirm')" @click="update" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="dialogResource">
    <q-card style="width: 600px; max-width: 80vw" class="q-px-sm q-pb-md">
      <q-card-section>
        <div class="text-h6">{{ currentRole.roleName }}</div>
      </q-card-section>
      <q-card-section>
        <q-list bordered>
          <q-item tag="label" v-for="resource in resources" :key="resource.id">
            <q-item-section side top>
              <q-checkbox v-model="resource.checked" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ resource.resourceName }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat :label="$t('cancel')" v-close-popup />
        <q-btn :label="$t('confirm')" @click="dispatch" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { resource } from "../api/resource";
import { role } from "../api/role";
import { useI18n } from "vue-i18n";
import { useQuasar } from "quasar";
export default defineComponent({
  name: "PageRole",
  setup() {
    const { t: $t } = useI18n();
    const $q = useQuasar();

    const columns = [
      {
        name: "roleName",
        label: $t("role.roleName"),
        align: "center",
        field: (row) => row.roleName,
        format: (val) => `${val}`,
      },
      {
        name: "roleDesc",
        label: $t("role.roleDesc"),
        align: "center",
        field: (row) => row.roleDesc,
        format: (val) => `${val || ""}`,
      },
    ];
    const condition = ref({
      roleName: "",
    });
    const instance = ref({
      id: "",
      roleName: "",
      roleDesc: "",
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
        const resp = await role.paginate({
          offset,
          limit: rowsPerPage,
          username: condition.value.username,
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
      instance.value.roleName = "";
      instance.value.roleDesc = "";
    }

    const dialogAdd = ref(false);
    function openAddDialog() {
      resetInstance();
      dialogAdd.value = true;
    }
    async function add() {
      if (instance.value.roleName === "") {
        return;
      }
      try {
        const resp = await role.add(instance.value);
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
        const resp = await role.update(instance.value);
        if (resp.code === 0) {
          if (resp.data) {
            $q.dialog({ message: $t("success") });
            dialogUpdate.value = false;
            getData({ pagination: pagination.value });
          } else {
            $q.dialog({ message: $t("failed") });
          }
        } else if (resp.code === -10005) {
          $.dialog({ message: $t("duplicate") });
        }
      } finally {
      }
    }

    async function remove(id) {
      if (id) {
        try {
          const resp = await role.delete(id);
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

    const resources = ref([]);

    const currentRole = ref({
      id: "",
      roleName: "",
      roleDesc: "",
    });
    const dialogResource = ref(false);
    async function openResourceDialog(r) {
      currentRole.value = r;
      try {
        const resp = await role.getResourceIds(r.id);
        if (resp.code === 0) {
          const isSuper = resp.data.super;
          if (isSuper) {
            $q.dialog({ message: $t("noModifyWithSuper") });
            return;
          }

          const ids = resp.data.ids || [];
          resources.value.forEach((resource) => {
            for (let id of ids) {
              if (resource.id === id) {
                resource.checked = true;
                return;
              }
            }
            resource.checked = false;
          });
        }
        dialogResource.value = true;
      } finally {
      }
    }
    async function dispatch() {
      const rIds = [];
      resources.value.forEach((resource) => {
        if (resource.checked) {
          rIds.push(resource.id);
        }
      });
      try {
        const resp = await role.dispatchResources({
          roleId: currentRole.value.id,
          resourceIds: rIds,
        });
        if (resp.code === 0) {
          $q.dialog({ message: $t("success") });
          dialogResource.value = false;
        }
      } finally {
      }
    }

    onMounted(() => {
      getData({ pagination: pagination.value });
      resource
        .paginate({
          limit: -1,
          offset: -1,
        })
        .then((resp) => {
          resources.value = resp.data.items || [];
        });
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
      resources,
      currentRole,
      dialogResource,
      openResourceDialog,
      dispatch,
    };
  },
});
</script>

<style></style>
