<template>
  <q-card class="bg-grey-1 relative-position" style="min-width: 400px">
    <q-card-section>
      <img src="~assets/paid.png" class="absolute-top-right" />
      <div class="q-pa-sm q-gutter-xs column">
        <div class="col q-pa-xs text-h5 text-weight-bold">Transaction Successful</div>
        <div class="col q-pa-xs text-h4 text-weight-bolder">₹ {{ amount / 100 }}</div>
        <div class="col q-pa-xs">Reference no: {{ utr }}</div>
        <div class="col q-pa-xs">Created on: {{ createTime }}</div>
        <div class="col q-pa-xs">Order ID: {{ id }}</div>
        <div class="col q-pa-xs q-mt-md text-h6 bg-grey-4 text-weight-bold">
          BENEFICIARY DETAILS
        </div>
        <div class="col q-pa-xs row justify-between">
          <div>Transaction Type:</div>
          <div class="text-weight-bolder">Disbursed to Bank -IMPS</div>
        </div>
        <div class="col q-pa-xs row justify-between">
          <div>Beneficiary Account No.</div>
          <div class="text-weight-bolder">{{ accountNumber }}</div>
        </div>
        <div class="col q-pa-xs row justify-between">
          <div>IFSC</div>
          <div class="text-weight-bolder">{{ bankCode }}</div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "PayoutProof",
  props: {
    amount: {
      type: Number,
      required: true,
    },
    utr: {
      type: String,
      default: "",
    },
    createTime: {
      type: String,
    },
    id: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
    },
    bankCode: {
      type: String,
      required: true,
    },
  },
});
</script>

<style></style>
