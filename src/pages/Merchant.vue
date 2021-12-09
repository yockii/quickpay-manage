<template>
  <q-page class="q-pa-md q-gutter-md">
    <q-breadcrumbs>
      <q-breadcrumbs-el icon="home" />
      <q-breadcrumbs-el :label="$t('navigation.merchant')" icon="shopping_basket" />
    </q-breadcrumbs>
    <!-- 筛选条件 -->
    <div class="items-start q-gutter-md row">
      <q-input v-model="condition.id"  :label="$t('merchantField.id')" />
      <q-input v-model="condition.name"  :label="$t('merchantField.name')" />
      <!-- <q-space /> -->
      <q-btn class="self-end" icon="search">
        <q-tooltip>{{ $t('search') }}</q-tooltip>
      </q-btn>
      <q-btn class="self-end" color="primary" icon="add" @click="openAddDialog">
        <q-tooltip>{{ $t('add') }}</q-tooltip>
      </q-btn>
    </div>
    <!-- 表格 -->
    <q-table :rows="rows" :columns="columns" row-key="id" v-model:pagination="pagination" :loading="loading" @request="getData">
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th>
          <q-th>{{ $t('operation') }}</q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">{{ col.value }}</q-td>
          <q-td>
            <q-btn flat color="primary" round icon="o_info">
              <q-tooltip>{{ $t('showDetail') }}</q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>

  <q-dialog v-model="dialogAdd">
    <q-card style="width: 300px;" class="q-px-sm q-pb-md">
      <q-card-section>
        <div class="text-h6">{{ $t('add') }}</div>
      </q-card-section>
      <q-card-section>
        <q-input v-model="instance.name" :label="$t('merchantField.name')" />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat :label="$t('cancel')" v-close-popup/>
        <q-btn :label="$t('confirm')" @click="add"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import {merchant} from '../api/merchant'
import { useI18n } from "vue-i18n";
import {useQuasar} from 'quasar'
export default defineComponent ({
  name: 'PageMerchant',
  setup() {
    const { t: $t } = useI18n();
    const $q = useQuasar()
   
   const columns = [
      {name: 'id', label: $t('merchantField.id'), align: 'center', field: row => row.id, format: val => `${val}`},
      {name: 'name', label: $t('merchantField.name'), align: 'center', field: row => row.name, format: val => `${val}`},
      {name: 'balance', label: $t('merchantField.balance'), align: 'center', field: row => row.balance, format: val => val ? `${val/100}` : '0.00'},
      {name: 'frozen', label: $t('merchantField.frozen'), align: 'center', field: row => row.frozen, format: val => val ? `${val/100}` : '0.00'},
      {name: 'totalIncome', label: $t('merchantField.totalIncome'), align: 'center', field: row => row.totalIncome, format: val =>  val ? `${val/100}` : '0.00'},
      {name: 'totalRealIncome', label: $t('merchantField.totalRealIncome'), align: 'center', field: row => row.totalRealIncome, format: val =>  val ? `${val/100}` : '0.00'},
      {name: 'totalPayout', label: $t('merchantField.totalPayout'), align: 'center', field: row => row.totalPayout, format: val =>  val ? `${val/100}` : '0.00'},
    ]
    const condition = ref({
      id: '',
      name: ''
    })
    const instance = ref({
      id: '',
      name: '',
      balance: 0,
      frozen: 0,
      totalIncome: 0,
      totalRealIncome: 0,
      totalPayout: 0
    })
    const rows = ref([])
    const loading = ref(false)
    const pagination = ref({
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0
    })
    async function getData(props) {
      loading.value = true
      const {page, rowsPerPage} = props.pagination
      const offset = (page - 1) * rowsPerPage
      try {
        const resp = await merchant.paginate({
          offset, limit: rowsPerPage,
          id: condition.value.id,
          name: condition.value.name,
        })
        if (resp.code === 0) {
          rows.value = resp.data.items || []
          pagination.value.page = page
          pagination.value.rowsPerPage = rowsPerPage
          pagination.value.rowsNumber = resp.data.total
        }
      } finally {
        loading.value = false
      }
    }

    function resetInstance() {
      instance.value.id = ""
      instance.value.name = ""
      instance.value.balance = 0
      instance.value.frozen = 0
      instance.value.totalIncome = 0
      instance.value.totalRealIncome = 0
      instance.value.totalPayout = 0
    }

    const dialogAdd= ref(false)
    function openAddDialog() {
      resetInstance()
      dialogAdd.value = true
    }
    async function add() {
      if (instance.value.name === '') {
        return
      }
      try {
        const resp = await merchant.add(instance.value)
        if (resp.code === 0 ) {
          $q.dialog({message: $t('success')})
          dialogAdd.value= false
          getData({pagination: pagination.value})
        } else if (resp.code === -10005) {
          $.dialog({message: $t('duplicate')})
        }
      } finally {

      }

    }

    onMounted(() => {
      getData({pagination: pagination.value})
    })
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
      add
    }
  }
})
</script>

<style>

</style>